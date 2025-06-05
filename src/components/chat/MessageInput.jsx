import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { useMessages } from '../../context/MessageContext';
import { useChannels } from '../../context/ChannelContext';
import { validateFile, getFileType } from '../../utils/fileValidation';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const { sendMessage } = useMessages();
  const { activeChannelId, activeChannel } = useChannels();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !activeChannelId) return;
    
    sendMessage(activeChannelId, message);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChannelId) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for demo purposes
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          data: reader.result
        };

        const fileType = getFileType(file.type);
        const messageContent = `📎 ${file.name}`;
        
        sendMessage(activeChannelId, messageContent, fileType, fileData);
        
        // Reset file input
        fileInputRef.current.value = '';
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  if (!activeChannel) {
    return null;
  }

  return (
    <div className="p-4 bg-discord-gray">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-3">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-shrink-0 p-2 text-discord-gray-lighter hover:text-white transition-colors disabled:opacity-50"
            title="Upload File"
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${activeChannel.name}`}
              className="w-full px-4 py-3 pr-12 bg-discord-gray-light text-white placeholder-discord-gray-lighter border-none rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-discord-blurple min-h-[44px] max-h-[120px]"
              rows={1}
              disabled={isUploading}
            />
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || isUploading}
              className="absolute right-2 bottom-2 p-2 text-discord-gray-lighter hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.txt,.doc,.docx"
        />

        {isUploading && (
          <div className="absolute inset-0 bg-discord-gray bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-white text-sm">Uploading...</div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
