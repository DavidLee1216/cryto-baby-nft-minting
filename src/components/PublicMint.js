import React, { useState } from "react";
import { ethers, utils } from "ethers";
import abi from "../contracts/CryptoBaby.json";
import "./components.css";

export default function PublicMint() {
  const contractAddress = "0xeeF34a63747AfBF0AF2295CFEc3A7d1520C0b5cc";
  const [inputValue, setInputValue] = useState({
    mintCount: 0,
    etherToPay: 0.05,
  });
  const contractABI = abi.abi;

  const handleInputChange = (event) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };
  const mint = async (event) => {
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
        const txn = await nftContract.publicMint(inputValue.mintCount, {
          value: ethers.utils.parseEther(inputValue.etherToPay),
        });
        console.log("Minting tokens...");
        const receipt = await txn.wait();
        console.log("Tokens minted...", txn.hash);

        // let tokenSupply = await tokenContract.totalSupply();
        // tokenSupply = utils.formatEther(tokenSupply);
        // setTokenTotalSupply(tokenSupply);
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mt-5 mb-9">
        <strong className="text-white mb-2">
          Public Mint (0.05 ether for one item)
        </strong>
        <form className="form-style public-mint">
          <span className="ms-3 text-white">Count to mint:</span>
          <input
            type="text"
            className="input-double col-2"
            onChange={handleInputChange}
            name="mintCount"
            placeholder="1"
            value={inputValue.mintCount}
          />
          <span className="ms-3 text-white">Ether to pay:</span>
          <input
            type="text"
            className="input-double col-2"
            onChange={handleInputChange}
            name="etherToPay"
            placeholder="1"
            value={inputValue.etherToPay}
          />
          <button className="btn-purple" onClick={mint}>
            Mint
          </button>
        </form>
      </div>
    </div>
  );
}
