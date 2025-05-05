export type TrainPriority = 'P1' | 'P2' | 'P3';

export interface Train {
  trainNumber: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  priority: TrainPriority;
  actualArrival?: string;
  actualDeparture?: string;
  platform?: number;
  status: 'waiting' | 'arriving' | 'at_platform' | 'departing' | 'departed';
  isDelayed?: boolean;
}

export interface PlatformData {
  platformNumber: number;
  train: Train | null;
}

export interface TrainReport extends Train {
  delay: number; // in minutes
}