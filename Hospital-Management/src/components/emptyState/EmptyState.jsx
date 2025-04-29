import React from 'react';
import './emptyState.css';

const EmptyState = ({img,text}) => {
  return (
    <div className="empty-state">
      <img src={img} alt="No appointments" />
      <p>{text}</p>
    </div>
  );
};

export default EmptyState;
