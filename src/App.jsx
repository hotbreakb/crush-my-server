import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { AuthProvider } from './contexts';
import router from './router';

import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/globalStyle';
import theme from './styles/theme';
import { queryClient } from './hooks';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
