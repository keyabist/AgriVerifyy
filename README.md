# AgriVerifyy

AgriVerifyy is a blockchain-based solution for agricultural supply chain management and product verification. This project aims to enhance transparency, traceability, and trust in the agricultural industry by leveraging blockchain technology.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Smart Contracts](#smart-contracts)
- [Frontend](#frontend)
- [Contributing](#contributing)
- [License](#license)

## Features

- Blockchain-based product verification
- QR code generation for agricultural products
- User authentication and authorization
- Product registration and tracking
- Supply chain management
- Responsive web interface

## Technologies Used

- Solidity (for smart contracts)
- Hardhat (Ethereum development environment)
- React.js (frontend framework)
- Next.js (React framework for server-side rendering)
- Ethers.js (Ethereum library)
- Tailwind CSS (for styling)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm
- MetaMask browser extension

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/keyabist/AgriVerifyy.git
   cd AgriVerifyy
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

The usage section is crucial for users to understand how to interact with your application. Follow these steps to run and use the AgriVerifyy application:

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Connect your MetaMask wallet to interact with the dApp

4. Use the application to register products, generate QR codes, verify products, and manage the supply chain

Note: Ensure that you have set up your MetaMask wallet correctly and connected it to the appropriate network (e.g., Ethereum mainnet, testnet, or local development network) before interacting with the dApp.

## Smart Contracts

The smart contracts for this project are located in the `contracts` directory. The main contract is `AgriVerifyy.sol`, which handles product registration, verification, and supply chain management.

To compile and deploy the smart contracts:

1. Compile contracts:
   ```
   npx hardhat compile
   ```

2. Deploy contracts:
   ```
   npx hardhat run scripts/deploy.js --network <your-network>
   ```

## Frontend

The frontend is built using React.js and Next.js. The main components and pages are located in the `pages` and `components` directories.

Key features of the frontend include:
- User authentication
- Product registration form
- QR code generation
- Product verification
- Supply chain management interface

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Demonstration of AgriVerifyy

https://drive.google.com/file/d/1_8-ZYdYPxcs5Z_N_197lLgpOAQGY1WyR/view?usp=sharing

## License

This project is licensed under the MIT License.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
