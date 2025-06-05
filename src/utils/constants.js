// App constants
export const APP_NAME = 'Nord';
export const APP_VERSION = '1.0.0';

// Channel types
export const CHANNEL_TYPES = {
  TEXT: 'text',
  VOICE: 'voice',
  CATEGORY: 'category'
};

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  FILE: 'file',
  IMAGE: 'image',
  VIDEO: 'video',
  SYSTEM: 'system'
};

// User status
export const USER_STATUS = {
  ONLINE: 'online',
  IDLE: 'idle',
  DND: 'dnd',
  INVISIBLE: 'invisible'
};

// Socket events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Messages
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVE: 'message:receive',
  MESSAGE_DELETE: 'message:delete',
  MESSAGE_EDIT: 'message:edit',
  
  // Typing
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  
  // Users
  USER_JOIN: 'user:join',
  USER_LEAVE: 'user:leave',
  USER_STATUS_CHANGE: 'user:status_change',
  
  // Channels
  CHANNEL_CREATE: 'channel:create',
  CHANNEL_DELETE: 'channel:delete',
  CHANNEL_UPDATE: 'channel:update'
};

// Default channels
export const DEFAULT_CHANNELS = [
  {
    id: 'general',
    name: 'general',
    type: CHANNEL_TYPES.TEXT,
    description: 'General discussion',
    createdAt: new Date().toISOString()
  },
  {
    id: 'random',
    name: 'random',
    type: CHANNEL_TYPES.TEXT,
    description: 'Random conversations',
    createdAt: new Date().toISOString()
  },
  {
    id: 'help',
    name: 'help',
    type: CHANNEL_TYPES.TEXT,
    description: 'Get help and support',
    createdAt: new Date().toISOString()
  }
];
