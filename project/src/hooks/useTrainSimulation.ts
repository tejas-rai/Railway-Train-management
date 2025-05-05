import { useState, useEffect, useCallback, useRef } from 'react';
import { Train, PlatformData, TrainPriority } from '../types';
import { sortTrainsByPriority, getCurrentTime, addMinutesToTime, getTimeInMinutes } from '../utils/helpers';

const useTrainSimulation = (
  initialTrains: Train[] = [],
  numPlatforms: number = 2
) => {
  const [trains, setTrains] = useState<Train[]>(initialTrains);
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());
  const simulationSpeed = useRef(60); // 60x speed (1 minute = 1 second)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Initialize platforms
  useEffect(() => {
    const newPlatforms: PlatformData[] = [];
    for (let i = 1; i <= numPlatforms; i++) {
      newPlatforms.push({
        platformNumber: i,
        train: null
      });
    }
    setPlatforms(newPlatforms);
  }, [numPlatforms]);

  // Set up initial trains
  useEffect(() => {
    setTrains(initialTrains.map(train => ({ ...train, status: 'waiting' })));
  }, [initialTrains]);

  // Handle train departure
  const handleTrainDepart = useCallback((platformNumber: number) => {
    setPlatforms(prev => {
      const updated = [...prev];
      const platformIndex = updated.findIndex(p => p.platformNumber === platformNumber);
      
      if (platformIndex !== -1 && updated[platformIndex].train) {
        const departingTrain = updated[platformIndex].train;
        
        // Update train in the trains array
        setTrains(prevTrains => 
          prevTrains.map(train => 
            train.trainNumber === departingTrain?.trainNumber 
              ? { 
                  ...train, 
                  status: 'departed',
                  actualDeparture: currentTime
                } 
              : train
          )
        );
        
        // Clear the platform
        updated[platformIndex].train = null;
      }
      
      return updated;
    });
  }, [currentTime]);

  // Allocate a train to an available platform
  const allocateTrainToPlatform = useCallback((train: Train) => {
    setPlatforms(prev => {
      const availablePlatformIndex = prev.findIndex(p => p.train === null);
      
      if (availablePlatformIndex === -1) return prev; // No available platforms
      
      const updated = [...prev];
      const updatedTrain = { 
        ...train, 
        status: 'arriving', 
        platform: updated[availablePlatformIndex].platformNumber,
        actualArrival: currentTime
      };
      
      // Adjust departure time if there's an arrival delay
      if (getTimeInMinutes(currentTime) > getTimeInMinutes(train.scheduledArrival)) {
        const delayMinutes = getTimeInMinutes(currentTime) - getTimeInMinutes(train.scheduledArrival);
        updatedTrain.scheduledDeparture = addMinutesToTime(train.scheduledDeparture, delayMinutes);
        updatedTrain.isDelayed = true;
      }
      
      updated[availablePlatformIndex].train = updatedTrain;
      
      // Update the train in the trains array
      setTrains(prevTrains => 
        prevTrains.map(t => 
          t.trainNumber === train.trainNumber ? updatedTrain : t
        )
      );
      
      // After 2 seconds, change status to at_platform
      setTimeout(() => {
        setPlatforms(latestPlatforms => {
          return latestPlatforms.map(p => {
            if (p.platformNumber === updated[availablePlatformIndex].platformNumber && p.train?.trainNumber === updatedTrain.trainNumber) {
              return {
                ...p,
                train: { ...p.train, status: 'at_platform' }
              };
            }
            return p;
          });
        });
        
        setTrains(prevTrains => 
          prevTrains.map(t => 
            t.trainNumber === train.trainNumber 
              ? { ...t, status: 'at_platform' } 
              : t
          )
        );
      }, 2000); // Animation duration
      
      return updated;
    });
  }, [currentTime]);

  // Process train departures based on current time
  const processTrainDepartures = useCallback(() => {
    platforms.forEach(platform => {
      if (platform.train && platform.train.status === 'at_platform') {
        const departureTimeInMinutes = getTimeInMinutes(platform.train.scheduledDeparture);
        const currentTimeInMinutes = getTimeInMinutes(currentTime);
        
        if (currentTimeInMinutes >= departureTimeInMinutes) {
          // Set train status to departing
          setPlatforms(prev => 
            prev.map(p => 
              p.platformNumber === platform.platformNumber 
                ? { 
                    ...p, 
                    train: p.train ? { ...p.train, status: 'departing' } : null 
                  } 
                : p
            )
          );
          
          setTrains(prevTrains => 
            prevTrains.map(train => 
              train.trainNumber === platform.train?.trainNumber 
                ? { ...train, status: 'departing' } 
                : train
            )
          );
        }
      }
    });
  }, [platforms, currentTime]);

  // Process waiting trains and allocate to available platforms
  const processWaitingTrains = useCallback(() => {
    // Get available platform count
    const availablePlatformsCount = platforms.filter(p => p.train === null).length;
    
    if (availablePlatformsCount === 0) return;
    
    // Get waiting trains sorted by priority
    const waitingTrains = trains
      .filter(train => train.status === 'waiting')
      .filter(train => {
        const arrivalTimeInMinutes = getTimeInMinutes(train.scheduledArrival);
        const currentTimeInMinutes = getTimeInMinutes(currentTime);
        return currentTimeInMinutes >= arrivalTimeInMinutes;
      });
    
    const sortedWaitingTrains = sortTrainsByPriority(waitingTrains);
    
    // Allocate platforms to waiting trains
    for (let i = 0; i < Math.min(availablePlatformsCount, sortedWaitingTrains.length); i++) {
      allocateTrainToPlatform(sortedWaitingTrains[i]);
    }
  }, [trains, platforms, currentTime, allocateTrainToPlatform]);

  // Run simulation tick
  const simulationTick = useCallback(() => {
    // Update current time
    setCurrentTime(prev => addMinutesToTime(prev, 1));
    
    // Process train departures
    processTrainDepartures();
    
    // Process waiting trains
    processWaitingTrains();
  }, [processTrainDepartures, processWaitingTrains]);

  // Start/stop simulation
  const toggleSimulation = useCallback(() => {
    setIsSimulationRunning(prev => !prev);
  }, []);

  // Set simulation speed
  const setSimulationSpeed = useCallback((speed: number) => {
    simulationSpeed.current = speed;
  }, []);

  // Initialize and run the simulation
  useEffect(() => {
    if (!isSimulationRunning) return;
    
    const intervalId = setInterval(() => {
      simulationTick();
    }, 1000 / simulationSpeed.current); // Adjust for simulation speed
    
    return () => clearInterval(intervalId);
  }, [isSimulationRunning, simulationTick]);

  // Filter waiting trains
  const waitingTrains = trains.filter(train => train.status === 'waiting');
  
  // Get reports for arrived and departed trains
  const trainReports = trains.filter(train => 
    train.status === 'at_platform' || 
    train.status === 'departing' || 
    train.status === 'departed'
  );

  return {
    platforms,
    waitingTrains,
    trainReports,
    currentTime,
    isSimulationRunning,
    toggleSimulation,
    setSimulationSpeed,
    setTrains,
    handleTrainDepart
  };
};

export default useTrainSimulation;