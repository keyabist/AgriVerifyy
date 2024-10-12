import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { QRCodeSVG } from 'qrcode.react'

interface CropAuthenticationProps {
  contract: ethers.Contract | null
  connectWallet: () => Promise<void>
  currentAccount: string | null
}

export default function CropAuthentication({ contract, connectWallet, currentAccount }: CropAuthenticationProps) {
  const [cropId, setCropId] = useState<string | null>(null)
  const [cropDetails, setCropDetails] = useState<{
    name: string
    location: string
  } | null>(null)
  const [farmerName, setFarmerName] = useState('')
  const [newCropName, setNewCropName] = useState('')
  const [newCropLocation, setNewCropLocation] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const fetchCropDetails = async () => {
    if (!contract || !cropId) return
    try {
      console.log("Fetching crop details for ID:", cropId)
      const details = await contract.getCropDetails(cropId)
      console.log("Crop details:", details)
      setCropDetails({
        name: details[0],
        location: details[1],
      })
      setQrCodeUrl(`${window.location.origin}/crop/${cropId}`)
    } catch (error) {
      console.error('Error fetching crop details:', error)
      setError('Failed to fetch crop details')
      setCropDetails(null)
      setQrCodeUrl(null)
    }
  }

  const checkFarmerRegistration = async () => {
    if (!contract || !currentAccount) return
    try {
      const isRegistered = await contract.isFarmerRegistered(currentAccount)
      setIsRegistered(isRegistered)
    } catch (error) {
      console.error('Error checking farmer registration:', error)
    }
  }

  const registerFarmer = async () => {
    if (!contract) {
      console.error("Contract is not initialized")
      setError("Contract is not initialized. Please make sure you're connected to the correct network.")
      return
    }
    if (!farmerName) {
      setError("Please enter a farmer name")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      console.log("Registering farmer:", farmerName)
      const tx = await contract.registerFarmer(farmerName)
      console.log("Transaction sent:", tx.hash)
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt.transactionHash)
      alert('Farmer registered successfully!')
      setFarmerName('')
      setIsRegistered(true)
    } catch (error: any) {
      console.error('Error registering farmer:', error)
      if (error.code === 'ACTION_REJECTED') {
        setError('Transaction was rejected by the user')
      } else if (error.message.includes('user rejected transaction')) {
        setError('Transaction was rejected by the user')
      } else if (error.message.includes('Farmer already registered')) {
        setError('You are already registered as a farmer')
        setIsRegistered(true)
      } else {
        setError(`Failed to register farmer: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addCrop = async () => {
    if (!contract) return
    if (!newCropName || !newCropLocation) {
      setError("Please enter both crop name and location")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      console.log("Adding crop:", newCropName, newCropLocation)
      const tx = await contract.addCrop(newCropName, newCropLocation)
      console.log("Transaction sent:", tx.hash)
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt.transactionHash)
      const event = receipt.events.find((e: any) => e.event === 'CropAdded')
      if (event) {
        const newCropId = event.args.cropId.toString()
        console.log("New crop added with ID:", newCropId)
        setCropId(newCropId)
        setQrCodeUrl(`${window.location.origin}/crop/${newCropId}`)
      }
      alert('Crop added successfully!')
      setNewCropName('')
      setNewCropLocation('')
    } catch (error: any) {
      console.error('Error adding crop:', error)
      setError(`Failed to add crop: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (cropId) {
      fetchCropDetails()
    }
  }, [cropId, contract])

  useEffect(() => {
    if (contract && currentAccount) {
      checkFarmerRegistration()
    }
  }, [contract, currentAccount])

  return (
    <div className="bg-gradient-to-r from-green-200 to-blue-200 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">AgriVerify</h1>
      {!currentAccount ? (
        <button onClick={connectWallet} className="w-full bg-blue-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-600 transition-colors">
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="text-sm text-gray-600 text-center mb-4">Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}</p>
          {error && <p className="text-red-600 text-center mb-4 bg-red-100 p-2 rounded">{error}</p>}
          {isLoading && <p className="text-blue-600 text-center mb-4 bg-blue-100 p-2 rounded">Processing transaction...</p>}
          {cropDetails ? (
            <div className="space-y-4 bg-white p-4 rounded-lg">
              <div className="space-y-2">
                <p><strong className="text-gray-700">Crop ID:</strong> {cropId}</p>
                <p><strong className="text-gray-700">Name:</strong> {cropDetails.name}</p>
                <p><strong className="text-gray-700">Location:</strong> {cropDetails.location}</p>
                <p><strong className="text-gray-700">Certified:</strong> Yes</p>
              </div>
              {qrCodeUrl && (
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium mb-2 text-gray-600">Scan QR Code for Crop Details:</p>
                  <QRCodeSVG value={qrCodeUrl} size={128} />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Farmer Registration</h2>
                <div>
                  <label htmlFor="farmerName" className="block text-sm font-medium text-gray-700">Farmer Name</label>
                  <input
                    id="farmerName"
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="Enter farmer name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <button 
                  onClick={registerFarmer} 
                  className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-400"
                  disabled={isLoading || isRegistered}
                >
                  {isLoading ? 'Registering...' : isRegistered ? 'Already Registered' : 'Register Farmer'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Crop</h2>
                <div>
                  <label htmlFor="cropName" className="block text-sm font-medium text-gray-700">Crop Name</label>
                  <input
                    id="cropName"
                    type="text"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    placeholder="Enter crop name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="cropLocation" className="block text-sm font-medium text-gray-700">Crop Location</label>
                  <input
                    id="cropLocation"
                    type="text"
                    value={newCropLocation}
                    onChange={(e) => setNewCropLocation(e.target.value)}
                    placeholder="Enter crop location"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={addCrop} 
                  className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                  disabled={isLoading || !isRegistered}
                >
                  {isLoading ? 'Adding Crop...' : 'Add Crop'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      <p className="text-sm text-gray-600 text-center mt-6">Powered by AgriVerify</p>
    </div>
  )
}