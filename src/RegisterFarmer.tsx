import React, { useState } from 'react';
import { ethers } from 'ethers';

interface RegisterFarmerProps {
  contract: ethers.Contract | null;
}

const RegisterFarmer: React.FC<RegisterFarmerProps> = ({ contract }) => {
  const [farmerName, setFarmerName] = useState('');
  const [farmerId, setFarmerId] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      setRegistrationStatus('Contract not initialized');
      return;
    }
    setIsRegistering(true);
    setRegistrationStatus(null);
    try {
      const tx = await contract.registerFarmer(farmerName, farmerId);
      await tx.wait();
      setRegistrationStatus('Farmer registered successfully!');
      setFarmerName('');
      setFarmerId('');
    } catch (error) {
      console.error('Error registering farmer:', error);
      setRegistrationStatus('Failed to register farmer. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Register Farmer</h3>
      </div>
      <div className="border-t border-gray-200">
        <form onSubmit={handleRegister} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="farmerName" className="block text-sm font-medium text-gray-700">
                Farmer Name
              </label>
              <input
                type="text"
                name="farmerName"
                id="farmerName"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="farmerId" className="block text-sm font-medium text-gray-700">
                Farmer ID
              </label>
              <input
                type="text"
                name="farmerId"
                id="farmerId"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={isRegistering}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isRegistering ? 'Registering...' : 'Register Farmer'}
            </button>
          </div>
        </form>
      </div>
      {registrationStatus && (
        <div className={`px-4 py-3 ${registrationStatus.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {registrationStatus}
        </div>
      )}
    </div>
  );
};

export default RegisterFarmer;