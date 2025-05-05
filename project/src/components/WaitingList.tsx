import React from 'react';
import { Train } from '../types';
import { formatTimeForDisplay } from '../utils/helpers';

interface WaitingListProps {
  trains: Train[];
}

const WaitingList: React.FC<WaitingListProps> = ({ trains }) => {
  if (trains.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Waiting Trains</h2>
        <p className="text-gray-500 text-center py-4">No trains waiting</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-600';
      case 'P2': return 'bg-orange-600';
      case 'P3': return 'bg-green-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Waiting Trains</h2>
      <div className="overflow-auto max-h-64">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trains.map((train) => (
              <tr key={train.trainNumber} className="hover:bg-gray-50">
                <td className="py-2 px-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{train.trainNumber}</div>
                </td>
                <td className="py-2 px-3 whitespace-nowrap text-sm text-gray-500">
                  {formatTimeForDisplay(train.scheduledArrival)}
                </td>
                <td className="py-2 px-3 whitespace-nowrap text-sm text-gray-500">
                  {formatTimeForDisplay(train.scheduledDeparture)}
                </td>
                <td className="py-2 px-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getPriorityColor(train.priority)}`}>
                    {train.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaitingList;