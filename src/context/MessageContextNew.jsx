import React, { createContext, useContext, useState, useEffect } from 'react';
import webSocketService from '../services/websocket';
import httpApiService from '../services/httpApi';
import config from '../config/config';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [useHttpFallback, setUseHttpFallback] = useState(false);

  useEffect(() => {
    // Set up WebSocket event listeners
    const handleNewMessage = (data) => {
      const { channel_id, message } = data;
      setMessages(prev => ({
        ...prev,
        [channel_id]: [...(prev[channel_id] || []), message]
      }));
    };

    const handleChannelMessages = (data) => {
      const { channel_id, messages: channelMessages } = data;
      setMessages(prev => ({
        ...prev,
        [channel_id]: channelMessages
      }));
    };

    const handleOnlineUsers = (data) => {
      setOnlineUsers(data.users);
    };

    const handleUserTyping = (data) => {
      const { user, channel_id, typing } = data;
      setTypingUsers(prev => {
        const channelTyping = { ...prev[channel_id] } || {};
        if (typing) {
          channelTyping[user.id] = user;
        } else {
          delete channelTyping[user.id];
        }
        return {
          ...prev,
          [channel_id]: channelTyping
        };
      });
    };

    // Add event listeners
    webSocketService.addEventListener('new_message', handleNewMessage);
    webSocketService.addEventListener('channel_messages', handleChannelMessages);
    webSocketService.addEventListener('online_users', handleOnlineUsers);
    webSocketService.addEventListener('user_typing', handleUserTyping);

    // Cleanup
    return () => {
      webSocketService.removeEventListener('new_message', handleNewMessage);
      webSocketService.removeEventListener('channel_messages', handleChannelMessages);
      webSocketService.removeEventListener('online_users', handleOnlineUsers);
      webSocketService.removeEventListener('user_typing', handleUserTyping);
    };
  }, []);  const connectToServer = async (user) => {
    // Check config to decide connection type
    if (!config.USE_WEBSOCKETS) {
      console.log('🔄 Config forces HTTP polling, skipping WebSocket');
      setUseHttpFallback(true);
      setIsConnected(true);
      console.log('✅ Using HTTP polling fallback (forced by config)');
      return;
    }
    
    try {
      await webSocketService.connect(user);
      setIsConnected(true);
      setUseHttpFallback(false);
      console.log('✅ Connected to Discord Clone server via WebSocket');
    } catch (error) {
      console.error('❌ WebSocket failed, trying HTTP fallback:', error);
      setUseHttpFallback(true);
      setIsConnected(true);
      console.log('✅ Using HTTP polling fallback');
    }
  };
  const sendMessage = async (channelId, content, file = null, user) => {
    const messageData = {
      content,
      type: file ? 'file' : 'text',
      file
    };
    
    if (useHttpFallback) {
      try {
        const newMessage = await httpApiService.sendMessage(channelId, messageData, user);
        setMessages(prev => ({
          ...prev,
          [channelId]: [...(prev[channelId] || []), newMessage]
        }));
      } catch (error) {
        console.error('HTTP message send failed:', error);
      }
    } else {
      console.log('📤 Sending WebSocket message:', { channelId, messageData, user });
      webSocketService.sendMessage(channelId, messageData, user);
    }
  };

  const uploadFile = async (file) => {
    try {
      return await webSocketService.uploadFile(file);
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  };
  const joinChannel = async (channelId) => {
    if (useHttpFallback) {
      // Lade Nachrichten über HTTP
      try {
        const channelMessages = await httpApiService.getMessages(channelId);
        setMessages(prev => ({
          ...prev,
          [channelId]: channelMessages
        }));
        // Starte Polling für neue Nachrichten
        httpApiService.startPolling(channelId, (newMessage) => {
          setMessages(prev => ({
            ...prev,
            [channelId]: [...(prev[channelId] || []), newMessage]
          }));
        });
      } catch (error) {
        console.error('Failed to load channel messages:', error);
      }
    } else {
      webSocketService.joinChannel(channelId);
    }
  };

  const leaveChannel = (channelId) => {
    if (useHttpFallback) {
      httpApiService.stopPolling();
    } else {
      webSocketService.leaveChannel(channelId);
    }
  };

  const startTyping = (channelId) => {
    webSocketService.startTyping(channelId);
  };

  const stopTyping = (channelId) => {
    webSocketService.stopTyping(channelId);
  };

  const getChannelMessages = (channelId) => {
    return messages[channelId] || [];
  };

  const getTypingUsers = (channelId) => {
    return Object.values(typingUsers[channelId] || {});
  };

  const value = {
    messages,
    onlineUsers,
    isConnected,
    connectToServer,
    sendMessage,
    uploadFile,
    joinChannel,
    leaveChannel,
    startTyping,
    stopTyping,
    getChannelMessages,
    getTypingUsers
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
