import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { Card, Button, TextInput, Label } from 'flowbite-react';
import { stakingContract, dummyTokenContract } from '../contracts';
import toast from 'react-hot-toast';

const Staking = () => {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');

  // State for tracking different transaction hashes
  const [approveHash, setApproveHash] = useState();
  const [stakeHash, setStakeHash] = useState();
  const [emergencyWithdrawHash, setEmergencyWithdrawHash] = useState();

  const { writeContract, isPending: isWritePending } = useWriteContract();

  // 1. Read user's DMT balance and total staked amount
  const { data: balance, isLoading: isLoadingBalance, refetch: refetchBalance } = useReadContract({
    ...dummyTokenContract,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: isConnected },
  });

  const { data: stakedBalance, isLoading: isLoadingStaked, refetch: refetchStakedBalance } = useReadContract({
    ...stakingContract,
    functionName: 'stakedBalance',
    args: [address],
    query: { enabled: isConnected },
  });

  // 2. Stake logic (Approve and Stake)
  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount to stake.');
      return;
    }
    const amountToStake = parseUnits(amount, 18);

    // Step 1: Approve the StakingContract to spend DMT
    writeContract({
      ...dummyTokenContract,
      functionName: 'approve',
      args: [stakingContract.address, amountToStake],
    }, {
      onSuccess: (hash) => setApproveHash(hash),
      onError: (error) => toast.error(`Approval failed: ${error.shortMessage}`),
    });
  };

  // 3. Emergency Withdraw logic
  const handleEmergencyWithdraw = () => {
    writeContract({
      ...stakingContract,
      functionName: 'emergencyWithdraw',
    }, {
      onSuccess: (hash) => setEmergencyWithdrawHash(hash),
      onError: (error) => toast.error(`Withdrawal failed: ${error.shortMessage}`),
    });
  };

  // 4. Transaction receipt tracking for notifications
  const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStaking, isSuccess: isStaked } = useWaitForTransactionReceipt({ hash: stakeHash });
  const { isLoading: isWithdrawing, isSuccess: isWithdrawn } = useWaitForTransactionReceipt({ hash: emergencyWithdrawHash });

  // Effect for handling the two-step stake process
  useEffect(() => {
    if (isApproving) toast.loading('Approving token spend...', { id: 'stake' });
    if (isApproved) {
      toast.loading('Approval successful! Now staking...', { id: 'stake' });
      const amountToStake = parseUnits(amount, 18);
      // Step 2: Call stake now that approval is confirmed
      writeContract({
        ...stakingContract,
        functionName: 'stake',
        args: [amountToStake],
      }, {
        onSuccess: (hash) => setStakeHash(hash),
        onError: (error) => toast.error(`Staking failed: ${error.shortMessage}`, { id: 'stake' }),
      });
    }
  }, [isApproving, isApproved]);

  // Effect for staking transaction notifications
  useEffect(() => {
    if (isStaking) toast.loading('Confirming stake transaction...', { id: 'stake' });
    if (isStaked) {
      toast.success('Staked successfully!', { id: 'stake' });
      setAmount('');
      refetchBalance();
      refetchStakedBalance();
      // We will also refetch the user's stakes list here later
    }
  }, [isStaking, isStaked]);

  // Effect for emergency withdraw notifications
  useEffect(() => {
    if (isWithdrawing) toast.loading('Processing emergency withdrawal...', { id: 'withdraw' });
    if (isWithdrawn) {
      toast.success('Emergency withdrawal successful!', { id: 'withdraw' });
      refetchBalance();
      refetchStakedBalance();
      // We will also refetch the user's stakes list here later
    }
  }, [isWithdrawing, isWithdrawn]);

  const isProcessing = isApproving || isStaking || isWithdrawing || isWritePending;

  return (
    <Card className="bg-slate-800/60 border border-slate-700/50">
      <h2 className="text-2xl font-bold text-white mb-4">Stake Tokens</h2>
      <div className="space-y-4">
        {/* Balance Info */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Your DMT Balance</span>
          {isLoadingBalance ? (
            <div className="h-5 bg-slate-700 rounded-md w-24 animate-pulse"></div>
          ) : (
            <span className="font-medium text-white">
              {balance ? `${formatUnits(balance, 18)} DMT` : '0 DMT'}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Your Total Staked</span>
          {isLoadingStaked ? (
            <div className="h-5 bg-slate-700 rounded-md w-24 animate-pulse"></div>
          ) : (
            <span className="font-medium text-white">
              {stakedBalance ? `${formatUnits(stakedBalance, 18)} DMT` : '0 DMT'}
            </span>
          )}
        </div>

        {/* Staking Form */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="amount" value="Amount to Stake" className="text-slate-300" />
          </div>
          <TextInput
            id="amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="[&_input]:bg-slate-900/50 [&_input]:border-slate-700 [&_input]:text-white"
          />
        </div>
        <Button
          onClick={handleStake}
          isProcessing={isProcessing}
          disabled={!isConnected || isProcessing}
          gradientDuoTone="cyanToBlue"
          className="w-full"
        >
          {isProcessing ? 'Processing...' : 'Stake'}
        </Button>
        <Button
          onClick={handleEmergencyWithdraw}
          isProcessing={isProcessing}
          disabled={!isConnected || isProcessing || !stakedBalance || stakedBalance === 0n}
          color="failure"
          className="w-full"
        >
          {isProcessing ? 'Processing...' : 'Emergency Withdraw'}
        </Button>
      </div>
    </Card>
  );
};

export default Staking;