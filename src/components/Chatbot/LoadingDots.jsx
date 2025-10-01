import React from 'react';

const LoadingDots = ({ size = 'sm', color = 'gray' }) => {
  const sizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    gray: 'bg-gray-500',
    white: 'bg-white',
    green: 'bg-green-500',
    red: 'bg-red-500'
  };

  const dotClass = `${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`;

  return (
    <div className="flex items-center space-x-1">
      <div className={`${dotClass} animation-delay-0`}></div>
      <div className={`${dotClass} animation-delay-200`}></div>
      <div className={`${dotClass} animation-delay-400`}></div>
      
      <style jsx>{`
        .animation-delay-0 {
          animation-delay: 0ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingDots;