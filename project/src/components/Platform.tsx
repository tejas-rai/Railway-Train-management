import React from 'react';
import { PlatformData } from '../types';
import Train from './Train';

interface PlatformProps {
  platform: PlatformData;
  onTrainDepart: (platformNumber: number) => void;
}

const Platform: React.FC<PlatformProps> = ({ platform, onTrainDepart }) => {
  const handleDepart = () => {
    onTrainDepart(platform.platformNumber);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-800 text-white py-2 px-4">
        <h3 className="font-semibold">Platform {platform.platformNumber}</h3>
      </div>
      <div className="p-4 h-24 flex items-center justify-center">
        {platform.train ? (
          <Train train={platform.train} onDepart={handleDepart} />
        ) : (
          <p className="text-gray-400 text-sm">No train at platform</p>
        )}
      </div>
    </div>
  );
};

export default Platform;