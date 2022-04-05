import React, { useState, useEffect } from "react";
import Airdrop from "./components/Airdrop";
import PublicMint from "./components/PublicMint";
import Setting from "./components/Setting";

export default function MintPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [yourWalletAddress, setYourWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setIsWalletConnected(true);
        setYourWalletAddress(account);
        setError("");
        console.log("Account Connected: ", account);
      } else {
        setError("Install a MetaMask wallet to get our token.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="minting-page">
      <div
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "30px",
          fontWeight: "bold",
          marginBottom: "20px",
          marginTop: "80px",
        }}
      >
        CRYTO BABY NFT MINTING PAGE
      </div>
      <div className="mt-5 ms-5">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        {isWalletConnected && (
          <span className=" text-white">
            <span className="font-bold">Your Wallet Address: </span>
            {yourWalletAddress}
          </span>
        )}
        <button className="btn-connect ms-5" onClick={checkIfWalletIsConnected}>
          {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
        </button>
      </div>
      <Setting></Setting>
      <Airdrop></Airdrop>
      <PublicMint></PublicMint>
    </div>
  );
}
