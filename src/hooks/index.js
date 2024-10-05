import { QueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '../api/factory';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
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

export const useReissueToken = () => useMutation(queryKeys.auth.reissueToken.mutationFn);

export const useGetClickResult = (memberId) => useQuery(queryKeys.click.result(memberId));

export const useClickRequest = () => useMutation(queryKeys.click.request.mutationFn);

export const useEnterChatRoom = () =>
  useQuery({
    queryKey: queryKeys.chat.enter.queryKey,
    queryFn: queryKeys.chat.enter.queryFn,
  });

export const useLeaveChatRoom = ({ senderId }) =>
  useQuery({
    queryKey: queryKeys.chat.leave.queryKey,
    queryFn: queryKeys.chat.leave.queryFn({ senderId }),
    enabled: !!senderId,
  });

export const useGetChatMessages = ({ senderId }) =>
  useQuery({
    queryKey: queryKeys.chat.messages.queryKey,
    queryFn: queryKeys.chat.messages.queryFn({ senderId }),
    enabled: !!senderId,
  });

export const useReceiveStompMessage = () => useMutation(queryKeys.chat.stomp.mutationFn);
