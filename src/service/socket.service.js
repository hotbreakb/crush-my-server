import { Client } from '@stomp/stompjs';
import { CHAT_ROOM_ID } from '../api/factory';

const SOCKET_URL = 'wss://crash-my-server.site/ws';

class SocketService {
  constructor(props) {
    this.client = null;
    this.activeSubscriptions = new Map();
    this.processedMessages = new Set();
    this.isConnected = false;
    this.reconnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.nickname = '';
    this.props = props;
  }

  connect(nickname) {
    if (this.isConnected) return;

    this.nickname = nickname;
    this.client = new Client({
      brokerURL: SOCKET_URL,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: this.handleConnect,
      onStompError: this.handleStompError,
      onWebSocketClose: this.handleWebSocketClose,
    });

    this.client.activate();
  }

  handleConnect = () => {
    console.log('STOMP Connected');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.subscribeToTopics();
    this.props.onConnect();
  };

  handleStompError = (frame) => {
    console.error('STOMP Error:', frame.headers['message']);
    this.isConnected = false;

    const errorMessage = frame.headers['message'];
    if (errorMessage.includes('Authentication failed')) {
      this.props.onConnectionError('인증에 실패했습니다. 다시 로그인해주세요.');
    } else if (errorMessage.includes('Server unavailable')) {
      this.props.onConnectionError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } else {
      this.props.onConnectionError('연결 중 오류가 발생했습니다.');
    }

    this.handleReconnect();
  };

  handleWebSocketClose = () => {
    console.log('WebSocket Closed');
    this.isConnected = false;
    this.unsubscribeAll();
    this.handleReconnect();
  };

  handleReconnect = () => {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.reconnecting) {
      this.reconnecting = true;
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.client?.activate();
        this.reconnecting = false;
      }, 5000);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      this.props.onConnectionError(
        '최대 재연결 시도 횟수를 초과했습니다. 페이지를 새로고침해주세요.'
      );
    }
  };

  subscribeToTopics = () => {
    if (!this.client || !this.isConnected) return;

    this.unsubscribeAll();

    const chatTopics = [
      `/sub/enter/${CHAT_ROOM_ID}`,
      `/sub/group-chat/${CHAT_ROOM_ID}`,
      `/sub/leave/${CHAT_ROOM_ID}`,
    ];
    const clickTopics = [`/sub/click/${this.nickname}`, '/sub/click-rank'];
    const topics = [...chatTopics, ...clickTopics];

    topics.forEach((topic) => {
      if (!this.activeSubscriptions.has(topic)) {
        const subscription = this.client.subscribe(topic, (message) => {
          const messageId = message.headers['message-id'];

          if (!this.processedMessages.has(messageId)) {
            this.processedMessages.add(messageId);

            this.props.onMessage(topic, message.body);

            setTimeout(() => {
              this.processedMessages.delete(messageId);
            }, 60000);
          } else {
            console.log(`Duplicate message received on ${topic}:`, messageId);
          }
        });
        this.activeSubscriptions.set(topic, subscription);
      }
    });

    const isChatSubscriptionMissing = chatTopics.some(
      (topic) => !this.activeSubscriptions.has(topic)
    );
    const isClickSubscriptionMissing = clickTopics.some(
      (topic) => !this.activeSubscriptions.has(topic)
    );

    if (isChatSubscriptionMissing) {
      this.props.onChatError();
    }

    if (isClickSubscriptionMissing) {
      this.props.onClickError();
    }
  };

  unsubscribeAll = () => {
    this.activeSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.activeSubscriptions.clear();
  };

  disconnect() {
    this.unsubscribeAll();
    if (this.client) {
      this.client.deactivate();
    }
    this.isConnected = false;
  }
}

export default SocketService;
