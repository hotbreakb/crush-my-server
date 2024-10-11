import styled, { css } from 'styled-components';

import { flexColumn, flexCenter } from '../styles/flexStyle';

import requestButton from '../../src/assets/images/request-button.png';
import requestButtonActivated from '../../src/assets/images/request-button-activated.png';
import audio from '../../src/assets/images/audio.png';
import audioMute from '../../src/assets/images/audio-mute.png';

export const RANK_COLORS = ['#FF0000', '#FFA800', '#FFF500', '#0EB500', '#1B32FF'];

export const S = {
  Wrapper: styled.div`
    ${flexColumn}
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};
  `,
  Content: styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;

    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      flex-direction: row;
    }
  `,
  SignOutWrapper: styled.div`
    ${flexColumn};
    justify-content: space-between;
    width: 100%;
    padding: ${({ theme }) => theme.spacing.large};
    gap: 2rem;

    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      width: 50%;
    }
  `,
  CountWrapper: styled.div`
    ${flexColumn}
  `,
  ButtonWrapper: styled.div`
    display: flex;
    justify-content: space-between;
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
  CountButton: styled.button`
    ${flexCenter};
    width: 73%;
    aspect-ratio: 140 / 64;
    background-color: transparent;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    :disabled {
      user-select: none;
    }

    ${(props) => css`
      background-image: url(${props.isPending ? requestButtonActivated : requestButton});
    `}
  `,
  CPUImageWrapper: styled.div`
    display: flex;
    gap: 10%;
    align-items: flex-end;
  `,
  AudioButton: styled.button`
    width: 4rem;
    height: 4rem;
    position: relative;
    background-color: transparent;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    ${(props) => css`
      background-image: url(${props.isMuted ? audioMute : audio});
    `}
  `,
  CPUImage: styled.img`
    width: 10rem;
    object-fit: contain;
  `,
  SignOutButton: styled.button`
    width: 100%;
    height: 3rem;
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
  `,
};
