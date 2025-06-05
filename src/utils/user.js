import { v4 as uuidv4 } from 'uuid';

// Generate unique user ID
export const generateUserId = () => uuidv4();

// Generate random username
export const generateUsername = () => {
  const adjectives = ['Cool', 'Swift', 'Brave', 'Clever', 'Mighty', 'Noble', 'Quick', 'Smart', 'Bold', 'Wild'];
  const nouns = ['Dragon', 'Phoenix', 'Tiger', 'Wolf', 'Eagle', 'Lion', 'Fox', 'Bear', 'Hawk', 'Raven'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 9999);
  
  return `${adjective}${noun}${number}`;
};

// Get user from localStorage or create new one
export const getOrCreateUser = () => {
  const stored = localStorage.getItem('discord_user');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const user = {
    id: generateUserId(),
    username: generateUsername(),
    avatar: null,
    status: 'online',
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem('discord_user', JSON.stringify(user));
  return user;
};

// Save user to localStorage
export const saveUser = (user) => {
  localStorage.setItem('discord_user', JSON.stringify(user));
};
