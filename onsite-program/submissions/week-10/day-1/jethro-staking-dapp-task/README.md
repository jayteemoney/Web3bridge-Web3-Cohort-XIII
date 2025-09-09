# StakeMaster dApp

StakeMaster is a modern, feature-rich frontend application for interacting with a decentralized staking smart contract. It provides a seamless and intuitive user experience for staking tokens, claiming rewards, and managing stake positions, all powered by the latest in Web3 technology.

## Features

-   **Seamless Wallet Integration**: Connect easily with your favorite wallet using RainbowKit, with support for multiple wallet providers and EIP-6963.
-   **Dynamic Staking & Withdrawing**: A clear two-step process (approve & stake) for staking tokens and a straightforward interface for withdrawing matured stakes.
-   **Real-Time Reward Management**: View your pending rewards update in real-time and claim them with a single click.
-   **Emergency Withdraw**: A safety feature allowing users to withdraw their staked tokens at any time, forfeiting any accrued rewards.
-   **Comprehensive Dashboard**: Get a complete overview of the protocol's health with statistics like Total Value Locked (TVL) and the current Annual Percentage Rate (APR).
-   **Detailed Stake Positions**: Track each of your individual stake positions, including the staked amount and a live countdown timer to the unlock date.
-   **Modern & Responsive UI**: Built with Tailwind CSS and Flowbite React, the interface is sleek, dark-themed, and fully responsive for a great experience on any device.
-   **Instant Transaction Feedback**: Receive instant toast notifications for all your transactions—staking, claiming, and withdrawing—powered by React Hot Toast.

## Technology Stack

-   **Framework**: React (Vite)
-   **Web3 Integration**: `wagmi` & `viem` for powerful and efficient smart contract interactions.
-   **Wallet Connector**: `@rainbow-me/rainbowkit` for a best-in-class wallet connection experience.
-   **UI/Styling**: Tailwind CSS, Flowbite React, and React Hot Toast.
-   **Smart Contract**: The accompanying Hardhat project for the staking contract can be found in the `/contract` directory.

## Setup and Installation

To get the project up and running on your local machine, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd stakingg
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up WalletConnect:**
    -   Go to [WalletConnect Cloud](https://cloud.walletconnect.com/) and create a new project to get a Project ID.
    -   Open `src/main.jsx` and replace `YOUR_PROJECT_ID` with your actual WalletConnect Project ID.

    ```javascript
    // src/main.jsx

    // ...
    const { connectors } = getDefaultConfig({
      appName: 'StakeMaster',
      projectId: 'YOUR_PROJECT_ID', // <-- PASTE YOUR ID HERE
      chains: [sepolia],
      ssr: false,
    });
    // ...
    ```

## Running the Application

Once the installation is complete, you can run the development server:

```bash
npm run dev
```

This will start the application, and you can view it in your browser at the local address provided in your terminal (usually `http://localhost:5173`).