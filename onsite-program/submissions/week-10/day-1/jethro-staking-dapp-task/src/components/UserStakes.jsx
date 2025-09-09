import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { stakingContract } from '../contracts';
import { formatUnits } from 'viem';
import { Card, Button, Spinner, Alert } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import Countdown from 'react-countdown';

const UserStakes = () => {
  const { address } = useAccount();

  const { data: userDetails, isLoading: isLoadingUserDetails, refetch: refetchUserDetails } = useReadContract({
      ...stakingContract,
      functionName: 'getUserDetails',
      args: [address],
      enabled: !!address,
  });

  const { data: stakes, isLoading: isLoadingStakes, refetch: refetchStakes } = useReadContract({
    ...stakingContract,
    functionName: 'getStakes',
    args: [address],
    enabled: !!address,
  });

  const [withdrawalStates, setWithdrawalStates] = useState({});

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const withdraw = (index) => {
    setWithdrawalStates(prev => ({ ...prev, [index]: { isWithdrawing: true } }));
    writeContract({
      ...stakingContract,
      functionName: 'withdraw',
      args: [index],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Withdrawal successful!');
      refetchStakes();
      refetchUserDetails();
      setWithdrawalStates({});
    }
    if (error) {
        const activeWithdrawalIndex = Object.keys(withdrawalStates).find(index => withdrawalStates[index].isWithdrawing);
        if (activeWithdrawalIndex) {
            toast.error(`Withdrawal failed: ${error.shortMessage || error.message}`);
            setWithdrawalStates(prev => ({ ...prev, [activeWithdrawalIndex]: { isWithdrawing: false } }));
        }
    }
  }, [isConfirmed, error, refetchStakes, refetchUserDetails]);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Ready to withdraw</span>;
    } else {
      return (
        <span>
          Unlocks in: {days}d {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Unlocked</span>;
    } else {
      return (
        <span>
          {days}d {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  if (isLoadingStakes || isLoadingUserDetails) {
    return (
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <div className="flex justify-center">
          <Spinner aria-label="Loading user data..." />
        </div>
      </Card>
    );
  }

  if ((!stakes || stakes.length === 0) && (!userDetails || !userDetails.stakedAmount)) {
    return (
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <h5 className="text-2xl font-bold tracking-tight text-white">Your Stakes</h5>
        <p className="font-normal text-gray-400">You have no active stakes.</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
      <h5 className="text-2xl font-bold tracking-tight text-white">Your Staking Details</h5>
      
      {userDetails && userDetails.stakedAmount > 0 && (
          <div className="p-4 rounded-lg bg-gray-700 border border-gray-600 mb-6">
              <h6 className="text-xl font-bold tracking-tight text-white mb-3">Summary</h6>
              <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                      <p className="text-gray-400">Total Staked</p>
                      <p className="text-white font-semibold">{formatUnits(userDetails.stakedAmount, 18)} DMT</p>
                  </div>
                  <div>
                      <p className="text-gray-400">Pending Rewards</p>
                      <p className="text-white font-semibold">{formatUnits(userDetails.pendingRewards, 18)} DMT</p>
                  </div>
                  <div>
                      <p className="text-gray-400">Can Withdraw</p>
                      <p className="text-white font-semibold">{userDetails.canWithdraw ? 'Yes' : 'No'}</p>
                  </div>
                  {Number(userDetails.timeUntilUnlock) > 0 && (
                      <div>
                          <p className="text-gray-400">Time Until Unlock</p>
                          <p className="text-white font-semibold">
                              <Countdown date={Date.now() + Number(userDetails.timeUntilUnlock) * 1000} renderer={countdownRenderer} />
                          </p>
                      </div>
                  )}
              </div>
          </div>
      )}

      <h6 className="text-xl font-bold tracking-tight text-white mb-3">Individual Stakes</h6>
      <div className="space-y-4">
        {stakes && stakes.length > 0 ? stakes.map((stake, index) => {
          const unlockTime = new Date(Number(stake.unlockTime) * 1000);
          const isMatured = unlockTime <= new Date();
          const isWithdrawing = withdrawalStates[index]?.isWithdrawing || (isConfirming && withdrawalStates[index]);

          return (
            <div key={index} className="p-4 rounded-lg bg-gray-700 border border-gray-600 flex justify-between items-center">
              <div>
                <p className="text-xl font-semibold text-white">{formatUnits(stake.amount, 18)} DMT</p>
                <p className="text-sm text-gray-400">
                  <Countdown date={unlockTime} renderer={renderer} />
                </p>
              </div>
              <Button
                color="purple"
                onClick={() => withdraw(index)}
                disabled={!isMatured || isWithdrawing || isPending}
              >
                {isWithdrawing ? <Spinner size="sm" /> : 'Withdraw'}
              </Button>
            </div>
          );
        }) : <p className="font-normal text-gray-400">No individual stakes found.</p>}
      </div>
    </Card>
  );
};

export default UserStakes;