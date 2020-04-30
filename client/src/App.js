import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import { ethers } from "ethers";

const App = () => {
  const [contract, setContract] = useState("");
  const [activeAddress, setActiveAddress] = useState(0);
  const [balance, setBalance] = useState(0);
  const [storageValue, setStorageValue] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Using local network
        // let url = "http://localhost:8545";
        // let provider = new ethers.providers.JsonRpcProvider(url);

        // Using test network (e.g. Rinkeby)
        let provider = ethers.getDefaultProvider("rinkeby");

        let privateKey = process.env.REACT_APP_PRIVATE_KEY;
        let walletWithProvider = new ethers.Wallet(privateKey, provider);

        // Active Address
        let activeAddress = walletWithProvider.address;
        setActiveAddress(activeAddress);

        // Balance
        let balance = await provider.getBalance(activeAddress);
        setBalance(ethers.utils.formatEther(balance));

        let contractAddress = process.env.REACT_APP_INSTANCE_ADDRESS;
        let instance = new ethers.Contract(
          contractAddress,
          SimpleStorageContract.abi,
          walletWithProvider
        );
        setContract(instance);

        let value = await instance.functions._value();
        setStorageValue(value);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    contract.functions.setValue(newValue);
    // send({ from: accounts[0] });
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
      <p>{storageValue}</p>
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
    </div>
  );
};

export default App;
