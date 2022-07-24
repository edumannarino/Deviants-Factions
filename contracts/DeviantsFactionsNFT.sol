//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";


/// @title NFT Smart Contract for Deviants' Factions challenge.
/// @author Eduardo Mannarino
///  @notice Implements an ERC721 standard to represent each bill
contract DeviantsFactionsNFT is ERC721Enumerable, Ownable {

    ///  @notice Event trigger on NFT mint.
    event Mint(address indexed to, uint256 indexed tokenId, uint32 value);

    mapping(uint32 => uint32) public values;
    address public minter;
    uint32 public count = 1;
    
    constructor() ERC721("DeviantsFactions", "DFNFT") {
    }

    ///  @notice Modifier that allows minting only to the minter address
    modifier onlyMinter() {
        require(msg.sender == minter, "msg.sender not Minter");
        _;
    }    

    /// @notice Mints the NFT.
    /// @param to Address owner of the NFT to mint.
    /// @param value Represent the bill denomination.
    function mint(address to, uint32 value) external onlyMinter {
        require(to != address(0), "Can not mint to Address 0");
        require(value == 1 || 
                value == 5 ||
                value == 10 ||
                value == 20 ||
                value == 50 ||
                value == 100, "Invalid Value");

        values[count] = value;
        _safeMint(to, count);
        emit Mint(msg.sender, count, value);
        count++;
    }

    /// @notice Set the minter address.
    /// @param _minter The address of the minter.
    function setMinter(address _minter) external onlyOwner {
        require(_minter != address(0), "Minter cannot be Address 0");
        minter = _minter;
    }
}