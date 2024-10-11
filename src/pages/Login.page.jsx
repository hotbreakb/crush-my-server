import React, { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAuth } from '../contexts';
import { useSignUp } from '../hooks';
import styled from 'styled-components';

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [connectionError, setConnectionError] = useState('');

  const signUpMutation = useSignUp({
    onSuccess: (data) => {
      login(data, nickname);
      router.navigate({ to: '/' });
    },
    onError: (error) => {
      console.error('Sign up failed', error);
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    setConnectionError('');
    if (!nickname || !password) return;
    signUpMutation.mutate({ nickname, password });
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  return (
    <S.Wrapper>
      <S.Content>
        <S.Title>crush my server</S.Title>
        <S.LoginForm onSubmit={handleSignUp}>
          <S.InputSection>
            <S.InputLabel htmlFor="nickname">nickname</S.InputLabel>
            <S.Input
              required
              id="nickname"
              value={nickname}
              onChange={handleInputChange(setNickname)}
            />
          </S.InputSection>
          <S.InputSection>
            <S.InputLabel htmlFor="password">password</S.InputLabel>
            <S.Input
              required
              id="password"
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
            />
          </S.InputSection>
          <S.SubmitButton type="submit" disabled={signUpMutation.isLoading}>
            {signUpMutation.isLoading ? 'submitting...' : 'sign in'}
          </S.SubmitButton>
        </S.LoginForm>
        {signUpMutation.error && <S.ErrorMessage>{signUpMutation.error.message}</S.ErrorMessage>}
        {connectionError && <S.ErrorMessage>{connectionError}</S.ErrorMessage>}
      </S.Content>
    </S.Wrapper>
  );
};

export default LoginPage;

const S = {
  Wrapper: styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  `,
  Content: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2.25rem;
  `,
  Title: styled.h1`
    font-size: ${({ theme }) => theme.fontSizes.large};
    text-shadow: 4px 4px #1e3445;
    text-transform: capitalize;
    display: flex;
    gap: 3.375rem;

    img {
      max-width: 100%;
      height: auto;
    }
  `,
  LoginForm: styled.form`
    width: 100%;
    max-width: 35.3125rem;
    padding: 2rem;
    border-radius: 1.25rem;
    background: ${({ theme }) => theme.colors.primary};
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      max-width: 90%;
    }
  `,
  InputSection: styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      flex-direction: row;
      align-items: center;
      gap: 1.875rem;
    }
  `,
  InputLabel: styled.label`
    font-size: ${({ theme }) => theme.fontSizes.medium};
    min-width: 9.25rem;
    text-transform: uppercase;
  `,
  Input: styled.input`
    width: 100%;
    height: 3.5rem;
    border-radius: 0.625rem;
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    border: 2px solid transparent;
    padding: 0 1rem;
    transition: border-color 0.3s;

    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      width: 19.5rem;
    }
  `,
  SubmitButton: styled.button`
    width: 100%;
    height: 3.5rem;
    border-radius: 0.625rem;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `,
  ErrorMessage: styled.span`
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSizes.medium};
    color: ${({ theme }) => theme.colors.error};
  `,
};
