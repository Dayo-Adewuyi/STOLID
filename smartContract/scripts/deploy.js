const{ethers, upgrades} = require("hardhat");

async function main(){

  const Stolid = await ethers.getContractFactory("Stolid")
  console.log("Deploying Stolid contract...")
  const deployedStolid = await upgrades.deployProxy(Stolid,[],{
    initializer: "initialize",
  })
  await deployedStolid.deployed()
  
  console.log("contract deployed to:", deployedStolid.address);

}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });