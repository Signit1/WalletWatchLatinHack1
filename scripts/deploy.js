const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying VerificationNFT contract...");

  // Obtener el deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy del contrato
  const VerificationNFT = await ethers.getContractFactory("VerificationNFT");
  const verificationNFT = await VerificationNFT.deploy();

  await verificationNFT.deployed();

  console.log("✅ VerificationNFT deployed to:", verificationNFT.address);
  console.log("📝 Contract ABI:", verificationNFT.interface.format("json"));
  
  // Guardar la dirección del contrato
  const fs = require('fs');
  const contractInfo = {
    address: verificationNFT.address,
    abi: verificationNFT.interface.format("json"),
    network: "localhost", // Cambiar según la red
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    './contract-info.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("💾 Contract info saved to contract-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
