import { ethers } from 'ethers';

const Navbar = ({ account, setAccount }) => {
    const connectHandler = async() => {
        const accounts = await window.ethereum.request({ method: 'eth_request' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

    return (
        <nav>
            <div className='nav__brand'>
                <h1>AI NFT Generator</h1>
            </div>
        </nav>
    );
}

export default Navbar;