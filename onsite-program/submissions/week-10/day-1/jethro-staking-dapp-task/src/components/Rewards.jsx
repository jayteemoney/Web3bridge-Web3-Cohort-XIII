import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { Card, Button } from 'flowbite-react';
import { stakingContract } from '../contracts';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const Rewards = () => {
  const { address, isConnected } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();

  // Fetch user's pending rewards
  const { data: pendingRewards, isLoading: isLoadingRewards, refetch } = useReadContract({
    ...stakingContract,
    functionName: 'pendingRewards',
    args: [address],
    query: {
      enabled: isConnected, // Only fetch if wallet is connected
    },
  });

  // Function to handle claiming rewards
  const handleClaim = async () => {
    if (!pendingRewards || pendingRewards === 0n) {
      toast.error("You have no rewards to claim.");
      return;
    }
    writeContract({
      ...stakingContract,
      functionName: 'claimRewards',
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirming) {
      toast.loading('Claiming rewards...', { id: 'claim' });
    }
    if (isConfirmed) {
      toast.success('Rewards claimed successfully!', { id: 'claim' });
      refetch(); // Refetch rewards balance after claiming
    }
  }, [isConfirming, isConfirmed]);


  return (
    <Card className="bg-slate-800/60 border border-slate-700/50">
      <h2 className="text-2xl font-bold text-white mb-4">Your Rewards</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Pending Rewards</span>
          {isLoadingRewards ? (
            <div className="h-6 bg-slate-700 rounded-md w-28 animate-pulse"></div>
          ) : (
            <span className="font-bold text-lg text-amber-400">
              {pendingRewards ? `${formatUnits(pendingRewards, 18)} DMT` : '0 DMT'}
            </span>
          )}
        </div>
        <Button
          onClick={handleClaim}
          isProcessing={isPending || isConfirming}
          disabled={!isConnected || !pendingRewards || pendingRewards === 0n || isPending || isConfirming}
          gradientDuoTone="purpleToBlue"
          className="w-full"
        >
          {isPending || isConfirming ? 'Claiming...' : 'Claim Rewards'}
        </Button>
      </div>
    </Card>
  );
};

export default Rewards;