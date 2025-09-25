// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ZenNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Zenchain NFT", "ZENFT") {}

    // Public mint function: caller pays gas and becomes owner of the token
    function mint(string memory uri) public returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    // Optional: view total minted
    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
