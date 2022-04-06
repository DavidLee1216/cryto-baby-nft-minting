import React, { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import abi from "../contracts/CryptoBaby.json";
import "./components.css";

export default function Withdraw() {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const [balance, setBalance] = useState(0);
  const [isWithdrawed, setIsWithdrawed] = useState(false);
  const contractABI = abi.abi;
  const withdraw = async (event) => {
    event.preventDefault();

    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let tokenOwner = await nftContract.owner();
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (tokenOwner.toLowerCase() !== account.toLowerCase()) {
          alert("Only token owner can use this functionality.");
          return;
        }
        const txn = await nftContract.withdraw();
        const receipt = await txn.wait();
        setIsWithdrawed(true);
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getBalance = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let tokenOwner = await nftContract.owner();
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (tokenOwner.toLowerCase() !== account.toLowerCase()) {
          return;
        }
        let balance = await nftContract.getBalance();
        balance = utils.formatEther(balance);
        setBalance(balance);
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalance();
    setInterval(() => {
      getBalance();
    }, 1000);
  }, []);

  return (
    <div className="mt-5 mb-5">
      <strong className="text-white mb-2">Withdraw (only for owner)</strong>
      <form className="form-style withdraw">
        <span className="ms-3 text-white">Balance:</span>
        <span className="ms-3 text-white">{balance}</span>
        <button className="btn-purple" onClick={withdraw}>
          Withdraw
        </button>
      </form>
      <div className="mt-5">footer</div>
    </div>
  );
}
