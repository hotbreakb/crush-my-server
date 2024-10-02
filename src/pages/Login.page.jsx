import React from "react";
import styled from "styled-components";

const LoginPage = () => (
  <S.Wrapper>
    <S.Header />
    <S.Content>
      <S.Title>Crush My Server</S.Title>
      <S.LoginForm>
        <S.InputSection>
          <S.InputLabel>nickname</S.InputLabel>
          <S.Input />
        </S.InputSection>
        <S.InputSection>
          <S.InputLabel>password</S.InputLabel>
          <S.Input type="password" />
        </S.InputSection>
      </S.LoginForm>
      <S.ErrorMessage>TEST</S.ErrorMessage>
    </S.Content>
  </S.Wrapper>
);

export default LoginPage;

const S = {
  Wrapper: styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  `,
  Header: styled.header`
    height: 5.5rem;
    background: ${({ theme }) => theme.colors.header};
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
    min-width: 6rem;
  `,
  Input: styled.input`
    width: 100%;
    height: 3.5rem;
    border-radius: 0.625rem;
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    border: none;
    padding: 0 1rem;

    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      width: 19.5rem;
    }
  `,
  ErrorMessage: styled.span`
    font-weight: 700;
    font-size: ${({ theme }) => theme.fontSizes.medium};
    color: ${({ theme }) => theme.colors.error};
  `,
};
