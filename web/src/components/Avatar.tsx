import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';

interface AvatarProps {
  displayName?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ displayName, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await apiClient.get('/auth/me/avatar', {
          responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } catch (error) {
        setImageError(true);
      }
    };

    fetchAvatar();

    // Cleanup function to revoke object URL
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, []);

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
      {!imageError && imageSrc ? (
        <img
          src={imageSrc}
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
