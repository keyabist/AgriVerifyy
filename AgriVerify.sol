// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriVerify {
    struct Farmer {
        string name;
        bool isRegistered;
        uint256[] cropIds;
    }

    struct Crop {
        string name;
        string location;
        uint256 certificationDate;
        bool isCertified;
    }

    mapping(address => Farmer) public farmers;
    mapping(uint256 => Crop) public crops;
    uint256 public cropIdCounter;

    event FarmerRegistered(address farmerAddress, string name);
    event CropAdded(uint256 cropId, string name, string location);
    event CropCertified(uint256 cropId);

    function registerFarmer(string memory _name) public {
        require(!farmers[msg.sender].isRegistered, "Farmer already registered");
        farmers[msg.sender] = Farmer(_name, true, new uint256[](0));
        emit FarmerRegistered(msg.sender, _name);
    }

    function addCrop(string memory _name, string memory _location) public {
        require(farmers[msg.sender].isRegistered, "Farmer not registered");
        uint256 cropId = cropIdCounter++;
        crops[cropId] = Crop(_name, _location, 0, false);
        farmers[msg.sender].cropIds.push(cropId);
        emit CropAdded(cropId, _name, _location);
    }

    function certifyCrop(uint256 _cropId) public {
        require(crops[_cropId].certificationDate == 0, "Crop already certified");
        crops[_cropId].isCertified = true;
        crops[_cropId].certificationDate = block.timestamp;
        emit CropCertified(_cropId);
    }

    function getFarmerDetails(address _farmerAddress) public view returns (string memory name, uint256[] memory cropIds) {
        Farmer storage farmer = farmers[_farmerAddress];
        return (farmer.name, farmer.cropIds);
    }

    function getCropDetails(uint256 _cropId) public view returns (string memory name, string memory location, uint256 certificationDate, bool isCertified) {
        Crop storage crop = crops[_cropId];
        return (crop.name, crop.location, crop.certificationDate, crop.isCertified);
    }
}