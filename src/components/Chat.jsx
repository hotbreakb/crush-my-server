import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { flexColumn, flexCenter } from '../styles/flexStyle';
import submit from '../../src/assets/images/submit.png';

const groupMessages = (messages) => {
  return messages.reduce((groups, message, index) => {
    if (index === 0 || !message.nickname || message.nickname !== messages[index - 1].nickname) {
      groups.push([message]);
    } else {
      groups[groups.length - 1].push(message);
    }
    return groups;
  }, []);
};

export const Chat = ({ messages, currentUser, onSendMessage, disabled }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const groupedMessages = groupMessages(messages);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <S.ChattingWrapper>
      <S.ChatContainer>
        {groupedMessages.map((group, groupIndex) => (
          <S.MessageGroup key={groupIndex}>
            {group.map((message, index) => {
              if (!message.nickname)
                return <S.SystemMessage key={message.uuid}>{message.content}</S.SystemMessage>;

              const isCurrentUser = message.nickname === currentUser.nickname;

              return (
                <S.UserMessage key={message.uuid} isCurrentUser={isCurrentUser}>
                  {index === 0 && !isCurrentUser && (
                    <S.NicknameLabel>{message.nickname}</S.NicknameLabel>
                  )}
                  <S.MessageBubble isCurrentUser={isCurrentUser}>{message.content}</S.MessageBubble>
                </S.UserMessage>
              );
            })}
          </S.MessageGroup>
        ))}
        <div ref={messagesEndRef} />
      </S.ChatContainer>

      <S.UserInput>
        <S.Input
          placeholder="채팅을 입력하세요"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        <S.Submit onClick={handleSend} disabled={disabled} alt="메시지 전송하기">
          <S.SendImage src={submit} alt="전송하기 이미지" />
        </S.Submit>
      </S.UserInput>
    </S.ChattingWrapper>
  );
};

const S = {
  ChattingWrapper: styled.div`
    ${flexColumn};
    height: 100vh;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => theme.spacing.large};

    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      width: 50%;
    }
  `,
  ChatContainer: styled.div`
    ${flexColumn};
    flex: 1;
    height: 100%;
    overflow-y: auto;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    gap: ${({ theme }) => theme.spacing.small};
    padding-right: ${({ theme }) => theme.spacing.small};
  `,
  MessageGroup: styled.div`
    ${flexColumn};
    gap: 0.3125rem;
  `,
  SystemMessage: styled.div`
    ${flexColumn};
    align-items: center;
  `,
  UserMessage: styled.div`
    ${flexColumn};
    align-items: ${(props) => (props.isCurrentUser ? 'flex-end' : 'flex-start')};
  `,
  NicknameLabel: styled.span`
    color: #888;
    margin-bottom: 2px;
    font-size: ${({ theme }) => theme.fontSizes.small};
  `,
  MessageBubble: styled.div`
    background-color: ${({ theme }) => theme.colors.secondary};
    padding: ${({ theme }) => theme.spacing.small};
    border-radius: 10px;
    max-width: 70%;
    word-wrap: break-word;
  `,
  UserInput: styled.div`
    max-height: 50px;
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
  Input: styled.input`
    flex: 1;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 30px;
    background: transparent;
    padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.colors.text};
  `,
  Submit: styled.button`
    ${flexCenter};
    height: 100%;
    border-radius: 50%;
    aspect-ratio: 1;
    background-color: #d9d9d9;

    :hover {
      background-color: #cdcdcd;
    }

    :disabled {
      user-select: none;
    }
  `,
  SendImage: styled.img`
    max-height: 25px;
    object-fit: contain;
  `,
};
