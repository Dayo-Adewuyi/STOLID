const { ethers, upgrades } = require("hardhat");


async function main() {
 const STOLID = await ethers.getContractFactory("Stolid");

 

 const stolid = await upgrades.deployProxy(STOLID, [], {
   initializer: "initialize",
 });
 await stolid.deployed();

 console.log("Pizza deployed to:", stolid.address);
}

main();
