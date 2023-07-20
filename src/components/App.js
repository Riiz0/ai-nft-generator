import { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage'
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import axios from 'axios';
import logo from '../assets/logo.svg';
import '../App.css';
import Footer from './Footer.js';
import Mint from './Mint.js';
import Navbar from './Navbar.js';

function App() {
  return (

  // <div>
  //   <Navbar />

  //   <Mint />

  //   <Footer />
  // </div>
    <div className="App">
    
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
