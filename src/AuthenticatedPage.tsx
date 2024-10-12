import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';

interface AuthenticatedPageProps {
  contract: ethers.Contract | null;
}

const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({ contract }) => {
  const { cropId } = useParams<{ cropId: string }>();
  const [cropDetails, setCropDetails] = useState<{
    name: string;
    location: string;
    certificationDate: number;
    isCertified: boolean;
  } | null>(null);

  useEffect(() => {
    if (contract && cropId) {
      fetchCropDetails();
    }
  }, [contract, cropId]);

  const fetchCropDetails = async () => {
    try {
      const details = await contract?.getCropDetails(cropId);
      setCropDetails({
        name: details[0],
        location: details[1],
        certificationDate: details[2].toNumber(),
        isCertified: details[3],
      });
    } catch (error) {
      console.error('Error fetching crop details:', error);
    }
  };

  if (!cropDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Crop Authentication</h1>
      <p>Crop ID: {cropId}</p>
      <p>Name: {cropDetails.name}</p>
      <p>Location: {cropDetails.location}</p>
      <p>Certification Date: {new Date(cropDetails.certificationDate * 1000).toLocaleString()}</p>
      <p>Certified: {cropDetails.isCertified ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default AuthenticatedPage;