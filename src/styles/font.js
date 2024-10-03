import { css } from 'styled-components';

import SilkscreenBold from '../assets/fonts/Silkscreen/Silkscreen-Bold.ttf';
import Silkscreen from '../assets/fonts/Silkscreen/Silkscreen-Regular.ttf';

const fontFaces = css`
  @font-face {
    font-family: 'Silkscreen';
    src: url(${Silkscreen}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Silkscreen';
    src: url(${SilkscreenBold}) format('truetype');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
`;
export default fontFaces;
