import { Train, TrainPriority } from '../types';

export const parseCSV = (csvContent: string): Train[] => {
  const lines = csvContent.trim().split('\n');
  
  // Skip header if present
  const startIndex = lines[0].includes('Train Number') ? 1 : 0;
  
  const trains: Train[] = [];
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',').map(part => part.trim());
    
    if (parts.length >= 4) {
      const [trainNumber, scheduledArrival, scheduledDeparture, priority] = parts;
      
      // Validate the train data
      if (
        trainNumber && 
        isValidTime(scheduledArrival) && 
        isValidTime(scheduledDeparture) && 
        isValidPriority(priority as TrainPriority)
      ) {
        trains.push({
          trainNumber,
          scheduledArrival,
          scheduledDeparture,
          priority: priority as TrainPriority,
          status: 'waiting'
        });
      }
    }
  }
  
  return trains;
};

export const isValidTime = (time: string): boolean => {
  const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timePattern.test(time);
};

export const isValidPriority = (priority: string): boolean => {
  return ['P1', 'P2', 'P3'].includes(priority);
};

export const sortTrainsByPriority = (trains: Train[]): Train[] => {
  const priorityOrder: Record<TrainPriority, number> = {
    'P1': 1,
    'P2': 2,
    'P3': 3
  };
  
  return [...trains].sort((a, b) => {
    // First sort by priority
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by scheduled arrival time
    return compareTime(a.scheduledArrival, b.scheduledArrival);
  });
};

export const compareTime = (time1: string, time2: string): number => {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);
  
  if (hours1 !== hours2) {
    return hours1 - hours2;
  }
  
  return minutes1 - minutes2;
};

export const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

export const getTimeInMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const addMinutesToTime = (time: string, minutesToAdd: number): string => {
  let [hours, minutes] = time.split(':').map(Number);
  
  minutes += minutesToAdd;
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;
  hours = hours % 24;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getMinutesDifference = (time1: string, time2: string): number => {
  const minutes1 = getTimeInMinutes(time1);
  const minutes2 = getTimeInMinutes(time2);
  
  return minutes2 - minutes1;
};

export const formatTimeForDisplay = (time: string): string => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hoursNum = parseInt(hours, 10);
  
  // Convert to 12-hour format
  const period = hoursNum >= 12 ? 'PM' : 'AM';
  const hours12 = hoursNum % 12 || 12;
  
  return `${hours12}:${minutes} ${period}`;
};

// Sample CSV data for testing
export const sampleCsvData = `Train Number,Arrival Time,Departure Time,Priority
22001,10:05,10:10,P1
22002,10:15,10:25,P2
22003,10:20,10:30,P1
22004,10:25,10:40,P3
22005,10:35,10:50,P2`;