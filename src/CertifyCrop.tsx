import React, { useState } from 'react';
import { ethers } from 'ethers';

interface CertifyCropProps {
  contract: ethers.Contract | null;
}

const CertifyCrop: React.FC<CertifyCropProps> = ({ contract }) => {
  const [cropId, setCropId] = useState('');
  const [isCertifying, setIsCertifying] = useState(false);
  const [certificationStatus, setCertificationStatus] = useState<string | null>(null);

  const handleCertify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      setCertificationStatus('Contract not initialized');
      return;
    }
    setIsCertifying(true);
    setCertificationStatus(null);
    try {
      const tx = await contract.certifyCrop(cropId);
      await tx.wait();
      setCertificationStatus('Crop certified successfully!');
      setCropId('');
    } catch (error) {
      console.error('Error certifying crop:', error);
      setCertificationStatus('Failed to certify crop. Please try again.');
    } finally {
      setIsCertifying(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Certify Crop</h3>
      </div>
      <div className="border-t border-gray-200">
        <form onSubmit={handleCertify} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
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
              disabled={isCertifying}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isCertifying ? 'Certifying...' : 'Certify Crop'}
            </button>
          </div>
        </form>
      </div>
      {certificationStatus && (
        <div className={`px-4 py-3 ${certificationStatus.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {certificationStatus}
        </div>
      )}
    </div>
  );
};

export default CertifyCrop;