import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatArea;
