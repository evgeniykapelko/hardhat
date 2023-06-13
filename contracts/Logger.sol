// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ILogger.sol";

/**
 * @title 
 * @author 
 * @notice 
 */
contract Logger is ILogger {
    mapping(address => uint[]) payments;

    function log(address _from, uint _amount) public {
        require(_from != address(0), "It's zero address");

        payments[_from].push(_amount);
    }

    function getEntry(address _from, uint _index) public view returns(uint) {
        return payments[_from][_index];
    }
}