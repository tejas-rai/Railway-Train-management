import React, { useRef } from 'react';
import { parseCSV, sampleCsvData } from '../utils/helpers';
import { Train } from '../types';
import { FileText, Upload, Download } from 'lucide-react';

interface CSVUploadProps {
  setTrains: (trains: Train[]) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ setTrains }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsedTrains = parseCSV(content);
        setTrains(parsedTrains);
      }
    };
    reader.readAsText(file);
  };

  const handleUseSampleData = () => {
    const parsedTrains = parseCSV(sampleCsvData);
    setTrains(parsedTrains);
  };

  const downloadSampleCsv = () => {
    const blob = new Blob([sampleCsvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_train_schedule.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Train Schedule Upload</h2>
      
      <div className="flex flex-col gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Upload size={18} />
          Upload CSV
        </button>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleUseSampleData}
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            <FileText size={18} />
            Use Sample Data
          </button>
          
          <button
            onClick={downloadSampleCsv}
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            <Download size={18} />
            Download Sample
          </button>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">CSV Format:</p>
        <p>Train Number, Arrival Time (HH:MM), Departure Time (HH:MM), Priority (P1/P2/P3)</p>
      </div>
    </div>
  );
};

export default CSVUpload;