import axiosInstance from './instance';

export const checkAuth = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

export const getTokenPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
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
