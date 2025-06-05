import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_CHANNELS, CHANNEL_TYPES } from '../utils/constants';

const ChannelContext = createContext();

export const useChannels = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error('useChannels must be used within a ChannelProvider');
  }
  return context;
};

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load channels from localStorage or use defaults
    const storedChannels = localStorage.getItem('discord_channels');
    if (storedChannels) {
      const parsedChannels = JSON.parse(storedChannels);
      setChannels(parsedChannels);
      setActiveChannelId(parsedChannels[0]?.id || null);
    } else {
      setChannels(DEFAULT_CHANNELS);
      setActiveChannelId(DEFAULT_CHANNELS[0].id);
      localStorage.setItem('discord_channels', JSON.stringify(DEFAULT_CHANNELS));
    }
    setLoading(false);
  }, []);

  const saveChannels = (newChannels) => {
    localStorage.setItem('discord_channels', JSON.stringify(newChannels));
  };

  const createChannel = (channelData) => {
    const newChannel = {
      id: uuidv4(),
      type: CHANNEL_TYPES.TEXT,
      createdAt: new Date().toISOString(),
      ...channelData
    };

    const updatedChannels = [...channels, newChannel];
    setChannels(updatedChannels);
    saveChannels(updatedChannels);
    return newChannel;
  };

  const deleteChannel = (channelId) => {
    if (channels.length <= 1) {
      return false; // Don't delete if it's the last channel
    }

    const updatedChannels = channels.filter(channel => channel.id !== channelId);
    setChannels(updatedChannels);
    saveChannels(updatedChannels);

    // If active channel was deleted, switch to first available
    if (activeChannelId === channelId) {
      setActiveChannelId(updatedChannels[0]?.id || null);
    }

    return true;
  };

  const updateChannel = (channelId, updates) => {
    const updatedChannels = channels.map(channel =>
      channel.id === channelId ? { ...channel, ...updates } : channel
    );
    setChannels(updatedChannels);
    saveChannels(updatedChannels);
  };

  const getActiveChannel = () => {
    return channels.find(channel => channel.id === activeChannelId) || null;
  };

  const switchChannel = (channelId) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      setActiveChannelId(channelId);
    }
  };

  const value = {
    channels,
    activeChannelId,
    activeChannel: getActiveChannel(),
    loading,
    createChannel,
    deleteChannel,
    updateChannel,
    switchChannel
  };

  return (
    <ChannelContext.Provider value={value}>
      {children}
    </ChannelContext.Provider>
  );
};
