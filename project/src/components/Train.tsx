import React, { useEffect, useState } from 'react';
import { Train as TrainType } from '../types';
import { formatTimeForDisplay } from '../utils/helpers';
import './TrainAnimation.css';

interface TrainProps {
  train: TrainType;
  onDepart?: () => void;
}

const Train: React.FC<TrainProps> = ({ train, onDepart }) => {
  const [status, setStatus] = useState(train.status);

  useEffect(() => {
    setStatus(train.status);
    
    if (train.status === 'departing' && onDepart) {
      const timer = setTimeout(() => {
        onDepart();
      }, 2000); // Match animation duration
      
      return () => clearTimeout(timer);
    }
  }, [train.status, onDepart]);

  const getTrainStatusClass = () => {
    switch (status) {
      case 'arriving': return 'train-arriving';
      case 'at_platform': return 'train-at-platform';
      case 'departing': return 'train-departing';
      default: return '';
    }
  };

  const getPriorityClass = () => {
    return `priority-${train.priority}`;
  };

  return (
    <div className="train-container">
      <div className={`train ${getTrainStatusClass()} ${getPriorityClass()}`}>
        <div className="flex flex-col">
          <span className="train-number">{train.trainNumber}</span>
          <span className="train-time text-xs">
            {formatTimeForDisplay(train.scheduledDeparture)}
          </span>
        </div>
        <span className="train-priority">{train.priority}</span>
      </div>
    </div>
  );
};

export default Train;