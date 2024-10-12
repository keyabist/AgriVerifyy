import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CropAuthentication from './components/CropAuthentication';
import CropDetails from './components/CropDetails';
import AgriVerifyABI from './AgriVerify.json';

const contractAddress = "0xF7563C41f503c45a67B8771608d2191F47Ee9C2F"; // Replace with your deployed contract address

function App() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        console.log("Ethereum object found");
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
          console.log("Found an authorized account:", accounts[0]);
          setCurrentAccount(accounts[0]);
          setupContract(ethereum);
        } else {
          console.log("No authorized account found");
        }
      } else {
        setError("Please install MetaMask");
        console.log("Please install MetaMask");
      }
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
      setError("Failed to connect to wallet");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        setError("Please install MetaMask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected to account:", accounts[0]);
      setCurrentAccount(accounts[0]);
      setupContract(ethereum);
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
      setError("Failed to connect to wallet");
    }
  };

  const setupContract = (ethereum: any) => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const agriVerifyContract = new ethers.Contract(contractAddress, AgriVerifyABI, signer);
      console.log("Contract setup complete");
      setContract(agriVerifyContract);
    } catch (error) {
      console.error("Failed to setup contract:", error);
      setError("Failed to setup contract");
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Routes>
          <Route path="/" element={
            <CropAuthentication
              contract={contract}
              connectWallet={connectWallet}
              currentAccount={currentAccount}
            />
          } />
          <Route path="/crop/:cropId" element={
            <CropDetails
              contract={contract}
              currentAccount={currentAccount}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;