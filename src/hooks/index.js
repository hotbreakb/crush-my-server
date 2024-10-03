import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys } from '../api/factory';

export const useSignUp = ({ onSuccess, onError }) =>
  useMutation({
    mutationFn: queryKeys.auth.signUp.mutationFn,
    onSuccess,
    onError,
  });

export const useReissueToken = () => useMutation(queryKeys.auth.reissueToken.mutationFn);

export const useGetClickResult = (memberId) => useQuery(queryKeys.click.result(memberId));

export const useClickRequest = () => useMutation(queryKeys.click.request.mutationFn);

export const useEnterChatRoom = () => useMutation(queryKeys.chat.enter.mutationFn);
export const useLeaveChatRoom = () => useMutation(queryKeys.chat.leave.mutationFn);
export const useGetChatMessages = ({ senderId, chatRoomId }) =>
  useQuery(queryKeys.chat.messages({ senderId, chatRoomId }));
export const useReceiveStompMessage = () => useMutation(queryKeys.chat.stomp.mutationFn);
