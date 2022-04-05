import React, { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import abi from "../contracts/CryptoBaby.json";

export default function Setting() {
  const contractAddress = "0x2cE1951dd9c16438C4C72F791F4E4dEE6de961F5";
  const contractABI = abi.abi;

  const [inputValue, setInputValue] = useState({
    baseUri: "ipfs://QmUR155JHJ1h8r6Wt4C5dEM61scV8gVevi42VEV2ZsJxkX/",
  });
  const [publicMintEnable, setPublicMintEnable] = useState(false);
  const handleInputChange = (event) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };
  const setBaseUri = async (event) => {
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
        const txn = await nftContract.setBaseURI(inputValue.baseUri);
        console.log("Setting base uri...");
        const receipt = await txn.wait();
        console.log("Setting completed...", txn.hash);
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const setPublicMint = async () => {
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
        const txn = await nftContract.setPublicMintEnabled(publicMintEnable);
        console.log("Setting public mint...");
        const receipt = await txn.wait();
        console.log("Setting completed...", txn.hash);
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPublicMint = async () => {
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
        const publicMintEnabled = await nftContract.isPublicMintEnabled();
        setPublicMintEnable(publicMintEnabled);
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePublicMintEnableCheckbox = () => {
    setPublicMintEnable((prev) => !prev);
  };
  useEffect(() => {
    getPublicMint();
  }, []);
  return (
    <div>
      <strong className="text-white mb-2">Settings (for only owner)</strong>
      <div className="settings">
        <div className="uri-setting">
          <span className="ms-3 text-white">Base uri:</span>
          <input
            type="text"
            className="input-double col-6"
            onChange={handleInputChange}
            name="baseUri"
            placeholder="ipfs://QmUR155JHJ1h8r6Wt4C5dEM61scV8gVevi42VEV2ZsJxkX/"
            value={inputValue.baseUri}
          />
          <button className="btn-purple" onClick={setBaseUri}>
            Set
          </button>
        </div>
        <div className="ms-3">
          <input
            type="checkbox"
            id="publicMint"
            name="publicMint"
            onChange={handlePublicMintEnableCheckbox}
            checked={publicMintEnable}
          />
          <label className="text-white ms-2" htmlFor="publicMint">
            Enable public mint
          </label>
          <button className="btn-purple" onClick={setPublicMint}>
            Set
          </button>
        </div>
      </div>
    </div>
  );
}
