import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';

const NUM_OF_TOP_RANKING = 5;
const RANK_COLORS = ['#FF0000', '#FFA800', '#FFF500', '#0EB500', '#1B32FF'];

const RankingItem = React.memo(({ info, index }) => (
  <S.Chip>
    <S.Index color={index < NUM_OF_TOP_RANKING ? RANK_COLORS[index] : undefined}>
      {index + 1}
    </S.Index>
    <span>
      {info.nickname} : {info.count}
    </span>
  </S.Chip>
));

const ChatMessageItem = React.memo(({ message }) => {
  if (message.type === 'enter' || message.type === 'leave') {
    return <S.SystemMessage>{message.content}</S.SystemMessage>;
  }
  if (message.sender === '나') {
    return (
      <S.MyMessage>
        <S.MessageContent>{message.content}</S.MessageContent>
      </S.MyMessage>
    );
  }
  return (
    <S.OtherMessage>
      <S.SenderName>{message.sender}</S.SenderName>
      <S.MessageContent>{message.content}</S.MessageContent>
    </S.OtherMessage>
  );
});

const HomePage = () => {
  const [myCount, setMyCount] = useState(0);
  const [chatInput, setChatInput] = useState('');

  const rankingData = [
    { nickname: '호랑이', count: 0 },
    { nickname: '사자', count: 0 },
    { nickname: '기린', count: 0 },
    { nickname: '코끼리', count: 0 },
    { nickname: '팬더', count: 0 },
    { nickname: '원숭이', count: 0 },
    { nickname: '캥거루', count: 0 },
    { nickname: '코알라', count: 0 },
    { nickname: '펭귄', count: 0 },
    { nickname: '북극곰', count: 0 },
  ];

  const chatMessages = [
    { type: 'enter', content: '호랑이님이 입장하셨습니다' },
    { type: 'message', sender: '호랑이', content: '안녕' },
    { type: 'message', sender: '나', content: '나도 안녕' },
    { type: 'message', sender: '나', content: '나도 안녕' },
    { type: 'message', sender: '나', content: '나도 안녕' },
    { type: 'message', sender: '나', content: '나도 안녕' },
    { type: 'message', sender: '나', content: '나도 안녕' },
    { type: 'message', sender: '나', content: '나도 안녕' },
    { type: 'message', sender: '나', content: '나도 안녕' },
    { type: 'message', sender: '나', content: '나도 안녕' },
    { type: 'leave', content: '두루미님이 퇴장하셨습니다' },
  ];

  const handleRequest = useCallback(() => {
    setMyCount((prevCount) => prevCount + 1);
  }, []);

  const handleInputChange = useCallback((e) => {
    setChatInput(e.target.value);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (chatInput.trim()) {
      setChatInput('');
    }
  }, [chatInput]);

  return (
    <S.Wrapper>
      <S.Content>
        <S.CountWrapper>
          <S.Title>Crush My Server</S.Title>
          <S.ButtonWrapper>
            <S.Action>
              <S.Button onClick={handleRequest}>request</S.Button>
              <S.Count>my count : {myCount}</S.Count>
            </S.Action>
            <S.Image src="/path-to-your-image.jpg" alt="Descriptive text" />
          </S.ButtonWrapper>
          <S.Ranking>
            {rankingData.map((info, index) => (
              <RankingItem key={info.nickname} info={info} index={index} />
            ))}
          </S.Ranking>
        </S.CountWrapper>

        <S.ChattingWrapper>
          <S.ChatMessages>
            {chatMessages.map((message, index) => (
              <ChatMessageItem key={index} message={message} />
            ))}
          </S.ChatMessages>
          <S.UserInput>
            <S.Input
              placeholder="채팅을 입력하세요"
              value={chatInput}
              onChange={handleInputChange}
            />
            <S.Button onClick={handleSendMessage}>전송</S.Button>
          </S.UserInput>
        </S.ChattingWrapper>
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
    font-size: ${({ theme }) => theme.fontSizes.medium};
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
    ${flexCenter}
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
  ChattingWrapper: styled.div`
    ${flexColumn}
    width: 50%;
    height: 100vh;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => theme.spacing.large};
  `,
  ChatMessages: styled.div`
    ${flexColumn}
    flex: 1;
    overflow-y: auto;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    gap: ${({ theme }) => theme.spacing.small};
    padding-right: ${({ theme }) => theme.spacing.small};
  `,
  UserInput: styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.small};
    padding-top: ${({ theme }) => theme.spacing.medium};
  `,
  SystemMessage: styled.span`
    align-self: center;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => theme.spacing.small};
    font-size: ${({ theme }) => theme.fontSizes.small};
  `,
  MyMessage: styled.div`
    align-self: flex-end;
    max-width: 70%;
  `,
  OtherMessage: styled.div`
    align-self: flex-start;
    max-width: 70%;
  `,
  SenderName: styled.div`
    font-size: ${({ theme }) => theme.fontSizes.small};
    margin-bottom: 4px;
  `,
  MessageContent: styled.div`
    background-color: ${({ theme }) => theme.colors.secondary};
    padding: ${({ theme }) => theme.spacing.small};
    border-radius: 10px;
  `,
  Input: styled.input`
    flex: 1;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 30px;
    background: transparent;
    padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.colors.text};
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
