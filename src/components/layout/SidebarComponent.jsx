import React from 'react';
import { useChannels } from '../../context/ChannelContext';
import { useUser } from '../../context/UserContext';

const Sidebar = () => {
  const { channels, activeChannelId, switchChannel } = useChannels();
  const { user } = useUser();

  return (
    <div className="discord-sidebar">
      <div style={{ padding: '16px', borderBottom: '1px solid var(--discord-gray)', fontSize: '16px', fontWeight: '600' }}>
        # Channels
      </div>
      
      <div className="channel-list discord-scrollbar">
        {channels.map(channel => (
          <div
            key={channel.id}
            className={`channel-item ${activeChannelId === channel.id ? 'active' : ''}`}
            onClick={() => switchChannel(channel.id)}
          >
            <span className="channel-icon">#</span>
            <span>{channel.name}</span>
          </div>
        ))}
      </div>
      
      <div className="user-bar">
        <div className="user-info">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-name">
            {user?.username || 'Unknown User'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
