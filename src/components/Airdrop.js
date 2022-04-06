import React, { useState } from "react";
import { ethers, utils } from "ethers";
import abi from "../contracts/CryptoBaby.json";
import "./components.css";

export default function Airdrop() {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const [inputValue, setInputValue] = useState({
    walletAddress: "",
    airdropId: "",
  });
  const contractABI = abi.abi;

  const handleInputChange = (event) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const airdrop = async (event) => {
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
          alert("Only token owner can mint.");
          return;
        }
        const txn = await nftContract.mint(
          inputValue.walletAddressToMint,
          utils.parseEther(inputValue.mintAmount)
        );
        console.log("Minting tokens...");
        const receipt = await txn.wait();
        console.log("Tokens minted...", txn.hash);
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mt-5">
        <strong className="text-white mb-2">Airdrop (only for owner)</strong>
        <form className="form-style airdrop">
          <input
            type="text"
            className="input-double col-6"
            onChange={handleInputChange}
            name="walletAddress"
            placeholder="Wallet Address"
            value={inputValue.walletAddress}
          />
          <input
            type="text"
            className="input-double col-2"
            onChange={handleInputChange}
            name="airdropId"
            placeholder="token id(ex:12)"
            value={inputValue.airdropId}
          />
          <button className="btn-purple" onClick={airdrop}>
            Airdrop
          </button>
        </form>
      </div>
    </div>
  );
}
