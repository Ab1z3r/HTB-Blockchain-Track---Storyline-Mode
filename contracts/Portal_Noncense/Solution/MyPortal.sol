// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyPortal {
    mapping(string => address) public destinations;
    mapping(string => bool) public isPortalActive;
    bool isExpertStandby;

    function connect() public returns(bool) {
        isPortalActive["orcKingdom"] = true;
        return true;
    }
}