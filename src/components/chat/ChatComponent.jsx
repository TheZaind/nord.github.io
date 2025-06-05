import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChannels } from '../../context/ChannelContext';
import { useUser } from '../../context/UserContext';
import { formatMessageTime } from '../../utils/formatDate';
import { validateFile } from '../../utils/fileValidation';

const ChatComponent = () => {
  const { activeChannel } = useChannels();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Load messages for active channel
  useEffect(() => {
    if (activeChannel) {
      const stored = localStorage.getItem(`messages_${activeChannel.id}`);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        // Create some demo messages
        const demoMessages = [
          {
            id: uuidv4(),
            userId: 'demo1',
            username: 'Welcome Bot',
            content: `Welcome to #${activeChannel.name}! 🎉`,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            type: 'text'
          },
          {
            id: uuidv4(),
            userId: 'demo2',
            username: 'Helper',
            content: 'This is your Discord clone. Start chatting!',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            type: 'text'
          }
        ];
        setMessages(demoMessages);
        localStorage.setItem(`messages_${activeChannel.id}`, JSON.stringify(demoMessages));
      }
    }
  }, [activeChannel]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if ((!newMessage.trim() && !selectedFile) || !activeChannel || !user) return;

    const message = {
      id: uuidv4(),
      userId: user.id,
      username: user.username,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: selectedFile ? 'file' : 'text',
      file: selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: URL.createObjectURL(selectedFile) // For demo purposes
      } : null
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${activeChannel.id}`, JSON.stringify(updatedMessages));
    setNewMessage('');
    setSelectedFile(null);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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

  if (!activeChannel) {
    return (
      <div className="discord-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--discord-gray-lighter)' }}>
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
      </div>
      
      <div className="discord-messages discord-scrollbar">        {messages.map(message => (
          <div key={message.id} className="message">
            <div className="message-avatar">
              {message.username.charAt(0).toUpperCase()}
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-username">{message.username}</span>
                <span className="message-timestamp">{formatMessageTime(message.timestamp)}</span>
              </div>
              {message.content && <div className="message-text">{message.content}</div>}
              {message.type === 'file' && message.file && (
                <div className="message-file">
                  <div className="file-icon">📎</div>
                  <div className="file-info">
                    <div className="file-name">{message.file.name}</div>
                    <div className="file-size">{formatFileSize(message.file.size)}</div>
                  </div>
                  {message.file.type.startsWith('image/') && (
                    <img 
                      src={message.file.url} 
                      alt={message.file.name}
                      className="file-preview"
                      style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '4px', marginTop: '8px' }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>
        <div className="discord-input-container">
        {selectedFile && (
          <div className="file-preview-container">
            <div className="file-preview-item">
              <div className="file-icon">📎</div>
              <div className="file-info">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">{formatFileSize(selectedFile.size)}</div>
              </div>
              <button className="file-remove-btn" onClick={removeFile}>×</button>
            </div>
          </div>
        )}
        <div className="input-row">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          />
          <button 
            className="file-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload file"
          >
            📎
          </button>
          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder={`Message #${activeChannel.name}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <button 
            className="send-btn"
            onClick={sendMessage}
            disabled={!newMessage.trim() && !selectedFile}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
