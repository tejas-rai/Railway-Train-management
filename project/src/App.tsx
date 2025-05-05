import React, { useState } from 'react';
import { Train } from './types';
import PlatformInput from './components/PlatformInput';
import CSVUpload from './components/CSVUpload';
import Dashboard from './components/Dashboard';
import useTrainSimulation from './hooks/useTrainSimulation';
import { Train as TrainIcon } from 'lucide-react';

function App() {
  const [numPlatforms, setNumPlatforms] = useState<number>(4);
  const [uploadedTrains, setUploadedTrains] = useState<Train[]>([]);
  
  const {
    platforms,
    waitingTrains,
    trainReports,
    currentTime,
    isSimulationRunning,
    toggleSimulation,
    setSimulationSpeed,
    setTrains,
    handleTrainDepart
  } = useTrainSimulation(uploadedTrains, numPlatforms);
  
  const handleSetTrains = (trains: Train[]) => {
    setUploadedTrains(trains);
    setTrains(trains);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-blue-700 text-white p-4 rounded-lg shadow-md mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrainIcon size={30} />
          <h1 className="text-2xl font-bold">Railway Station Management System</h1>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <PlatformInput
          numPlatforms={numPlatforms}
          setNumPlatforms={setNumPlatforms}
        />
        <CSVUpload setTrains={handleSetTrains} />
      </div>
      
      <Dashboard
        platforms={platforms}
        waitingTrains={waitingTrains}
        trainReports={trainReports}
        currentTime={currentTime}
        isSimulationRunning={isSimulationRunning}
        toggleSimulation={toggleSimulation}
        setSimulationSpeed={setSimulationSpeed}
        onTrainDepart={handleTrainDepart}
      />
    </div>
  );
}

export default App;