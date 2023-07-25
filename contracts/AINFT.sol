// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

// Import necessary libraries and contracts from OpenZeppelin
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


/* 
Contract definition for AINFT (AI Art NFT)

-Counter to keep track of token IDs and total supply
-The cost to mint a new NFT, set by the contract creator
-Constructor function to initialize the contract
*/
contract AINFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint256 public cost;

    constructor() ERC721("AINFT", "ANFT") {}


/*
Function to mint a new NFT with the given URI

-Require that the sender sends enough Ether to cover the minting cost
-Increment the token ID counter
-Get the new token ID, Mint the new NFT to the sender's address
-Set the token's metadata URI (off-chain storage location)
*/
    function mint(string memory uri) 
    public payable
    {
        require(msg.value >= cost);

        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);
    }


/*
Function to burn (destroy) an existing NFT owned by the sender

-Require that the token with the given ID exists
-Require that the sender is the owner of the token
-Burn (destroy) the NFT with the given token ID
*/
    function burn(uint256 newTokenId) 
    public
    {
        require(_exists(newTokenId), "Token does not exist");
        require(ownerOf(newTokenId) == msg.sender, "You are not the owner of this token");
        _burn(newTokenId);
    }


/*
Function to retrieve the metadata URI for a given token ID

-Call the parent contract's tokenURI function to get the metadata URI
*/
    function tokenURI(uint256 newTokenId) 
    public view override (ERC721URIStorage)
    returns(string memory)
    {
        return super.tokenURI(newTokenId);
    }


/* 
Function to retrieve the total supply of minted NFTs

-Return the current count of minted NFTs
*/
    function totalSupply() public view returns (uint256){
        return _tokenIds.current();
    }


/*
Function to allow the contract owner to withdraw the contract's balance (transaction fees)

-Require that the sender is the contract owner
-Transfer the contract's balance to the contract owner
*/
    function withdraw() public {
        require(msg.sender == owner(), "Only the contract owner can withdraw");
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}