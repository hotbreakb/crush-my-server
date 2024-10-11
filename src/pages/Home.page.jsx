import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '@tanstack/react-router';

import { useAuth } from '../contexts';
import SocketService from '../service/socket.service';
import { CHAT_ROOM_ID } from '../api/factory';

import { Chat } from '../components/Chat';
import { Toast } from '../components/Toast';
import {
  useSignOut,
  useEnterChatRoom,
  useLeaveChatRoom,
  useGetChatMessages,
  useGetClickResult,
  useClickRequest,
} from '../hooks';

import { S } from './Home.style';
import { RANK_COLORS } from './Home.style';
import cpuChip from '../../src/assets/images/cpu-chip.png';
import cpuChipActivated from '../../src/assets/images/cpu-chip-activated.png';

const NUM_OF_TOP_RANKING = 5;

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
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [socketService, setSocketService] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio('../../src/assets/audio/computer-fan.mp3'));

  const signOutMutation = useSignOut({
    onSuccess: () => {
      signOut();
      leaveChatRoom();
      router.navigate('/login');
    },
    onError: () => {
      handleError('로그아웃을 실패하였습니다');
    },
  });

  const { refetch: leaveChatRoom } = useLeaveChatRoom({
    senderId: user.id,
    onError: () => {
      handleError('채팅방에서 나갈 수 없습니다');
    },
    enabled: false,
  });

  useEnterChatRoom({
    senderId: user.id,
    onError: () => {
      handleError('채팅방에 입장할 수 없습니다');
    },
    enabled: Boolean(user.id),
  });

  useGetChatMessages({
    senderId: user.id,
    select: (data) => data.groupChatMessageResponses,
    onSuccess: (data) => {
      setMessages(data);
    },
    onError: () => {
      handleError('대화 내역을 불러올 수 없습니다');
    },
    enabled: Boolean(user.id),
  });

  const { data } = useGetClickResult({
    select: (data) => {
      const sorted = Object.entries(data.clickRank)
        .sort((a, b) => Number(b[1]) - Number(a[1]))
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

  const { mutate: clickRequest, isPending } = useClickRequest();

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

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    audioRef.current.muted = !isMuted;

    if (!isMuted) audioRef.current.play();
  };

  const handleRequestClick = () => {
    if (isConnected) clickRequest({ memberId: user.id });
  };

  useEffect(() => {
    if (!user.nickname || !user.id) return;

    const newSocketService = new SocketService({
      onConnect: () => {
        setIsConnected(true);
        handleError('');
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

    return () => {
      newSocketService.disconnect();
    };
  }, [user]);

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <S.Wrapper>
      <S.Content>
        <S.SignOutWrapper>
          <S.CountWrapper>
            <S.Title>Crush My Server</S.Title>
            {errorMessage && <Toast message={errorMessage} onClose={handleCloseToast} />}
            <S.ButtonWrapper>
              <S.Action>
                <S.CountButton
                  disabled={isPending || !isConnected}
                  isPending={isPending}
                  onClick={handleRequestClick}
                />
                <S.Count>my count : {data?.count ?? 0}</S.Count>
              </S.Action>
              <S.CPUImageWrapper>
                <S.AudioButton isMuted={isMuted} alt="audio" onClick={toggleMute} />
                <S.CPUImage src={isPending ? cpuChipActivated : cpuChip} alt="CPU Chip" />
              </S.CPUImageWrapper>
            </S.ButtonWrapper>
            <S.Ranking>
              {(data?.clickRank ?? []).map((info, index) => (
                <RankingItem key={`${info.nickname}-${index}`} info={info} index={index} />
              ))}
            </S.Ranking>
          </S.CountWrapper>
          <S.SignOutButton onClick={handleSignOut}>Sign Out</S.SignOutButton>
        </S.SignOutWrapper>
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
