import StakingContractAbi from '../ABIs/StakingContract.json';
import DummyTokenAbi from '../ABIs/DummyToken.json';
import contractAddresses from '../../contract/ignition/deployments/chain-11155111/deployed_addresses.json';

export const stakingContract = {
  address: contractAddresses['StakingModule#StakingContract'],
  abi: StakingContractAbi,
};

export const dummyTokenContract = {
  address: contractAddresses['StakingModule#DummyToken'],
  abi: DummyTokenAbi,
};