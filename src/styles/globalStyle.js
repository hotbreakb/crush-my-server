import { createGlobalStyle } from 'styled-components';
import fontFaces from './font';

const GlobalStyle = createGlobalStyle`
  ${fontFaces};
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: 'silkscreen', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  input {
    border: 0;
    padding: 0;
    margin: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
