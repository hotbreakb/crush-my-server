import axiosInstance from './instance';

const signUp = async (data) => {
  const response = await axiosInstance.post('/auth/sign-up', data);
  return response.data;
};

const reissueToken = async (memberId) => {
  const response = await axiosInstance.post(`/auth/reissue?memberId=${memberId}`);
  return response.data;
};

const clickRequest = async (memberId) => {
  const response = await axiosInstance.post(`/click?memberId=${memberId}`);
  return response.data;
};

const getClickResult = async (memberId) => {
  const response = await axiosInstance.get(`/click?memberId=${memberId}`);
  return response.data;
};

const enterChatRoom = async ({ senderId, chatRoomId }) => {
  const response = await axiosInstance.get(
    `/group-chat/enter?senderId=${senderId}&chatRoomId=${chatRoomId}`
  );
  return response.data;
};

const leaveChatRoom = async ({ senderId, chatRoomId }) => {
  const response = await axiosInstance.get(
    `/group-chat/leaver?senderId=${senderId}&chatRoomId=${chatRoomId}`
  );
  return response.data;
};

const getChatMessages = async ({ senderId, chatRoomId }) => {
  const response = await axiosInstance.get(
    `/group-chat/messages?senderId=${senderId}&chatRoomId=${chatRoomId}`
  );
  return response.data;
};

const receiveStompMessage = async (data) => {
  const response = await axiosInstance.post('/group-chat/STOMP', data);
  return response.data;
};

export const queryKeys = {
  auth: {
    signUp: {
      mutationFn: signUp,
    },
    reissueToken: {
      mutationFn: reissueToken,
    },
  },
  click: {
    request: {
      mutationFn: clickRequest,
    },
    result: (memberId) => ({
      queryKey: ['clickResult', memberId],
      queryFn: () => getClickResult(memberId),
    }),
  },
  chat: {
    enter: {
      mutationFn: enterChatRoom,
    },
    leave: {
      mutationFn: leaveChatRoom,
    },
    messages: ({ senderId, chatRoomId }) => ({
      queryKey: ['chatMessages', senderId, chatRoomId],
      queryFn: () => getChatMessages({ senderId, chatRoomId }),
    }),
    stomp: {
      mutationFn: receiveStompMessage,
    },
  },
};

// export const TokenResponsePropTypes = PropTypes.shape({
//   accessToken: PropTypes.string.isRequired,
//   refreshToken: PropTypes.string.isRequired,
// });

// export const ErrorResponsePropTypes = PropTypes.shape({
//   exceptionCode: PropTypes.number.isRequired,
//   message: PropTypes.string.isRequired,
// });

// export const ClickResultPropTypes = PropTypes.shape({
//   count: PropTypes.string.isRequired,
//   clickRank: PropTypes.objectOf(PropTypes.string).isRequired,
// });

// export const ChatMessagePropTypes = PropTypes.shape({
//   id: PropTypes.string.isRequired,
//   senderNickname: PropTypes.string.isRequired,
//   content: PropTypes.string.isRequired,
//   createdAt: PropTypes.string.isRequired,
// });

// export const ChatMessagesResponsePropTypes = PropTypes.shape({
//   groupChatMessageResponses: PropTypes.arrayOf(ChatMessagePropTypes).isRequired,
// });
