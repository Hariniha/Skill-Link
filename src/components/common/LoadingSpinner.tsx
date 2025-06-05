import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#3563E9',
  fullScreen = false
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 64
  };

  const spinnerSize = sizeMap[size];

  const spinner = (
    <div 
      className="inline-block animate-spin rounded-full border-solid border-current 
        border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      style={{
        width: `${spinnerSize}px`,
        height: `${spinnerSize}px`,
        borderWidth: `${spinnerSize / 8}px`,
        color: color
      }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;