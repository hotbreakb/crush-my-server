import { Client } from '@stomp/stompjs';
import { CHAT_ROOM_ID } from '../api/factory';

const SOCKET_URL = 'wss://crash-my-server.site/ws';

const SUBSCRIPTION_TOPICS = [
  `/sub/enter/${CHAT_ROOM_ID}`,
  `/sub/group-chat/${CHAT_ROOM_ID}`,
  `/sub/leave/${CHAT_ROOM_ID}`,
  '/sub/click-rank',
];

class SocketService {
  constructor(props) {
    this.client = null;
    this.subscriptions = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.nickname = '';
    this.props = props;
  }

  connect(nickname) {
    this.nickname = nickname;
    this.client = new Client({
      brokerURL: SOCKET_URL,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = this.handleConnect;
    this.client.onStompError = this.handleStompError;
    this.client.onWebSocketClose = this.handleWebSocketClose;

    this.client.activate();
  }

  handleConnect = () => {
    console.log('STOMP Connected');
    this.reconnectAttempts = 0;
    this.subscribeToTopics();
    this.props.onConnect();
  };

  handleStompError = (frame) => {
    console.error('STOMP Error:', frame.headers['message']);
    this.handleReconnect();
    this.props.onConnectionError();
  };

  handleWebSocketClose = () => {
    console.log('WebSocket Closed');
    this.handleReconnect();
  };

  handleReconnect = () => {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => {
        this.client?.activate();
      }, 5000);
    } else {
      console.error('Max reconnect attempts reached');
    }
  };

  subscribeToTopics = () => {
    if (!this.client) return;

    this.subscriptions = SUBSCRIPTION_TOPICS.map((topic) =>
      this.client.subscribe(topic, (message) => {
        this.props.onMessage(topic, message.body);
      })
    );

    // Add click subscription separately as it includes the nickname
    this.subscriptions.push(
      this.client.subscribe(`/sub/click/${this.nickname}`, (message) => {
        this.props.onMessage(`/sub/click/${this.nickname}`, message.body);
      })
    );

    // Check for subscription errors
    if (this.subscriptions.some((sub) => !sub.id)) {
      if (
        [
          `/sub/enter/${CHAT_ROOM_ID}`,
          `/sub/group-chat/${CHAT_ROOM_ID}`,
          `/sub/leave/${CHAT_ROOM_ID}`,
        ].some((topic) => !this.subscriptions.find((sub) => sub.destination === topic)?.id)
      ) {
        this.props.onChatError();
      }
      if (
        [`/sub/click/${this.nickname}`, '/sub/click-rank'].some(
          (topic) => !this.subscriptions.find((sub) => sub.destination === topic)?.id
        )
      ) {
        this.props.onClickError();
      }
    }
  };

  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.client?.deactivate();
  }
}

export default SocketService;
