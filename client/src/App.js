import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import { ethers } from "ethers";

const App = () => {
  const [activeAddress, setActiveAddress] = useState(0);
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState("");
  const [storageValue, setStorageValue] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(
          window.web3.currentProvider
        );
        const wallet = provider.getSigner();

        const activeAddress = await wallet.getAddress();
        setActiveAddress(activeAddress);

        const balance = await wallet.getBalance();
        setBalance(ethers.utils.formatEther(balance));

        const currentNetwork = window.ethereum.networkVersion;
        const contractAddress =
          SimpleStorageContract.networks[currentNetwork].address;

        const instance = new ethers.Contract(
          contractAddress,
          SimpleStorageContract.abi,
          wallet
        );
        setContract(instance);
        getCount(instance);
      } catch {
        alert("Have you deployed the contracts? Are you on Rinkeby?");
      }
    })();
  }, []);

  window.ethereum.on("accountsChanged", (accounts) => {
    console.log("accounts:", accounts);
  });

  const getCount = async (contract) => {
    let value = await contract.functions._value();
    setStorageValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tx = await contract.functions.setValue(newValue);
    console.log("tx:", tx);
    await tx.wait();
    getCount(contract);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Good to Go!</h1>
      <h3>
        <u>Active Address</u>
      </h3>
      <p>{activeAddress}</p>
      <h3>
        <u>Current ETH Balance</u>
      </h3>
      <p>{balance}</p>
      <h3>
        <u>Stored Value</u>
      </h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="changeValue"></label>
        <input
          type="text"
          value={newValue}
          placeholder="Set Value"
          onChange={(e) => setNewValue(e.target.value)}
        />
        <button button="submit" disabled={newValue === ""}>
          Change
        </button>
      </form>
      <p>{storageValue}</p>
    </div>
  );
};

export default App;
