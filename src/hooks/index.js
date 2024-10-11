import { QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/factory';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const authRequest = async (request) => {
  try {
    const response = await request(axiosInstance);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const newTokens = await queryKeys.auth.reissueToken.mutationFn();

        localStorage.setItem('accessToken', newTokens.accessToken);
        localStorage.setItem('refreshToken', newTokens.refreshToken);

        const retryResponse = await request(axiosInstance);
        return retryResponse.data;
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        throw new Error('Authentication failed');
      }
    }

    throw error;
  }
};

export const useSignUp = ({ onSuccess, onError }) =>
  useMutation({
    mutationFn: queryKeys.auth.signUp.mutationFn,
    onSuccess,
    onError,
  });

export const useSignOut = ({ onSuccess, onError }) =>
  useMutation({
    mutationFn: queryKeys.auth.signOut.mutationFn,
    onSuccess,
    onError,
  });

export const useReissueToken = () => useMutation(queryKeys.auth.reissueToken.mutationFn);

export const useGetClickResult = ({ memberId, select, onSuccess, onError }) =>
  useQuery({
    queryKey: queryKeys.click.result(memberId).queryKey,
    queryFn: queryKeys.click.result(memberId).queryFn,
    select,
    onSuccess,
    onError,
  });

export const useClickRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: queryKeys.click.request.mutationFn,
    onSuccess: (variables) => {
      queryClient.invalidateQueries(queryKeys.click.result(variables.memberId).queryKey);
    },
    onError: (error) => {
      console.error('Click request failed:', error);
    },
  });
};

export const useEnterChatRoom = ({ senderId, onSuccess, onError, enabled }) =>
  useQuery({
    queryKey: queryKeys.chat.enter(senderId).queryKey,
    queryFn: queryKeys.chat.enter(senderId).queryFn,
    onSuccess,
    onError,
    enabled,
  });

export const useLeaveChatRoom = ({ senderId, onSuccess, onError, enabled }) =>
  useQuery({
    queryKey: queryKeys.chat.leave(senderId).queryKey,
    queryFn: queryKeys.chat.leave(senderId).queryFn,
    onSuccess,
    onError,
    enabled,
  });

export const useGetChatMessages = ({ senderId, select, onSuccess, onError, enabled }) =>
  useQuery({
    queryKey: queryKeys.chat.messages(senderId).queryKey,
    queryFn: queryKeys.chat.messages(senderId).queryFn,
    select,
    onSuccess,
    onError,
    enabled,
  });

export const useReceiveStompMessage = () => useMutation(queryKeys.chat.stomp.mutationFn);
