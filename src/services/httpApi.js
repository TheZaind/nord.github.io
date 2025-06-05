// HTTP-basierte Alternative für PythonAnywhere
import config from '../config/config';

class HttpApiService {
  constructor() {
    this.baseUrl = `${config.API_URL}/api`;
    this.pollingInterval = null;
    this.lastMessageId = null;
    this.messageListeners = [];
  }

  async getChannels() {
    try {
      const response = await fetch(`${this.baseUrl}/channels`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching channels:', error);
      return [];
    }
  }
  async getMessages(channelId) {
    try {
      const response = await fetch(`${this.baseUrl}/channels/${channelId}/messages`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(channelId, message, user) {
    try {
      const response = await fetch(`${this.baseUrl}/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            content: message.content,
            type: message.type,
            file: message.fileData
          },
          user: user
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async uploadFile(file, channelId, user) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('channel_id', channelId);
      formData.append('user', JSON.stringify(user));

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData
      });

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Polling für neue Nachrichten
  startPolling(channelId, onNewMessage) {
    this.stopPolling();
    
    this.pollingInterval = setInterval(async () => {
      try {
        const messages = await this.getMessages(channelId);
        const newMessages = this.lastMessageId 
          ? messages.filter(msg => msg.timestamp > this.lastMessageId)
          : [];
        
        if (newMessages.length > 0) {
          this.lastMessageId = newMessages[newMessages.length - 1].timestamp;
          newMessages.forEach(onNewMessage);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Poll alle 2 Sekunden
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

export default new HttpApiService();
