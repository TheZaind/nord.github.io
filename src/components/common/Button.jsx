import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-discord-darker disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-discord-blurple text-white hover:bg-blue-600 focus:ring-discord-blurple',
    secondary: 'bg-discord-gray text-white hover:bg-discord-gray-light focus:ring-discord-gray',
    danger: 'bg-discord-red-dnd text-white hover:bg-red-600 focus:ring-discord-red-dnd',
    ghost: 'bg-transparent text-discord-gray-lighter hover:text-white hover:bg-discord-gray focus:ring-discord-gray',
    success: 'bg-discord-green-online text-white hover:bg-green-600 focus:ring-discord-green-online'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
