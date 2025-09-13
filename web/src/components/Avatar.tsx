import React, { useState } from 'react';

interface AvatarProps {
  displayName?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ displayName, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative ${className}`}>
      {!imageError ? (
        <img
          src="/api/auth/me/avatar"
          alt={displayName || 'User avatar'}
          className={`w-full h-full rounded-full object-cover ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : null}
      
      {imageError && (
        <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
          {getInitials(displayName)}
        </div>
      )}
      
      {!imageLoaded && !imageError && (
        <div className="w-full h-full rounded-full bg-academic-200 animate-pulse" />
      )}
    </div>
  );
};

export default Avatar;
