//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

/// @title Smart Contract for Deviants' Factions challenge.
/// @author Eduardo Mannarino
/**  @notice Implements a function (convertDenom) that returns the minimum 
            amount of specific denomination bills to represent a
            positive number. There's a stock to check.
            Also mints an NFT for every bills that is returned.
*/


/// @notice Interface of NFT Contract defining minting function
interface IDeviantsFactionsNFT {
    function mint(address to, uint32 value) external;
}

contract DeviantsFactions is Ownable {

    /// @notice Event to return the result of convertDenom function.
    event denomConverted(uint32[] result);

    uint8[] public denominations = new uint8[](6);
    uint32[] public stock = new uint32[](6);

    address public NFTContract;

    constructor() {
        denominations = [100, 50, 20, 10, 5, 1];
        stock = [0, 0, 0, 0, 0, 0];
    }

    /// @notice Function to resolve SC objetive.
    /// @param amount The amount to be represented in bills.
    function convertDenom(uint32 amount) external {
        uint32[] memory tempResult = new uint32[](amount);
        uint32 count = 0;
        for (uint8 i=0; i < denominations.length; i++) {
            if (amount == 0)
                break;
            uint32 quantity = amount / denominations[i];
            if (quantity > stock[i])
                quantity = stock[i];
            stock[i] -= quantity;
            for (uint8 j=1; j <= quantity; j++) {
                tempResult[count] = denominations[i];
                count++;
                IDeviantsFactionsNFT(NFTContract).mint(msg.sender, denominations[i]);
            }
            amount -= quantity * denominations[i];
        }
        require(amount == 0, "Not enough NFTs"); 
        uint32[] memory result = new uint32[](count);
        for (uint8 i=0; i < count; i++) 
            result[i] = tempResult[i];
        emit denomConverted(result);
    }

    /// @notice Function to change the current Stock.
    /// @param newStock Array representing the new stock.
    /// @dev Updates the entire Array of stock. Can not update individual stock.
    function changeStock(uint32[6] memory newStock) external onlyOwner {
        require(newStock.length == stock.length, "newStock length must be equal to stock length");
        for (uint8 i=0; i < newStock.length; i++) {
            stock[i] = newStock[i];
        }
    }

    /// @notice Function to return the entire Array of Stock.
    function getStock() external view returns(uint32[] memory) {
        return stock;
    }

    /// @notice Function to change the minter of the NFTs.
    /// @param _NFTContract Address of the minter.
    function setNFTContract(address _NFTContract) external onlyOwner {
        require(_NFTContract != address(0), "NFTContract cannot be Address 0");
        NFTContract = _NFTContract;
    }

}