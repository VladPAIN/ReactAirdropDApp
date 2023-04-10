import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import Factory from './contracts/MyNFT.json';
import TokenAirdrop from './contracts/airdrop.json';
import "./App.css";

const CONTRACT_ADDRESS = '0xbfDfa1AC5dDA6364bc93EA16837B43215D30d84C';
const TOKEN_AIRDROP_CONTRACT_ADDRESS = '0x7988de14c33A482b045639dfea419CF0F8951Af4';

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractAirdrop, setContractAirdrop] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [airdropRecipients, setAirdropRecipients] = useState('');
  const [airdropAmount, setAirdropAmount] = useState('');
  const [tokenAddress, settokenAddress] = useState('');

  useEffect(() => {
    const initWeb3Modal = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      setProvider(provider);
      setUserAddress(await provider.getSigner().getAddress());
      setContract(new ethers.Contract(CONTRACT_ADDRESS, Factory.abi, provider.getSigner()));
      setContractAirdrop(new ethers.Contract(TOKEN_AIRDROP_CONTRACT_ADDRESS, TokenAirdrop.abi, provider.getSigner()));
    };
    initWeb3Modal();
  }, []);

  const deployToken = async () => {
    await contract.deployToken(tokenName, tokenSymbol, tokenSupply);
  };

  const getUserToken = async () => {
    const userTokenAddress = await contract.getUserToken();
    document.getElementById("result").innerText = userTokenAddress;
  };

  const sendAirdrop = async () => {
    if (!contract) return;
    const recipientsArray = airdropRecipients.split(',').map(address => address.trim());
    await contractAirdrop.airdrop(tokenAddress, recipientsArray, ethers.utils.parseEther(airdropAmount));
  };

  return (
    <div className="container">
      <div className="grid">
        <div className="col">
          <h1>Token Factory</h1>
          <form onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Token Name"
              onChange={e => setTokenName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Token Symbol"
              onChange={e => setTokenSymbol(e.target.value)}
            />
            <input
              type="text"
              placeholder="Token Supply"
              onChange={e => setTokenSupply(e.target.value)}
            />
            <button onClick={deployToken}>Deploy Token</button>
            <button onClick={getUserToken}>Get User Token</button>
            <strong>
              <p>Token address: <span id="result"> </span></p>
            </strong>
          </form>
        </div>
        <div className="col">
          <h1>Token Airdrop</h1>
          <form onSubmit={e => e.preventDefault()}>
            <p>Send tokens on contract for airdrop</p>
            <strong>
              <p>Contract address: 0x7988de14c33A482b045639dfea419CF0F8951Af4</p>
            </strong>
            <input
              type="text"
              placeholder="Token address"
              onChange={e => settokenAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Recipients (comma separated)"
              onChange={e => setAirdropRecipients(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount per one"
              onChange={e => setAirdropAmount(e.target.value)}
            />
            <button onClick={sendAirdrop}>Send Airdrop</button>
          </form>
        </div>
      </div>
    </div >
  );
}

export default App;