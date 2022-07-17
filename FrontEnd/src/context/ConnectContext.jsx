import { contractAddress } from "../constants/constant";
import React, { useEffect, useState } from "react";
import { ethers, Contract, providers } from "ethers";
import abi from "../constants/abi.json";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from "web3modal"
import * as UAuthWeb3Modal from '@uauth/web3modal'
import UAuthSPA from '@uauth/js'







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
  const [web3Modal, setWeb3Modal] = useState(null)
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("")
  
 
  const uauthOptions = {
    clientID: '68ee4d6b-dabe-48e1-a6ed-9f7b907eca13',
    redirectUri: 'https://ox-spence.vercel.app/',
    
  
    // Must include both the openid and wallet scopes.
    scope: 'openid wallet',
  }


  useEffect(() => {
   const providerOptions = {
     binancechainwallet: {
       package: true },
       'custom-uauth': {
        // The UI Assets
        display: UAuthWeb3Modal.display,
    
        // The Connector
        connector: UAuthWeb3Modal.connector,
    
        // The SPA libary
        package: UAuthSPA,
    
        // The SPA libary options
        options: uauthOptions,
      },
     walletconnect: {
       package: WalletConnectProvider,
       options: {
         infuraId: 'f310138e40fd41378ef72775877c5e7c' } }, walletlink:{ 
           package: CoinbaseWalletSDK, 
         options: {
         appName: "Boon", 
         infuraId: "f310138e40fd41378ef72775877c5e7c", 
         rpc: "", 
         chainId: 5, 
         appLogoUrl: null, 
         theme: "dark"
       }
       },
   };
   
   const newWeb3Modal = new Web3Modal({
     cacheProvider: true, // very important
     network: "ropsten",
     providerOptions,
   });

   UAuthWeb3Modal.registerWeb3Modal(newWeb3Modal)
   setWeb3Modal(newWeb3Modal)
 }, [])
 useEffect(() => {
   // connect automatically and without a popup if user is already connected
   if(web3Modal && web3Modal.cachedProvider){
     connectWallet()
   }
 }, [web3Modal])



 async function connectWallet() {
   try{
    const provider = await web3Modal.connect();
   addListeners(provider);
   const ethersProvider = new providers.Web3Provider(provider)
   const userAddress = await ethersProvider.getSigner().getAddress()
   setCurrentAccount(userAddress)
   setConnectedWallet(true)
  }catch(error){
    console.log(error)
  }
 }

 
 
 async function addListeners(web3ModalProvider) {

   web3ModalProvider.on("accountsChanged", (accounts) => {
     window.location.reload()
   });
   
   // Subscribe to chainId change
   web3ModalProvider.on("chainChanged", (chainId) => {
     window.location.reload()
   });
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