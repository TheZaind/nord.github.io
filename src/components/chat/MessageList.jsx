import React, { useEffect, useRef } from 'react';
import { useMessages } from '../../context/MessageContext';
import { useChannels } from '../../context/ChannelContext';
import { useUser } from '../../context/UserContext';
import Message from './Message';

const MessageList = () => {
  const { getChannelMessages } = useMessages();
  const { activeChannelId, activeChannel } = useChannels();
  const { user } = useUser();
  const messagesEndRef = useRef(null);

  const messages = activeChannelId ? getChannelMessages(activeChannelId) : [];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-discord-dark">
        <div className="text-center">
          <div className="text-white text-xl mb-2">Welcome to Nord!</div>
          <div className="text-discord-gray-lighter">
            Select a channel to start chatting
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-discord-dark">
      {/* Channel Header */}
      <div className="h-12 flex items-center px-4 border-b border-discord-gray shadow-sm bg-discord-dark">
        <div className="flex items-center">
          <span className="text-discord-gray-lighter mr-2">#</span>
          <h2 className="text-white font-semibold">{activeChannel.name}</h2>
          {activeChannel.description && (
            <>
              <div className="h-4 w-px bg-discord-gray-lighter mx-2" />
              <span className="text-discord-gray-lighter text-sm">
                {activeChannel.description}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto discord-scrollbar">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-white text-lg mb-2">
                Welcome to #{activeChannel.name}!
              </div>
              <div className="text-discord-gray-lighter">
                This is the beginning of the channel. Send a message to get started!
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isOwn={message.userId === user?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
