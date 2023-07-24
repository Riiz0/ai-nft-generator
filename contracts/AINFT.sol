// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AINFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    uint256 public cost;

    constructor() ERC721("AINFT", "ANFT") {}

    function mint(string memory tokenURI) 
    public payable
    {
        require(msg.value >= cost);

        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
    }

    function burn(uint256 newTokenId) 
    public
    {
        require(_exists(newTokenId), "Token does not exist");
        require(ownerOf(newTokenId) == msg.sender, "You are not the owner of this token");
    
        _burn(newTokenId);
    }

    function tokenURI(uint256 newTokenId) 
    public view override (ERC721, ERC721URIStorage)
    returns(string memory)
    {
        return super.tokenURI(newTokenId);
    }

    function totalSupply() public view returns (uint256){
        return _tokenIds.current();
    }

    function withdraw() public {
        require(msg.sender == );

    }
}