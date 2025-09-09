import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { Card } from 'flowbite-react';
import { stakingContract } from '../contracts';

const Statistics = () => {
  // Fetch total staked tokens from the contract
  const { data: totalStaked, isLoading: isLoadingTotalStaked } = useReadContract({
    ...stakingContract,
    functionName: 'totalStaked',
  });

  // Fetch the current reward rate from the contract
  const { data: rewardRate, isLoading: isLoadingRewardRate } = useReadContract({
    ...stakingContract,
    functionName: 'currentRewardRate',
  });
console.log({totalStaked, rewardRate});

  // Calculate APR
  const calculateAPR = () => {
    if (!rewardRate || !totalStaked || totalStaked === 0n) {
      return '0.00';
    }
    // APR = (rewardRate * seconds_in_a_year) / totalStaked * 100
    const rewardsPerYear = rewardRate * 31536000n; // 60 * 60 * 24 * 365
    const apr = (Number(rewardsPerYear) / Number(totalStaked)) * 100;
    return apr.toFixed(2);
  };

  const apr = Number(rewardRate)
  const isLoading = isLoadingTotalStaked || isLoadingRewardRate;

  return (
    <Card className="bg-slate-800/60 border border-slate-700/50">
      <h2 className="text-2xl font-bold text-white mb-4">Protocol Statistics</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Total Value Locked (TVL)</span>
          {isLoading ? (
            <div className="h-6 bg-slate-700 rounded-md w-24 animate-pulse"></div>
          ) : (
            <span className="font-bold text-lg text-cyan-400">
              {totalStaked ? `${formatUnits(totalStaked, 18)} DMT` : '0 DMT'}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Annual Percentage Rate (APR)</span>
          {isLoading ? (
            <div className="h-6 bg-slate-700 rounded-md w-20 animate-pulse"></div>
          ) : (
            <span className="font-bold text-lg text-green-400">{apr}%</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Statistics;