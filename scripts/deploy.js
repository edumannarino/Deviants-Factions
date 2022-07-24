const main = async () => {
    const [deployer] = await ethers.getSigners();

	const deviantsFactionsFactory = await hre.ethers.getContractFactory("DeviantsFactions");
	const deviantsFactions = await deviantsFactionsFactory.deploy();
	await deviantsFactions.deployed();
	console.log("deviantsFactions deployed to:", deviantsFactions.address);

	const deviantsFactionsNFTFactory = await hre.ethers.getContractFactory("DeviantsFactionsNFT");
	const deviantsFactionsNFT = await deviantsFactionsNFTFactory.deploy();
	await deviantsFactionsNFT.deployed();
	console.log("deviantsFactionsNFT deployed to:", deviantsFactionsNFT.address);
	
	await deviantsFactionsNFT.setMinter(deviantsFactions.address)
	await deviantsFactions.setNFTContract(deviantsFactionsNFT.address)

	console.log("Ready to operate");

};
  
const runMain = async () => {
	try {
	  await main();
	  process.exit(0);
	} catch (error) {
	  console.error(error);
	  process.exit(1);
	}
};

runMain();
