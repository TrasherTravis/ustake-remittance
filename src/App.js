import React, { useEffect, useState } from "react";
import Web3 from "web3";

const uStakingABI = require("./uStakingABI.json");
const uStakingAddress = "0xAD8E2a4D720B3DF2b317415Ec2D8118d32d2a53D";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [uStakingBalance, setUStakingBalance] = useState("");

  useEffect(() => {
    async function connectWeb3() {
      if (window.ethereum) {
        try {
          // request access to the user's MetaMask wallet
          await window.ethereum.enable();
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          // get the user's wallet address
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      }
    }
    connectWeb3();
  }, []);

  useEffect(() => {
    async function getEthBalance() {
      if (web3 && account) {
        // get the user's ETH balance
        const balance = await web3.eth.getBalance(account);
        setEthBalance(web3.utils.fromWei(balance));
      }
    }
    getEthBalance();
  }, [web3, account]);

  useEffect(() => {
    async function getUStakingBalance() {
      if (web3 && account) {
        const uStaking = new web3.eth.Contract(uStakingABI, uStakingAddress);
        // get the user's uStaking balance
        const balance = await uStaking.methods.balanceOf(account).call();
        // convert the balance to the token value without 18 decimals
        const balanceWithoutDecimals = web3.utils.fromWei(balance, 'ether');
        setUStakingBalance(balanceWithoutDecimals);
      }
    }
    getUStakingBalance();
  }, [web3, account]);

  return (
    <div>
      <h1>Wallet Address: {account}</h1>
      <h2>ETH Balance: {ethBalance}</h2>
      <h2>uStaking Balance: {uStakingBalance}</h2>
    </div>
  );
}

export default App;
