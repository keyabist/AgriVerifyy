import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'

interface CropDetailsProps {
  contract: ethers.Contract | null
  currentAccount: string | null
}

export default function CropDetails({ contract, currentAccount }: CropDetailsProps) {
  const { cropId } = useParams<{ cropId: string }>()
  const [cropDetails, setCropDetails] = useState<{
    name: string
    location: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    if (contract && cropId) {
      fetchCropDetails()
    }
  }, [contract, cropId])

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
    } catch (error) {
      console.error('Error fetching crop details:', error)
      setError('Failed to fetch crop details')
      setCropDetails(null)
    }
  }

  const handleBackToHome = () => {
    navigate('/');
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!cropDetails) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Crop Details</h1>
      <div className="space-y-2 text-gray-600">
        <p><strong className="text-gray-700">Crop ID:</strong> {cropId}</p>
        <p><strong className="text-gray-700">Name:</strong> {cropDetails.name}</p>
        <p><strong className="text-gray-700">Location:</strong> {cropDetails.location}</p>
        <p><strong className="text-gray-700">Certified:</strong> Yes</p>
      </div>
      {currentAccount && (
        <p className="text-sm text-gray-500 mt-4">Verified by: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}</p>
      )}
      <button
        onClick={handleBackToHome}
        className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors"
      >
        Back to Home
      </button>
    </div>
  )
}