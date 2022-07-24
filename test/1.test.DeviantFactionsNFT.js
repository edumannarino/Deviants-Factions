const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeviantsFactionsNFT", function () {
  let deployer, c1, deviantsFactionsNFT;
  before(async function() {
    [deployer, c1] = await ethers.getSigners();

    const deviantsFactionsNFTFactory = await hre.ethers.getContractFactory("DeviantsFactionsNFT");
    deviantsFactionsNFT = await deviantsFactionsNFTFactory.deploy();
    await deviantsFactionsNFT.deployed();
    console.log("deviantsFactionsNFT deployed to:", deviantsFactionsNFT.address);

  })

  it("Not Owner Cannot Set Minter", async function () {
    await expect(deviantsFactionsNFT.connect(c1).setMinter(deployer.address)).to.be.revertedWith("Ownable: caller is not the owner");
  });
  
  it("Cannot Set Minter to Address(0)", async function () {
    await expect(deviantsFactionsNFT.setMinter(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"))).to.be.revertedWith("Minter cannot be Address 0");
  });
   
  it("Not Minter Cannot Mint", async function () {
    await expect(deviantsFactionsNFT.mint(deployer.address, 100)).to.be.revertedWith("msg.sender not Minter");
  });

  it("Cannot Mint to Address(0)", async function () {
    await deviantsFactionsNFT.setMinter(deployer.address);
    await expect(deviantsFactionsNFT.mint(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"), 100)).to.be.revertedWith("Can not mint to Address 0");
  });

  it("Cannot Mint Invalid Value", async function () {
    await expect(deviantsFactionsNFT.mint(deployer.address, 2)).to.be.revertedWith("Invalid Value");
  });

  it("Mint Valid Values", async function () {
    await expect(deviantsFactionsNFT.mint(deployer.address, 1)).not.to.be.reverted;
    await expect(deviantsFactionsNFT.mint(deployer.address, 5)).not.to.be.reverted;
    await expect(deviantsFactionsNFT.mint(deployer.address, 10)).not.to.be.reverted;
    await expect(deviantsFactionsNFT.mint(deployer.address, 20)).not.to.be.reverted;
    await expect(deviantsFactionsNFT.mint(deployer.address, 50)).not.to.be.reverted;
    await expect(deviantsFactionsNFT.mint(deployer.address, 100)).not.to.be.reverted;
  });
  
  it("Valid Count", async function () {
    // count is the next TokenID to assign, so to verify the total mint must 
    // compare to (total - 1)
    expect(await deviantsFactionsNFT.count()).to.be.equal(6+1);
  });
  
  it("Valid NFT 1", async function () {
    expect(await deviantsFactionsNFT.ownerOf(1)).to.be.equal(deployer.address);
    expect(await deviantsFactionsNFT.values(1)).to.be.equal(1);
  });

  it("Valid NFT 2", async function () {
    expect(await deviantsFactionsNFT.ownerOf(2)).to.be.equal(deployer.address);
    expect(await deviantsFactionsNFT.values(2)).to.be.equal(5);
  });

  it("Valid NFT 3", async function () {
    expect(await deviantsFactionsNFT.ownerOf(3)).to.be.equal(deployer.address);
    expect(await deviantsFactionsNFT.values(3)).to.be.equal(10);
  });

  it("Valid NFT 4", async function () {
    expect(await deviantsFactionsNFT.ownerOf(4)).to.be.equal(deployer.address);
    expect(await deviantsFactionsNFT.values(4)).to.be.equal(20);
  });

  it("Valid NFT 5", async function () {
    expect(await deviantsFactionsNFT.ownerOf(5)).to.be.equal(deployer.address);
    expect(await deviantsFactionsNFT.values(5)).to.be.equal(50);
  });

  it("Valid NFT 6", async function () {
    expect(await deviantsFactionsNFT.ownerOf(6)).to.be.equal(deployer.address);
    expect(await deviantsFactionsNFT.values(6)).to.be.equal(100);
  });

});
