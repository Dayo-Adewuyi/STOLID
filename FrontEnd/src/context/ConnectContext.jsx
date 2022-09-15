import { contractAddress } from "../constants/constant";
import React, { useEffect, useState } from "react";
import { ethers, Contract, providers } from "ethers";
import abi from "../constants/abi.json";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';






export const ConnectContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const stolidContract = new ethers.Contract(contractAddress, abi.abi, signer);
 
  return stolidContract;
};

const fetchClosedCases = async() => {
  const contract = createEthereumContract();
  
 try {
   const result =await contract.closedCases();
  
  return result
  }
 catch(error){
   console.log(error)
 
 }
}



export const ConnectProvider = ({ children }) =>{
 
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("")
  const [provider, setProvider] = useState();
  const [chainId, setChainId] = useState()
  const [error, setError] = useState("")
  
 
 

 const getProvider = () => {
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: "STOLID",
    appLogoUrl: "https://unsplash.com/photos/CILlSJfgmVI"
  });
  return coinbaseWallet.makeWeb3Provider();
 }

 const connectWallet = async () => {
  try {
    const provider = getProvider();
    setProvider(provider);
    // Get accounts for connected wallet
    const accounts = await provider.request({
      method: "eth_requestAccounts"
    });
    if (accounts) {
      setCurrentAccount(accounts[0]);
      setConnectedWallet(true)
    }
    // Get current chain ID for connected wallet
    const chainId = await provider.request({
      method: "eth_chainId"
    });
    setChainId(Number(chainId));
  } catch (error) {
    setError(error);
  }
}




  
    

    
    return (
      <ConnectContext.Provider
        value={{
          
          
          connectWallet,
          
          fetchClosedCases,
          
          currentAccount
          
        }}
      >
        {children}
      </ConnectContext.Provider>
    );
  };