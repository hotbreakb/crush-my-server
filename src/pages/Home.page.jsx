import React, { useState, useEffect } from "react";
import styled from "styled-components";

const HomePage = (props) => {
  return (
    <S.Wrapper>
      <S.Header />
      <S.Content>
        <S.Title>Crush My Server</S.Title>
      </S.Content>
    </S.Wrapper>
  );
};

export default HomePage;

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
    text-shadow: 4px 4px #1e3445;
    display: flex;
    gap: 3.375rem;

    img {
      max-width: 100%;
      height: auto;
    }
  `,
};
