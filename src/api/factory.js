import axiosInstance from './instance';

export const CHAT_ROOM_ID = '1';

export const checkAuth = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

const signUp = async (data) => {
  const response = await axiosInstance.post('/auth/sign-up', data);
  return response.data;
};

export const reissueToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axiosInstance.post('/auth/reissue', {
    refreshToken: refreshToken,
  });

  return response.data;
};

const clickRequest = async () => {
  const response = await axiosInstance.post(`/click`);
  return response.data;
};

const getClickResult = async () => {
  const response = await axiosInstance.get(`/click`);
  return response.data;
};

const enterChatRoom = async ({ senderId }) => {
  const response = await axiosInstance.get(`/group-chat/enter`, {
    params: {
      senderId,
      chatRoomId: CHAT_ROOM_ID,
    },
  });
  return response.data;
};

const leaveChatRoom = async ({ senderId }) => {
  const response = await axiosInstance.get(`/group-chat/leave`, {
    params: {
      senderId,
      chatRoomId: CHAT_ROOM_ID,
    },
  });
  return response.data;
};

const getChatMessages = async ({ senderId }) => {
  const response = await axiosInstance.get(`/group-chat/messages`, {
    params: {
      senderId,
      chatRoomId: CHAT_ROOM_ID,
    },
  });
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
    enter: (senderId) => ({
      queryKey: ['chatEnter', senderId],
      queryFn: () => enterChatRoom({ senderId }),
    }),
    leave: {
      queryKey: ['chatLeave'],
      queryFn: leaveChatRoom,
    },
    messages: (senderId) => ({
      queryKey: ['chatMessages', senderId],
      queryFn: () => getChatMessages({ senderId }),
    }),
    stomp: {
      mutationFn: receiveStompMessage,
    },
  },
};
