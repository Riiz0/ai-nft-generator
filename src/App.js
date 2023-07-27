import { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage'
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import axios from 'axios';


//Components
import Footer from './components/Footer.js';
import Mint from './components/Mint.js';
import Navbar from './components/Navbar.js';

//ABIs
import NFT from './abis/NFT.json'

// Config
import config from './config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  }

  useEffect(() => {
    loadBlockchainData()
  },[])

  return (
      <div className="app-container">

        <Navbar account={account} setAccount={setAccount} />

        <div className="nav-line"></div>

        <div className="left-column"></div>

        <div className="content-container">
        <Mint />
        </div>
        
        <div className="right-column"></div>
        <div className="footer-line"></div>
        

        <Footer />

      </div>
  );
}

export default App;
