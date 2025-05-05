import React from 'react';
import { Train } from '../types';
import { formatTimeForDisplay, getMinutesDifference } from '../utils/helpers';

interface TrainReportProps {
  trains: Train[];
}

const TrainReport: React.FC<TrainReportProps> = ({ trains }) => {
  // Filter trains that have either arrived or departed
  const completedTrains = trains.filter(
    train => train.status === 'departed' || (train.actualArrival && train.status === 'at_platform')
  );

  if (completedTrains.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Train Report</h2>
        <p className="text-gray-500 text-center py-4">No trains in report yet</p>
      </div>
    );
  }

  const calculateDelay = (scheduledTime?: string, actualTime?: string): number => {
    if (!scheduledTime || !actualTime) return 0;
    return getMinutesDifference(scheduledTime, actualTime);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-600';
      case 'P2': return 'bg-orange-600';
      case 'P3': return 'bg-green-600';
      default: return 'bg-blue-600';
    }
  };

  const getDelayColor = (delay: number) => {
    if (delay <= 0) return 'text-green-600';
    if (delay <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Train Report</h2>
      <div className="overflow-auto max-h-96">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train</th>
              <th className="py-2 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="py-2 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
              <th className="py-2 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Arrival</th>
              <th className="py-2 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Arrival</th>
              <th className="py-2 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Departure</th>
              <th className="py-2 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Departure</th>
              <th className="py-2 px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delay (min)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {completedTrains.map((train) => {
              const arrivalDelay = calculateDelay(train.scheduledArrival, train.actualArrival);
              const departureDelay = train.actualDeparture ? 
                calculateDelay(train.scheduledDeparture, train.actualDeparture) : 0;
              
              return (
                <tr key={train.trainNumber} className="hover:bg-gray-50">
                  <td className="py-2 px-2 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{train.trainNumber}</div>
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getPriorityColor(train.priority)}`}>
                      {train.priority}
                    </span>
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap text-sm text-gray-500">
                    {train.platform || '-'}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap text-sm text-gray-500">
                    {formatTimeForDisplay(train.scheduledArrival)}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap text-sm text-gray-500">
                    {train.actualArrival ? formatTimeForDisplay(train.actualArrival) : '-'}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap text-sm text-gray-500">
                    {formatTimeForDisplay(train.scheduledDeparture)}
                  </td>
                  <td className="py-2 px-2 whitespace-nowrap text-sm text-gray-500">
                    {train.actualDeparture ? formatTimeForDisplay(train.actualDeparture) : '-'}
                  </td>
                  <td className={`py-2 px-2 whitespace-nowrap text-sm font-medium ${getDelayColor(arrivalDelay)}`}>
                    {arrivalDelay}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainReport;