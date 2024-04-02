const hre = require("hardhat");
const { ethers, JsonRpcProvider } = require("ethers");

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    const SETUP_ADDRESS = "0xF7469b31f4D6571B7600387BF1B3478E3EFBeeFA";
    const PLAYER_ADDRESS = "0x9a9718b315692F801F3CCb6de0094f64C809d6A0";

    // > cast logs --from-block earliest --to-block latest --rpc-url "http://83.136.253.251:53760/rpc" 0x8be9391af7bcf072cee3c17fdbdfa444b42ad0d498941bcd0eb684da1ebe0d62 0x0000000000000000000000000000000000000000000000000000000000000005 > Voice5.log
    // Get the txnID from the logs
    // > cast t 0x91a5efb88ec70b9c74a7d35ebd14d9ba779574f2bd9106e1b7c38e6012b7f1db > Transaction_Details.log
    // Get the input val
    // > cast cdd "talk(bytes32)" 0x52eab0faa8087c08551ef4166232bb5a41a625150e0efb44cbf5429fce8a04c778d9ba12 > Input_Variable
    // Input Variable: 0xa8087c08551ef4166232bb5a41a625150e0efb44cbf5429fce8a04c778d9ba12

    const _answerKey = "0xa8087c08551ef4166232bb5a41a625150e0efb44cbf5429fce8a04c778d9ba12";

    // Get the contract instances
    const Setup = await hre.ethers.getContractFactory("contracts/Honor_Among_Thievs/Setup.sol:Setup");
    const setupInstance = Setup.attach(SETUP_ADDRESS);

    // Interact with the Setup contract
    const RivalsAddress = await setupInstance.TARGET();
    console.log(`Target Shop Address: ${RivalsAddress}`);

    // Assuming Creature ABI is available
    const Rivals = await hre.ethers.getContractFactory("contracts/Honor_Among_Thievs/Rivals.sol:Rivals");
    const rivalsInstance = Rivals.attach(RivalsAddress);

    await rivalsInstance.talk(_answerKey);
    console.log(`isSolved?: ${await setupInstance.isSolved(PLAYER_ADDRESS)}`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });