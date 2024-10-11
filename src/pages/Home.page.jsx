import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

import { useAuth } from '../contexts';
import SocketService from '../service/socket.service';
import { CHAT_ROOM_ID } from '../api/factory';

import { Chat } from '../components/Chat';
import { Toast } from '../components/Toast';
import {
  useEnterChatRoom,
  useLeaveChatRoom,
  useGetChatMessages,
  useGetClickResult,
  useClickRequest,
} from '../hooks';

const NUM_OF_TOP_RANKING = 5;
const RANK_COLORS = ['#FF0000', '#FFA800', '#FFF500', '#0EB500', '#1B32FF'];

const RankingItem = React.memo(({ info, index }) => (
  <S.Chip>
    <S.Index color={index < NUM_OF_TOP_RANKING ? RANK_COLORS[index] : undefined}>
      {index + 1}
    </S.Index>
    {info.nickname && (
      <span>
        {info.nickname} : {info.count}
      </span>
    )}
  </S.Chip>
));

const HomePage = () => {
  const { user } = useAuth();
  const [socketService, setSocketService] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const shouldLeaveChat = useRef(false);

  const { refetch: enterChatroom } = useEnterChatRoom({
    senderId: user.id,
    onError: () => {
      handleError('채팅방에 입장할 수 없습니다');
    },
    enabled: false,
  });

  const { refetch: leaveChatRoom } = useLeaveChatRoom({
    senderId: user.id,
    onError: () => {
      handleError('채팅방에서 나갈 수 없습니다');
    },
    enabled: false,
  });

  const { refetch: getChatMessages } = useGetChatMessages({
    senderId: user.id,
    select: (data) => data.groupChatMessageResponses,
    onSuccess: (data) => {
      setMessages(data);
    },
    onError: () => {
      handleError('대화 내역을 불러올 수 없습니다.');
    },
  });

  const { data } = useGetClickResult({
    select: (data) => {
      const sorted = Object.entries(data.clickRank)
        .sort((a, b) => a - b)
        .reduce((res, value) => {
          res.push({ nickname: value[0], count: value[1] });
          return res;
        }, []);

      const clickRank = Array.from({ length: 10 }, (_, index) => sorted[index] || { nickname: '' });

      return {
        count: data.count,
        clickRank,
      };
    },
  });

  const { mutate: clickRequest } = useClickRequest();

  const handleRequestClick = () => {
    if (isConnected) clickRequest({ memberId: user.id });
  };

  const handleSendMessage = (message) => {
    if (isConnected) {
      socketService.client.publish({
        destination: `/sub/group-chat/${CHAT_ROOM_ID}`,
        body: JSON.stringify({ nickname: user.nickname, content: message }),
      });
    }
  };

  const handleError = (message) => {
    setErrorMessage(message);
  };

  const handleCloseToast = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    if (!user.nickname) return;

    const newSocketService = new SocketService({
      onConnect: () => {
        setIsConnected(true);
        handleError('');
        enterChatroom();
        getChatMessages();
      },
      onConnectionError: () => {
        setIsConnected(false);
        handleError('연결에 실패했습니다. 일부 기능을 사용할 수 없습니다.');
      },
      onChatError: () => {
        handleError('채팅 기능을 사용할 수 없습니다.');
      },
      onClickError: () => {
        handleError('클릭 기능을 사용할 수 없습니다.');
      },
      onMessage: (topic, message) => {
        const parsedMessage = JSON.parse(message);

        if (!topic.includes('/sub/click')) {
          setMessages((prev) => [...prev, parsedMessage]);
        }
      },
    });

    newSocketService.connect(user.nickname);
    setSocketService(newSocketService);

    const handleBeforeUnload = (event) => {
      shouldLeaveChat.current = true;
      event.preventDefault();
      event.returnValue = '';
    };

    const handleUnload = () => {
      if (shouldLeaveChat.current) {
        leaveChatRoom();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload); // FIXME: deprecated event

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      newSocketService.disconnect();
    };
  }, [user.nickname]);

  return (
    <S.Wrapper>
      <S.Content>
        <S.CountWrapper>
          <S.Title>Crush My Server</S.Title>
          {errorMessage && <Toast message={errorMessage} onClose={handleCloseToast} />}

          <S.ButtonWrapper>
            <S.Action>
              <S.Button onClick={handleRequestClick} disabled={!isConnected}>
                request
              </S.Button>
              <S.Count>my count : {data?.count ?? 0}</S.Count>
            </S.Action>
            <S.Image src="/path-to-your-image.jpg" alt="Descriptive text" />
          </S.ButtonWrapper>
          <S.Ranking>
            {(data?.clickRank ?? []).map((info, index) => (
              <RankingItem key={`${info.nickname}-${index}`} info={info} index={index} />
            ))}
          </S.Ranking>
        </S.CountWrapper>
        <Chat
          messages={messages}
          currentUser={user}
          onSendMessage={handleSendMessage}
          disabled={!isConnected}
        />
      </S.Content>
    </S.Wrapper>
  );
};

export default HomePage;

const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const S = {
  Wrapper: styled.div`
    ${flexColumn}
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};
  `,
  Content: styled.div`
    flex: 1;
    display: flex;
  `,
  CountWrapper: styled.div`
    ${flexColumn}
    width: 50%;
    padding: ${({ theme }) => theme.spacing.large};
  `,
  ButtonWrapper: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  `,
  Action: styled.div`
    ${flexColumn}
    gap: ${({ theme }) => theme.spacing.medium};
  `,
  Count: styled.span`
    color: ${({ theme }) => theme.colors.text};
  `,
  Image: styled.img`
    max-width: 100px;
    height: auto;
  `,
  Ranking: styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-flow: column;
    grid-template-rows: repeat(5, auto);
    gap: ${({ theme }) => theme.spacing.small};
  `,
  Chip: styled.div`
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.small};
    gap: ${({ theme }) => theme.spacing.small};
    padding: ${({ theme }) => theme.spacing.small};
  `,
  Index: styled.span`
    color: ${({ color }) => color || 'inherit'};
    font-weight: bold;
    min-width: 20px;
    text-align: center;
  `,
  Title: styled.h1`
    font-size: ${({ theme }) => theme.fontSizes.large};
    text-shadow: 4px 4px ${({ theme }) => theme.colors.shadow};
    text-transform: capitalize;
    margin-bottom: ${({ theme }) => theme.spacing.large};
    color: ${({ theme }) => theme.colors.text};
  `,
  Button: styled.button`
    ${flexCenter}
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    border: none;
    padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
    border-radius: 6px;
    font-size: ${({ theme }) => theme.fontSizes.medium};
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  `,
};
