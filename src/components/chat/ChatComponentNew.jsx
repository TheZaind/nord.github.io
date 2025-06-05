import React, { useState, useEffect, useRef } from 'react';
import { useChannels } from '../../context/ChannelContext';
import { useUser } from '../../context/UserContext';
import { useMessages } from '../../context/MessageContextNew';
import { formatMessageTime } from '../../utils/formatDate';
import { validateFile } from '../../utils/fileValidation';

const ChatComponentNew = () => {
  const { activeChannel } = useChannels();
  const { user } = useUser();
  const { 
    isConnected, 
    connectToServer, 
    sendMessage, 
    uploadFile, 
    joinChannel, 
    leaveChannel,
    getChannelMessages,
    getTypingUsers,
    startTyping,
    stopTyping
  } = useMessages();
  
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Connect to server when component mounts
  useEffect(() => {
    if (user && !isConnected) {
      connectToServer(user);
    }
  }, [user, isConnected, connectToServer]);

  // Handle channel changes
  useEffect(() => {
    if (activeChannel && isConnected) {
      joinChannel(activeChannel.id);
      
      return () => {
        leaveChannel(activeChannel.id);
      };
    }
  }, [activeChannel, isConnected, joinChannel, leaveChannel]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  // Auto-scroll to bottom when new messages arrive
  const messages = activeChannel ? getChannelMessages(activeChannel.id) : [];
  const typingUsers = activeChannel ? getTypingUsers(activeChannel.id) : [];
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !activeChannel || !user) return;

    let fileData = null;
    
    // Upload file if selected
    if (selectedFile) {
      setUploading(true);
      try {
        fileData = await uploadFile(selectedFile);
      } catch (error) {
        alert('File upload failed: ' + error.message);
        setUploading(false);
        return;
      }
      setUploading(false);
    }    // Send message
    sendMessage(activeChannel.id, newMessage, fileData, user);
    
    // Clear input
    setNewMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicators
    if (activeChannel && isConnected) {
      startTyping(activeChannel.id);
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      // Set new timeout to stop typing after 2 seconds
      const timeout = setTimeout(() => {
        stopTyping(activeChannel.id);
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.isValid) {
        setSelectedFile(file);
      } else {
        alert(validation.error);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Connection status
  if (!isConnected) {
    return (
      <div className="discord-main">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          flexDirection: 'column',
          color: 'var(--discord-gray-lighter)',
          gap: '16px'
        }}>
          <div style={{ fontSize: '18px' }}>🔗 Connecting to server...</div>
          <div style={{ fontSize: '14px' }}>Make sure the Python server is running on port 5000</div>
        </div>
      </div>
    );
  }

  if (!activeChannel) {
    return (
      <div className="discord-main">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          color: 'var(--discord-gray-lighter)' 
        }}>
          Select a channel to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="discord-main">
      <div className="discord-header">
        <span className="channel-icon" style={{ marginRight: '8px', opacity: '0.6' }}>#</span>
        {activeChannel.name}
        {isConnected && (
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: '12px', 
            color: 'var(--discord-green-online)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--discord-green-online)' 
            }}></span>
            Connected
          </span>
        )}      </div>
      
      <div className="discord-messages discord-scrollbar">
        {(messages || []).map((message, index) => (
          <div key={message.id || `message-${index}`} className="message">
            <div className="message-avatar">
              {(message.username || 'Unknown').charAt(0).toUpperCase()}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-username">{message.username || 'Unknown User'}</span>
                <span className="message-timestamp">{message.timestamp ? formatMessageTime(message.timestamp) : 'Unknown time'}</span>
              </div>
              {message.content && <div className="message-text">{message.content}</div>}
              {message.type === 'file' && message.file && (
                <div className="message-file">
                  <div className="file-icon">📎</div>
                  <div className="file-info">
                    <div className="file-name">{message.file.filename || 'Unknown file'}</div>
                    <div className="file-size">{message.file.size ? formatFileSize(message.file.size) : 'Unknown size'}</div>
                  </div>
                  {message.file.type && message.file.type.startsWith('image/') && message.file.url && (
                    <img 
                      src={`http://localhost:5000${message.file.url}`}
                      alt={message.file.filename || 'Image'}
                      className="file-preview"
                      style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '4px', marginTop: '8px' }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.map(user => user.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {selectedFile && (
        <div className="file-preview-container">
          <div className="file-preview-item">
            <div className="file-icon">📎</div>
            <div className="file-info">
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-size">{formatFileSize(selectedFile.size)}</div>
            </div>
            <button className="file-remove-btn" onClick={removeFile}>
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="input-row">
        <button className="file-upload-btn" onClick={() => fileInputRef.current?.click()}>
          📎
        </button>
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder={`Message #${activeChannel.name}`}
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button 
          className="send-btn"
          onClick={handleSendMessage}
          disabled={(!newMessage.trim() && !selectedFile) || uploading}
        >
          {uploading ? 'Uploading...' : 'Send'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        />
      </div>
    </div>
  );
};

export default ChatComponentNew;
