import React, { useState } from 'react';
import { ethers } from 'ethers';

interface AddCropProps {
  contract: ethers.Contract | null;
}

const AddCrop: React.FC<AddCropProps> = ({ contract }) => {
  const [cropName, setCropName] = useState('');
  const [cropLocation, setCropLocation] = useState('');
  const [cropId, setCropId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addStatus, setAddStatus] = useState<string | null>(null);

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      setAddStatus('Contract not initialized');
      return;
    }
    setIsAdding(true);
    setAddStatus(null);
    try {
      const tx = await contract.addCrop(cropName, cropLocation, cropId);
      await tx.wait();
      setAddStatus('Crop added successfully!');
      setCropName('');
      setCropLocation('');
      setCropId('');
    } catch (error) {
      console.error('Error adding crop:', error);
      setAddStatus('Failed to add crop. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Add Crop</h3>
      </div>
      <div className="border-t border-gray-200">
        <form onSubmit={handleAddCrop} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="cropName" className="block text-sm font-medium text-gray-700">
                Crop Name
              </label>
              <input
                type="text"
                name="cropName"
                id="cropName"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="cropLocation" className="block text-sm font-medium text-gray-700">
                Crop Location
              </label>
              <input
                type="text"
                name="cropLocation"
                id="cropLocation"
                value={cropLocation}
                onChange={(e) => setCropLocation(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="col-span-6">
              <label htmlFor="cropId" className="block text-sm font-medium text-gray-700">
                Crop ID
              </label>
              <input
                type="text"
                name="cropId"
                id="cropId"
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isAdding}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isAdding ? 'Adding Crop...' : 'Add Crop'}
            </button>
          </div>
        </form>
      </div>
      {addStatus && (
        <div className={`px-4 py-3 ${addStatus.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {addStatus}
        </div>
      )}
    </div>
  );
};

export default AddCrop;