// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

// Import necessary libraries and contracts from OpenZeppelin
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


/* 
Contract definition for NFT (AI Art NFT)

-Counter to keep track of token IDs and total supply
-The cost to mint a new NFT, set by the contract creator
-Constructor function to initialize the contract
-Define the Mint event
*/
contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public cost;

    event Mint(uint256 tokenId);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        cost = _cost;
    }


/*
Function to mint a new NFT with the given URI

-Require that the sender sends enough Ether to cover the minting cost
-Increment the token ID counter
-Get the new token ID, Mint the new NFT to the sender's address
-Set the token's metadata URI (off-chain storage location)
*/
    function mint(string memory tokenURI) 
    public payable 
    {
        require(msg.value >= cost);

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit Mint(newItemId); // Emit the Mint event
    }


/*
Function to burn (destroy) an existing NFT owned by the sender

-Require that the token with the given ID exists
-Require that the sender is the owner of the token
-Burn (destroy) the NFT with the given token ID
-Decrement the token ID counter
*/
    function burn(uint256 tokenId) 
    public 
    {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner");
        super._burn(tokenId);
        _tokenIds.decrement();
    }


/*
Function to retrieve the metadata URI for a given token ID

-Call the parent contract's tokenURI function to get the metadata URI
*/
    function getTokenURI(uint256 tokenId) 
    public view 
    returns (string memory) 
    {
        return tokenURI(tokenId);
    }


/* 
Function to retrieve the total supply of minted NFTs

-Return the current count of minted NFTs
*/
    function totalSupply() 
    public view 
    returns (uint256)
    {
        return _tokenIds.current();
    }


/*
Function to allow the contract owner to withdraw the contract's balance (transaction fees)

-Require that the sender is the contract owner
-Transfer the contract's balance to the contract owner
*/
    function withdraw() public onlyOwner { // Use onlyOwner modifier from Ownable
        require(address(this).balance > 0, "Contract has no balance");
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success);
    }
}
