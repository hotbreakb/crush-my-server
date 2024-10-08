import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const groupMessages = (messages) => {
  return messages.reduce((groups, message, index) => {
    if (index === 0 || message.nickname !== messages[index - 1].nickname) {
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
              const isCurrentUser = message.nickname === currentUser.nickname;

              return (
                <S.MessageWrapper
                  key={`${message.nickname}-${message.content}-${index}`}
                  isCurrentUser={isCurrentUser}
                >
                  {index === 0 && !isCurrentUser && (
                    <S.NicknameLabel>{message.nickname}</S.NicknameLabel>
                  )}
                  <S.MessageBubble isCurrentUser={isCurrentUser}>{message.content}</S.MessageBubble>
                </S.MessageWrapper>
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
        <S.Button onClick={handleSend} disabled={disabled}>
          전송
        </S.Button>
      </S.UserInput>
    </S.ChattingWrapper>
  );
};

const S = {
  ChattingWrapper: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100vh;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => theme.spacing.large};
  `,
  ChatContainer: styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    gap: ${({ theme }) => theme.spacing.small};
    padding-right: ${({ theme }) => theme.spacing.small};
  `,
  MessageGroup: styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3125rem;
  `,
  MessageWrapper: styled.div`
    display: flex;
    flex-direction: column;
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
  Button: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
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
