import React from 'react';

interface PlatformInputProps {
  numPlatforms: number;
  setNumPlatforms: (num: number) => void;
}

const PlatformInput: React.FC<PlatformInputProps> = ({ numPlatforms, setNumPlatforms }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 2 && value <= 20) {
      setNumPlatforms(value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      <label htmlFor="platforms" className="text-gray-700 font-medium">
        Number of Platforms:
      </label>
      <div className="flex items-center">
        <input
          type="range"
          id="platforms"
          min="2"
          max="20"
          value={numPlatforms}
          onChange={handleChange}
          className="mx-2 h-2 w-full bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          min="2"
          max="20"
          value={numPlatforms}
          onChange={handleChange}
          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
        />
      </div>
    </div>
  );
};

export default PlatformInput;