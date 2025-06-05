import React from 'react';
import { formatMessageTime } from '../../utils/formatDate';
import { formatFileSize } from '../../utils/fileValidation';
import Avatar from '../common/Avatar';

const Message = ({ message, isOwn = false }) => {
  const renderFileContent = () => {
    if (!message.fileData) return null;

    const { name, size, type, data } = message.fileData;

    if (message.type === 'image') {
      return (
        <div className="mt-2">
          <img
            src={data}
            alt={name}
            className="max-w-md max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(data, '_blank')}
          />
          <div className="text-xs text-discord-gray-lighter mt-1">
            {name} • {formatFileSize(size)}
          </div>
        </div>
      );
    }

    if (message.type === 'video') {
      return (
        <div className="mt-2">
          <video
            src={data}
            controls
            className="max-w-md max-h-64 rounded-lg"
          >
            Your browser does not support video playback.
          </video>
          <div className="text-xs text-discord-gray-lighter mt-1">
            {name} • {formatFileSize(size)}
          </div>
        </div>
      );
    }

    // File attachment
    return (
      <div className="mt-2 flex items-center space-x-3 bg-discord-gray-light p-3 rounded-lg max-w-md">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-discord-blurple rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {name.split('.').pop()?.toUpperCase().slice(0, 3) || 'FILE'}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-white truncate">{name}</div>
          <div className="text-xs text-discord-gray-lighter">
            {formatFileSize(size)}
          </div>
        </div>
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = data;
            link.download = name;
            link.click();
          }}
          className="text-discord-blurple hover:text-blue-400 text-sm font-medium"
        >
          Download
        </button>
      </div>
    );
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {message.reactions.map((reaction, index) => (
          <button
            key={index}
            className="flex items-center space-x-1 bg-discord-gray-light hover:bg-discord-gray px-1.5 py-0.5 rounded text-xs transition-colors"
          >
            <span>{reaction.emoji}</span>
            <span className="text-discord-gray-lighter">{reaction.count}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`group px-4 py-2 message-hover ${isOwn ? 'bg-discord-gray bg-opacity-20' : ''}`}>
      <div className="flex space-x-3">
        <Avatar
          src={null}
          alt={message.username}
          size="sm"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline space-x-2">
            <span className="font-medium text-white">
              {message.username}
            </span>
            <span className="text-xs text-discord-gray-lighter">
              {formatMessageTime(message.timestamp)}
              {message.edited && (
                <span className="ml-1">(edited)</span>
              )}
            </span>
          </div>
          
          <div className="mt-1">
            {message.content && (
              <div className="text-white whitespace-pre-wrap break-words">
                {message.content}
              </div>
            )}
            
            {renderFileContent()}
            {renderReactions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
