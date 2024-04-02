// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
//pragma solidity ^0.7.0;


contract Attack {

        function getContractAddress(address setup_address) public pure returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xd6), bytes1(0x94), setup_address, bytes1(0x01))))));
    }

}