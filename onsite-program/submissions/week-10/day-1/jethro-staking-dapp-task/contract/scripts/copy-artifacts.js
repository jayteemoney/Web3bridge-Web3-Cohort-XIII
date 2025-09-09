const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const chainId = hre.network.config.chainId;
  if (!chainId) {
    throw new Error("No chainId found in network config. Please specify a network.");
  }

  const deploymentDir = path.join(__dirname, "..", "ignition", "deployments", `chain-${chainId}`);

  if (!fs.existsSync(deploymentDir)) {
    console.error(`Deployment directory not found for chainId ${chainId}.`);
    console.error("Please run 'npx hardhat ignition deploy' first.");
    process.exit(1);
  }

  const deployedAddressesPath = path.join(deploymentDir, "deployed_addresses.json");
  const addresses = JSON.parse(fs.readFileSync(deployedAddressesPath, "utf8"));

  const abiDir = path.join(__dirname, "..", "..", "src", "abi");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  const contractAddresses = {
    stakingContract: addresses["StakingModule#StakingContract"],
    stakingToken: addresses["StakingModule#DummyToken"],
  };

  fs.writeFileSync(
    path.join(abiDir, "contract-addresses.json"),
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log(`✅ Contract addresses saved to ${path.join(abiDir, "contract-addresses.json")}`);

  const stakingArtifactPath = path.join(deploymentDir, "artifacts", "StakingModule#StakingContract.json");
  const stakingArtifact = JSON.parse(fs.readFileSync(stakingArtifactPath, "utf8"));
  fs.writeFileSync(
    path.join(abiDir, "StakingContract.json"),
    JSON.stringify(stakingArtifact.abi, null, 2)
  );

  const tokenArtifactPath = path.join(deploymentDir, "artifacts", "StakingModule#DummyToken.json");
  const tokenArtifact = JSON.parse(fs.readFileSync(tokenArtifactPath, "utf8"));
  fs.writeFileSync(
    path.join(abiDir, "DummyToken.json"),
    JSON.stringify(tokenArtifact.abi, null, 2)
  );

  console.log(`✅ Contract ABIs saved to ${abiDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});