import React from 'react';
import './Avatar.css';

const Avatar = ({ src, alt, size = 'md', status = null, className = '' }) => {
  return (
    <div className={`avatar-container ${className}`}>
      <div className={`avatar avatar-${size}`}>
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="avatar-image"
          />
        ) : (
          <div className="avatar-placeholder">
            {alt ? alt.charAt(0).toUpperCase() : '?'}
          </div>        )}
      </div>
      
      {status && (
        <div className={`avatar-status avatar-status-${status}`} />
      )}
    </div>
  );
};

export default Avatar;
