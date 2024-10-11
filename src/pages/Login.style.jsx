import styled from 'styled-components';

import { flexCenter } from '../styles/flexStyle';

export const S = {
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
  TitleWrapper: styled.div`
    ${flexCenter};
    gap: 3.375rem;
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
  CPUImage: styled.img`
    width: 16%;
    object-fit: contain;
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
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 2px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0 4px 6px ${({ theme }) => theme.colors.shadow}66;
    transition: all 0.3s ease;
    margin-top: 1rem;

    &:hover {
      transform: translateY(-2px);
      background: ${({ theme }) => theme.colors.primary};
      border-color: ${({ theme }) => theme.colors.text};
      box-shadow: 0 6px 12px ${({ theme }) => theme.colors.shadow}99;
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 4px ${({ theme }) => theme.colors.shadow}66;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
      border-color: ${({ theme }) => theme.colors.border};
    }
  `,
  ErrorMessage: styled.span`
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSizes.medium};
    color: ${({ theme }) => theme.colors.error};
  `,
};
