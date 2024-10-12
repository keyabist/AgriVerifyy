import React, { useState } from 'react';
import { ethers } from 'ethers';
import QRCode from 'qrcode';

interface HomeProps {
  currentAccount: string | null;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
}

const Home: React.FC<HomeProps> = ({ currentAccount, contract, connectWallet }) => {
  const [farmerName, setFarmerName] = useState('');
  const [cropName, setCropName] = useState('');
  const [cropLocation, setCropLocation] = useState('');
  const [farmerDetails, setFarmerDetails] = useState<{ name: string; cropIds: number[] } | null>(null);
  const [qrCode, setQRCode] = useState<string | null>(null);

  const registerFarmer = async () => {
    if (!contract) return;
    try {
      const tx = await contract.registerFarmer(farmerName);
      await tx.wait();
      alert('Farmer registered successfully!');
    } catch (error) {
      console.error('Error registering farmer:', error);
    }
  };

  const addCrop = async () => {
    if (!contract) return;
    try {
      const tx = await contract.addCrop(cropName, cropLocation);
      await tx.wait();
      alert('Crop added successfully!');
    } catch (error) {
      console.error('Error adding crop:', error);
    }
  };

  const fetchDetails = async () => {
    if (!contract || !currentAccount) return;
    try {
      const details = await contract.getFarmerDetails(currentAccount);
      setFarmerDetails({ name: details[0], cropIds: details[1].map((id: ethers.BigNumber) => id.toNumber()) });
      
      if (details[1].length > 0) {
        const lastCropId = details[1][details[1].length - 1];
        const qr = await QRCode.toDataURL(`${window.location.origin}/authenticated/${lastCropId}`);
        setQRCode(qr);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  return (
    <div>
      <h1>AgriVerify</h1>
      {!currentAccount ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected Account: {currentAccount}</p>
          <div>
            <h2>Register Farmer</h2>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              placeholder="Farmer Name"
            />
            <button onClick={registerFarmer}>Register</button>
          </div>
          <div>
            <h2>Add Crop</h2>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="Crop Name"
            />
            <input
              type="text"
              value={cropLocation}
              onChange={(e) => setCropLocation(e.target.value)}
              placeholder="Crop Location"
            />
            <button onClick={addCrop}>Add Crop</button>
          </div>
          <div>
            <h2>Fetch Details</h2>
            <button onClick={fetchDetails}>Fetch Details</button>
            {farmerDetails && (
              <div>
                <p>Farmer Name: {farmerDetails.name}</p>
                <p>Crop IDs: {farmerDetails.cropIds.join(', ')}</p>
              </div>
            )}
            {qrCode && (
              <div>
                <h3>QR Code for Latest Crop</h3>
                <img src={qrCode} alt="QR Code" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;