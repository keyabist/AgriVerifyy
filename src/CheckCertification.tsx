import React, { useState } from 'react';
import { ethers } from 'ethers';
import QRCode from 'qrcode.react';

interface CheckCertificationProps {
  contract: ethers.Contract | null;
}

const CheckCertification: React.FC<CheckCertificationProps> = ({ contract }) => {
  const [cropId, setCropId] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [certificationStatus, setCertificationStatus] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      setCertificationStatus('Contract not initialized');
      return;
    }
    setIsChecking(true);
    setCertificationStatus(null);
    setQrCodeUrl(null);
    try {
      const isCertified = await contract.isCertified(cropId);
      if (isCertified) {
        setCertificationStatus('Crop is certified!');
        const verificationUrl = `https://agriverify.com/verify/${cropId}`; // Replace with your actual verification URL
        setQrCodeUrl(verificationUrl);
      } else {
        setCertificationStatus('Crop is not certified.');
      }
    } catch (error) {
      console.error('Error checking certification:', error);
      setCertificationStatus('Failed to check certification. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Check Certification</h3>
      </div>
      <div className="border-t border-gray-200">
        <form onSubmit={handleCheck} className="px-4 py-5 sm:p-6">
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
              disabled={isChecking}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isChecking ? 'Checking...' : 'Check Certification'}
            </button>
          </div>
        </form>
      </div>
      {certificationStatus && (
        <div className={`px-4 py-3 ${certificationStatus.includes('certified') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {certificationStatus}
        </div>
      )}
      {qrCodeUrl && (
        <div className="px-4 py-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Verification QR Code:</h4>
          <QRCode value={qrCodeUrl} size={200} />
        </div>
      )}
    </div>
  );
};

export default CheckCertification;