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
import audio from '../../src/assets/audio/computer-fan.mp3';

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
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef();

  const isConnected = socketService?.getIsConnected() ?? false;
  const errorMessage = socketService?.getErrorMessage() ?? '';

  const signOutMutation = useSignOut({
    onSuccess: () => {
      signOut();
      leaveChatRoom();
      router.navigate('/login');
    },
  });

  const { refetch: leaveChatRoom } = useLeaveChatRoom({
    senderId: user.id,
    enabled: false,
  });

  useEnterChatRoom({
    senderId: user.id,
    enabled: Boolean(user.id),
  });

  const { messages, addMessage } = useGetChatMessages({
    senderId: user.id,
    select: (data) => data.groupChatMessageResponses,
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

  const handleCloseToast = () => {
    socketService.setErrorMessage('');
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const result = !prev;
      if (!result) audioRef.current.play();
      else audioRef.current.pause();
      return result;
    });
  };

  const handleRequestClick = () => {
    if (isConnected) clickRequest({ memberId: user.id });
  };

  useEffect(() => {
    if (!user.nickname || !user.id) return;

    const newSocketService = new SocketService({
      onConnect: () => {
        setSocketService((prev) => {
          if (prev) {
            prev.disconnect();
          }
          return newSocketService;
        });
      },
      onMessage: (topic, message) => {
        const parsedMessage = JSON.parse(message);

        if (!topic.includes('/sub/click')) {
          addMessage(parsedMessage);
        }
      },
    });

    newSocketService.connect(user.nickname);

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
                  $isPending={isPending}
                  onClick={handleRequestClick}
                />
                <S.Count>my count : {data?.count ?? 0}</S.Count>
              </S.Action>
              <S.CPUImageWrapper>
                <S.AudioButton $isMuted={isMuted} alt="audio" onClick={toggleMute} />
                <audio ref={audioRef} src={audio} loop />
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
          {signOutMutation.error && (
            <S.ErrorMessage>{signOutMutation.error.message}</S.ErrorMessage>
          )}
        </S.SignOutWrapper>
        <Chat
          messages={messages}
          currentUser={user}
          onSendMessage={handleSendMessage}
          disabled={!socketService?.getIsConnected()}
        />
      </S.Content>
    </S.Wrapper>
  );
};

export default HomePage;
