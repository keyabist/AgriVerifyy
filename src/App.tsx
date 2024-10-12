import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AuthenticatedPage from './components/AuthenticatedPage';
import AgriVerifyABI from './AgriVerify.json';

const contractAddress = "0xF7563C41f503c45a67B8771608d2191F47Ee9C2F"; // Replace with your deployed contract address

function App() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          setupContract(ethereum);
        }
      } else {
        console.log("Please install MetaMask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      setupContract(ethereum);
    } catch (error) {
      console.log(error);
    }
  };

  const setupContract = (ethereum: any) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const agriVerifyContract = new ethers.Contract(contractAddress, AgriVerifyABI.abi, signer);
    setContract(agriVerifyContract);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home currentAccount={currentAccount} contract={contract} connectWallet={connectWallet} />} />
          <Route path="/authenticated/:cropId" element={<AuthenticatedPage contract={contract} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;