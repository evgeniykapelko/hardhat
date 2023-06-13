// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface ILogger {
    
    function log(address _from, uint _amount) external;

    function getEntry(address _from, uint _index) external view returns(uint);

}