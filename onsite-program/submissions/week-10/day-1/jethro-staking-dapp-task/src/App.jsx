import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Staking from './components/Staking';
import Rewards from './components/Rewards';
import Statistics from './components/Statistics';
import UserStakes from './components/UserStakes'; // Import UserStakes

function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex justify-between items-center p-4 border-b border-slate-700">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          StakeMaster
        </h1>
        <ConnectButton />
      </header>

      <main className="p-4 md:p-8">
        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-8">
              <Statistics />
            </div>
            <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Staking />
                <Rewards />
              </div>
              <UserStakes />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <h2 className="text-4xl font-bold mb-4">Welcome to StakeMaster</h2>
            <p className="text-slate-400 text-lg">
              Please connect your wallet to view your staking positions and interact with the protocol.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;