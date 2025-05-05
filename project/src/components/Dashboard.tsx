import React from 'react';
import { PlatformData, Train } from '../types';
import { formatTimeForDisplay } from '../utils/helpers';
import Platform from './Platform';
import WaitingList from './WaitingList';
import TrainReport from './TrainReport';
import { Clock, Play, Pause, FastForward } from 'lucide-react';

interface DashboardProps {
  platforms: PlatformData[];
  waitingTrains: Train[];
  trainReports: Train[];
  currentTime: string;
  isSimulationRunning: boolean;
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  onTrainDepart: (platformNumber: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  platforms,
  waitingTrains,
  trainReports,
  currentTime,
  isSimulationRunning,
  toggleSimulation,
  setSimulationSpeed,
  onTrainDepart
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <Clock className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold">{formatTimeForDisplay(currentTime)}</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSimulation}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isSimulationRunning ? (
              <>
                <Pause size={18} />
                Pause
              </>
            ) : (
              <>
                <Play size={18} />
                Start
              </>
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Speed:</span>
            <button
              onClick={() => setSimulationSpeed(30)}
              className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              0.5x
            </button>
            <button
              onClick={() => setSimulationSpeed(60)}
              className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              1x
            </button>
            <button
              onClick={() => setSimulationSpeed(180)}
              className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm flex items-center gap-1"
            >
              <FastForward size={14} />
              3x
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <Platform
            key={platform.platformNumber}
            platform={platform}
            onTrainDepart={onTrainDepart}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WaitingList trains={waitingTrains} />
        <TrainReport trains={trainReports} />
      </div>
    </div>
  );
};

export default Dashboard;