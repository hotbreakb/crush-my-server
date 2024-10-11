import React, { useState } from 'react';
import { useRouter } from '@tanstack/react-router';

import { useAuth } from '../contexts';
import { useSignUp } from '../hooks';

import { S } from './Login.style';
import cpuChip from '../../src/assets/images/cpu-chip.png';

const LoginPage = () => {
  const { signIn } = useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [connectionError, setConnectionError] = useState('');

  const signUpMutation = useSignUp({
    onSuccess: (data) => {
      signIn(data, nickname);
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
        <S.TitleWrapper>
          <S.Title>crush my server</S.Title>
          <S.CPUImage src={cpuChip} />
        </S.TitleWrapper>
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
