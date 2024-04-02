// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface ICreature{
    function attack(uint256 _damage) external;
}

contract AttackContract {
    ICreature public _creature;

    constructor(address creature) {
        _creature = ICreature(creature);
    }

    function attack() external {
        _creature.attack(1000);
    }
}
