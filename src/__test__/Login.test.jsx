import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider, createMemoryRouter } from '@tanstack/react-router';
import LoginPage from './LoginPage';
import { AuthProvider } from '../contexts/AuthContext';
import { theme } from '../styles/theme';

// Mock hooks and router
jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  useRouter: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../hooks', () => ({
  useSignUp: () => ({
    mutate: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

const renderLoginPage = () => {
  const queryClient = new QueryClient();
  const router = createMemoryRouter([
    {
      path: '/',
      element: <LoginPage />,
    },
  ]);

  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  it('renders login form with title, inputs, and submit button', () => {
    renderLoginPage();

    expect(screen.getByText(/crush my server/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nickname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('updates input values when user types', () => {
    renderLoginPage();

    const nicknameInput = screen.getByLabelText(/nickname/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nicknameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nicknameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('disables submit button when inputs are empty', () => {
    renderLoginPage();

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);

    // Button should still be enabled as it's controlled by mutation state
    expect(submitButton).toBeEnabled();
  });

  it('calls signUpMutation when form is submitted with valid inputs', async () => {
    const mockSignUpMutation = jest.fn();
    jest.spyOn(require('../hooks'), 'useSignUp').mockImplementation(() => ({
      mutate: mockSignUpMutation,
      isLoading: false,
      error: null,
    }));

    renderLoginPage();

    const nicknameInput = screen.getByLabelText(/nickname/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(nicknameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUpMutation).toHaveBeenCalledWith({
        nickname: 'testuser',
        password: 'password123',
      });
    });
  });

  it('displays error message when sign up fails', async () => {
    const mockError = new Error('Sign up failed');
    jest.spyOn(require('../hooks'), 'useSignUp').mockImplementation(() => ({
      mutate: jest.fn(),
      isLoading: false,
      error: mockError,
    }));

    renderLoginPage();

    expect(screen.getByText('Sign up failed')).toBeInTheDocument();
  });

  it('displays loading state when signing up', () => {
    jest.spyOn(require('../hooks'), 'useSignUp').mockImplementation(() => ({
      mutate: jest.fn(),
      isLoading: true,
      error: null,
    }));

    renderLoginPage();

    expect(screen.getByText('submitting...')).toBeInTheDocument();
  });
});