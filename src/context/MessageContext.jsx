import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from './UserContext';
import { useChannels } from './ChannelContext';

const MessageContext = createContext();

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [messagesByChannel, setMessagesByChannel] = useState({});
  const [isTyping, setIsTyping] = useState({});
  const { user } = useUser();
  const { activeChannelId } = useChannels();

  // Load messages from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem('discord_messages');
    if (storedMessages) {
      setMessagesByChannel(JSON.parse(storedMessages));
    }
  }, []);

  // Save messages to localStorage
  const saveMessages = (messages) => {
    localStorage.setItem('discord_messages', JSON.stringify(messages));
  };

  // Get messages for a specific channel
  const getChannelMessages = (channelId) => {
    return messagesByChannel[channelId] || [];
  };

  // Send a new message
  const sendMessage = (channelId, content, messageType = 'text', fileData = null) => {
    if (!content.trim() && !fileData) return;

    const newMessage = {
      id: uuidv4(),
      channelId,
      userId: user.id,
      username: user.username,
      content: content.trim(),
      type: messageType,
      fileData,
      timestamp: new Date().toISOString(),
      edited: false,
      reactions: []
    };

    setMessagesByChannel(prev => {
      const updated = {
        ...prev,
        [channelId]: [...(prev[channelId] || []), newMessage]
      };
      saveMessages(updated);
      return updated;
    });

    return newMessage;
  };

  // Edit a message
  const editMessage = (messageId, newContent) => {
    setMessagesByChannel(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(channelId => {
        updated[channelId] = updated[channelId].map(message =>
          message.id === messageId && message.userId === user.id
            ? { ...message, content: newContent, edited: true, editedAt: new Date().toISOString() }
            : message
        );
      });
      saveMessages(updated);
      return updated;
    });
  };

  // Delete a message
  const deleteMessage = (messageId) => {
    setMessagesByChannel(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(channelId => {
        updated[channelId] = updated[channelId].filter(message =>
          !(message.id === messageId && message.userId === user.id)
        );
      });
      saveMessages(updated);
      return updated;
    });
  };

  // Add reaction to message
  const addReaction = (messageId, emoji) => {
    setMessagesByChannel(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(channelId => {
        updated[channelId] = updated[channelId].map(message => {
          if (message.id === messageId) {
            const existingReaction = message.reactions.find(r => r.emoji === emoji);
            if (existingReaction) {
              // Add user to existing reaction
              if (!existingReaction.users.includes(user.id)) {
                existingReaction.users.push(user.id);
                existingReaction.count++;
              }
            } else {
              // Create new reaction
              message.reactions.push({
                emoji,
                count: 1,
                users: [user.id]
              });
            }
          }
          return message;
        });
      });
      saveMessages(updated);
      return updated;
    });
  };

  // Remove reaction from message
  const removeReaction = (messageId, emoji) => {
    setMessagesByChannel(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(channelId => {
        updated[channelId] = updated[channelId].map(message => {
          if (message.id === messageId) {
            message.reactions = message.reactions.map(reaction => {
              if (reaction.emoji === emoji && reaction.users.includes(user.id)) {
                reaction.users = reaction.users.filter(id => id !== user.id);
                reaction.count--;
              }
              return reaction;
            }).filter(reaction => reaction.count > 0);
          }
          return message;
        });
      });
      saveMessages(updated);
      return updated;
    });
  };

  const value = {
    messagesByChannel,
    isTyping,
    getChannelMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};
