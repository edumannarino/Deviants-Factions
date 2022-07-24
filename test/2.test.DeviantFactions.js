const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeviantsFactions", function () {
  let deployer, c1, deviantsFactions, deviantsFactionsNFT;
  before(async function() {
    [deployer, c1] = await ethers.getSigners();

    const deviantsFactionsFactory = await hre.ethers.getContractFactory("DeviantsFactions");
    deviantsFactions = await deviantsFactionsFactory.deploy();
    await deviantsFactions.deployed();
    console.log("deviantsFactions deployed to:", deviantsFactions.address);

    const deviantsFactionsNFTFactory = await hre.ethers.getContractFactory("DeviantsFactionsNFT");
    deviantsFactionsNFT = await deviantsFactionsNFTFactory.deploy();
    await deviantsFactionsNFT.deployed();
    console.log("deviantsFactionsNFT deployed to:", deviantsFactionsNFT.address);
  })

  it("Not Owner Cannot Set NFTContract", async function () {
    await expect(deviantsFactions.connect(c1).setNFTContract(deviantsFactionsNFT.address)).to.be.revertedWith("Ownable: caller is not the owner");
  });
  
  it("Cannot Set NFTContract to Address(0)", async function () {
    await expect(deviantsFactions.setNFTContract(ethers.utils.getAddress("0x0000000000000000000000000000000000000000"))).to.be.revertedWith("NFTContract cannot be Address 0");
  });

  it("Cannot Convert Without Stock", async function () {
     await expect(deviantsFactions.convertDenom(65)).to.be.revertedWith("Not enough NFTs");
  });

  it("Invalid Parameters Changing Stock", async function () {
    await expect(deviantsFactions.changeStock([0, 0, 0, 0, 0, 0, 0])).to.be.reverted;
  });

  it("Change Stock", async function () {
    await expect(deviantsFactions.changeStock([10, 10, 10, 10, 10, 10])).not.to.be.reverted;
    const stock = await deviantsFactions.getStock()
    expect(stock.toString()).to.be.equal("10,10,10,10,10,10");
  });
  
  it("Cannot ConvertDenom without NFTContract", async function () {
    await expect(deviantsFactions.convertDenom(65)).to.be.reverted;    
  });

  it("Valid ConvertDenom", async function () {
    await deviantsFactionsNFT.setMinter(deviantsFactions.address);
    await deviantsFactions.setNFTContract(deviantsFactionsNFT.address);
    const tx = await deviantsFactions.convertDenom(65);
    const txMined = await tx.wait();
    const event = txMined.events[txMined.events.length-1].args.result;
    expect(event.toString()).to.be.equal("50,10,5");    
  });  
  
  it("Valid ChangeStock after ConvertDenom", async function () {
    const stock = await deviantsFactions.getStock();
    expect(stock.toString()).to.be.equal("10,9,10,9,9,10");
  });  

  it("Valid NFT 1", async function () {
    expect(await deviantsFactionsNFT.ownerOf(1)).to.be.equal(deployer.address);
    expect(await deviantsFactionsNFT.values(1)).to.be.equal(50);
  });

  it("Valid NFT 2", async function () {
    expect(await deviantsFactionsNFT.ownerOf(2)).to.be.equal(deployer.address);
    expect(await deviantsFactionsNFT.values(2)).to.be.equal(10);
  });

  it("Valid NFT 3", async function () {
    expect(await deviantsFactionsNFT.ownerOf(3)).to.be.equal(deployer.address);
    expect(await deviantsFactionsNFT.values(3)).to.be.equal(5);
  });

});
