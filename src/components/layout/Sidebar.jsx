import React, { useState } from 'react';
import { HashtagIcon, PlusIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useChannels } from '../../context/ChannelContext';
import { useUser } from '../../context/UserContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import CreateChannelModal from '../channels/CreateChannelModal';

const Sidebar = () => {
  const { channels, activeChannelId, switchChannel } = useChannels();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="w-60 bg-discord-gray flex flex-col h-full">
      {/* Server Header */}
      <div className="h-12 flex items-center px-4 border-b border-discord-gray-light shadow-sm">
        <h1 className="text-white font-semibold">Nord Discord</h1>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto discord-scrollbar">
        <div className="p-2">
          {/* Text Channels Header */}
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <div className="flex items-center text-xs font-semibold text-discord-gray-lighter uppercase tracking-wide">
              Text Channels
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-discord-gray-lighter hover:text-white transition-colors p-1"
              title="Create Channel"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Channel List */}
          <div className="space-y-0.5">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => switchChannel(channel.id)}
                className={`w-full flex items-center px-2 py-1 rounded text-left transition-colors ${
                  activeChannelId === channel.id
                    ? 'bg-discord-gray-light text-white'
                    : 'text-discord-gray-lighter hover:text-white hover:bg-discord-gray-light hover:bg-opacity-50'
                }`}
              >
                <HashtagIcon className="w-5 h-5 mr-1.5 flex-shrink-0" />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Area */}
      <div className="h-14 bg-discord-darker flex items-center px-2 border-t border-discord-gray-light">
        <div className="flex items-center flex-1 min-w-0">
          <Avatar 
            src={user?.avatar} 
            alt={user?.username} 
            status={user?.status}
            size="sm"
          />
          <div className="ml-2 flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {user?.username}
            </div>
            <div className="text-xs text-discord-gray-lighter">
              #{user?.id?.slice(-4)}
            </div>
          </div>
        </div>
        
        <button
          className="text-discord-gray-lighter hover:text-white transition-colors p-1.5"
          title="User Settings"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Sidebar;
