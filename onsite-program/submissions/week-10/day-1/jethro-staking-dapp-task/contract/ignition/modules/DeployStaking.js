const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("StakingModule", (m) => {
  
  const dummyToken = m.contract("DummyToken");


  const stakingTokenAddress = dummyToken;
  const initialApr = m.getParameter("initialApr", 20); 
  const minLockDuration = m.getParameter("minLockDuration", 60 * 60 * 24 * 7); 
  const aprReductionPerThousand = m.getParameter("aprReductionPerThousand", 10); 
  const emergencyWithdrawPenalty = m.getParameter("emergencyWithdrawPenalty", 10); 

  
  const stakingContract = m.contract("StakingContract", [
    stakingTokenAddress,
    initialApr,
    minLockDuration,
    aprReductionPerThousand,
    emergencyWithdrawPenalty,
  ]);

  
  return { stakingContract, dummyToken };
});