const { expect } = require("chai");
const { ethers } = require("hardhat");

let contract, fileDrive;

describe("Stolid", function(){
    it("should deploy the Stolid contract to the testnet", async function(){
        //Get Contract from Contract Factory
        const STOLID = await ethers.getContractFactory("Stolid");

        // here we deploy the contract
       const stolid = await upgrades.deployProxy(STOLID, [], {
   initializer: "initialize",
 });
    
        // Wait for it to finish deploying
        contract = await stolid.deployed();
    
//         print the address of the deployed contract
        console.log(
            "\n 🏵 STOLID Contract Address:",
            deployedNestDriveContract.address
        );

      });
});

describe("Upload Files", function(){
    it("should be able to upload a public file to the contract", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
        //Upload File 
        uploadFile = await contract.connect(owner).createCase(
            "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        );
        // Expect the function to go through
        const txResult = await uploadFile.wait();
        expect(txResult.status).to.equal(1);

    });

    it("should  be able to upload an active file", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
         //Upload File 
        uploadFile = await contract.connect(owner).createCase(
             
            "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
           
        );
        
        // Expect the function to go through
        const txResult = await uploadFile.wait();
        expect(txResult.status).to.equal(1);
        
    })

    it("should not be able to upload a file to contract since length of hash is 0", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
        // Expect the function not to go through 
        await expect(contract.connect(owner).createCase(
          "DAYO VS LAGOS STATE",
            "",
            "500kb",
             secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        )).to.be.reverted;
        
    })
    it("should not be able to upload a file to contract since length of case ID is 0", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
        await expect(contract.connect(owner).createCase(
            "",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        )).to.be.reverted;
        
    })

    it("should not be able to upload a file to contract since address of judge not provided", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
        await expect(contract.connect(owner).createCase(
           "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        )).to.be.reverted;
        
    })

    it("should not be able to upload a file to contract if address of clerk is empty", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
        await expect(contract.connect(owner).createCase(
           "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        )).to.be.reverted;
    })

    it("should not be able to upload a file to contract since length of exhibit is 0", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
        await expect(contract.connect(owner).createCase(
            "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          [""]
        )).to.be.reverted;
    })

 

    it("should not be able to upload a file if contract is paused", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
        await contract.connect(owner).pause();
        await expect(contract.connect(owner).createCase(
            "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        )).to.be.reverted;
    })

   

describe("Fetch Closed Files", function(){
    it("Should be able to fetch public files", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
            newfile =await contract.connect(owner).createCase(
           "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        );
        newfile1=await contract.connect(secondAccount).createCase(
            "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        );
        newfile2=await contract.connect(thirdAccount).createCase(
            "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        );
        const closeCases = await contract.connect.closedCases();
        expect(closeCases.length).to.be.equal(3);
    });

    it("Can't get closed cases when contract is Paused", async function(){
        const [ owner, secondAccount, thirdAccount] = await ethers.getSigners();
        await contract.connect(owner).createCase(
            "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        );
        await contract.connect(secondAccount).createCase(
            "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        );
        await contract.connect(thirdAccount).createCase(
            "DAYO VS LAGOS STATE",
            "QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb",
            secondAccount,
            thirdAccount,
          ["QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb","QmZxQhLnHgHj3UZjnsZTLQC3Q7UCJAU7iN7htU6q9NNwnb"]
        );
        await contract.connect(owner).pause();
        await expect(contract.connect(secondAccount).fetchPublicFiles()).to.be.reverted;
    });

    
