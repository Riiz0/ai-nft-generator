const hre = require("hardhat");

async function main() {
  const AINFTCollection = await hre.ethers.getContractFactory("AINFTCollection");
  const aiNFTCollection = await AINFTCollection.deploy();

  await aiNFTCollection.deploy();

  console.log("AI NFT Collection is deployed to:", aiNFTCollection.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
