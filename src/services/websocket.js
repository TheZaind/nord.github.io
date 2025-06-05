import io from 'socket.io-client';
import config from '../config/config';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    // Verwende Config-basierte URL
    this.serverUrl = config.WS_URL;
    this.eventListeners = new Map();
  }

  connect(user) {
    return new Promise((resolve, reject) => {
      try {        this.socket = io(this.serverUrl, {
          transports: ['polling'], // Nur polling für PythonAnywhere free
          upgrade: false,
          rememberUpgrade: false,
          forceNew: true
        });

        this.socket.on('connect', () => {
          console.log('🔗 Connected to server');
          this.isConnected = true;
          
          // Join with user information
          this.socket.emit('join_user', { user });
          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('❌ Disconnected from server');
          this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          this.isConnected = false;
          reject(error);
        });

        // Set up event forwarding
        this.setupEventForwarding();

      } catch (error) {
        console.error('WebSocket connection failed:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  setupEventForwarding() {
    const events = [
      'new_message',
      'channel_messages',
      'user_connected',
      'user_disconnected',
      'user_joined_channel',
      'user_left_channel',
      'user_typing',
      'online_users',
      'error'
    ];

    events.forEach(event => {
      this.socket.on(event, (data) => {
        this.notifyListeners(event, data);
      });
    });
  }

  // Event listener management
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
  }

  removeEventListener(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Channel operations
  joinChannel(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_channel', { channel_id: channelId });
    }
  }

  leaveChannel(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_channel', { channel_id: channelId });
    }
  }
  // Message operations
  sendMessage(channelId, message, user) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', {
        channel_id: channelId,
        message: message,
        user: user
      });
      console.log('📤 Sending message via WebSocket:', { channelId, message, user });
    } else {
      console.error('❌ Cannot send message: WebSocket not connected');
    }
  }

  // Typing indicators
  startTyping(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { channel_id: channelId });
    }
  }

  stopTyping(channelId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { channel_id: channelId });
    }
  }

  // File upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.serverUrl}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  // Get channel messages
  async getChannelMessages(channelId) {
    try {
      const response = await fetch(`${this.serverUrl}/api/channels/${channelId}/messages`);
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
