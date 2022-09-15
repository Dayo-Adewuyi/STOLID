const { ethers, upgrades } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Stolid = await hre.ethers.getContractFactory("Stolid");
  const stolid = await Stolid.deploy();

  await stolid.deployed();

  console.log("contract deployed to:", stolid.address);

}

main();
