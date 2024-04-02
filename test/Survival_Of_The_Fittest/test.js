const hre = require("hardhat");
const { ethers, JsonRpcProvider } = require("ethers");

async function main() {

    //const rpcEndpoint = "http://94.237.63.93:30077/rpc";

    // Use the RPC endpoint to connect to the Ethereum network
    //const a = hre.ethers.providers.JsonRpcProvider(rpcEndpoint);
    //console.log(a);
    //const provider = new JsonRpcProvider(rpcEndpoint);

    const [deployer] = await hre.ethers.getSigners();

    const privateKey = "0xea3af69d600107446130636d2074dc3ed0fdd6585b6bd4d1a36f15f2864eb9a9";
    const address = "0x7722CabD5FEfaA746dB55FDFA91ccCeFDF8573dA";
    //const targetAddress = "0xedAB1c6af0f575396cd949245fbCe774b613f1a4";
    const SETUP_ADDRESS = "0x456640D7b08fB0fA370E234C67DF4e25c9c5A4e5";

   
    // Get the contract instances
    const Setup = await hre.ethers.getContractFactory("Setup");
    const setupInstance = Setup.attach(SETUP_ADDRESS);

    // Interact with the Setup contract
    const targetAddress = await setupInstance.TARGET();
    console.log(`Target Creature Address: ${targetAddress}`);

    // Assuming Creature ABI is available
    const Creature = await hre.ethers.getContractFactory("Creature");
    const creatureInstance = Creature.attach(targetAddress);

    // Deal damage and loot
    console.log(await creatureInstance.lifePoints());
    await creatureInstance.strongAttack(20);
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