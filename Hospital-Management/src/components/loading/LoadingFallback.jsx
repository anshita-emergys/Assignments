import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './loadingFallback.css';

const LoadingFallback = () => {
  return (
    <div className="loading-fallback-container">
        <div className='loading-inputs'>

        
      <div className="loading-title">
        <Skeleton width={120} height={30} />
      </div>
      <div className="loading-input">
        <Skeleton height={40} />
      </div>
      <div className="loading-input">
        <Skeleton height={40} />
      </div>
      <div className="loading-link">
        <Skeleton width={120} height={20} />
      </div>
      <div className="loading-button">
        <Skeleton width={100} height={40} />
      </div>
      <div className="loading-signup">
        <Skeleton width={180} height={20} />
      </div>
      </div>
      <div>
      <Skeleton width={510} height={510} />
      </div>
    </div>
  );
};

export default LoadingFallback;
