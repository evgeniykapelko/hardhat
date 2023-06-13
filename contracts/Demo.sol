// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./ILogger.sol";

contract Demo {
    ILogger logger;

    constructor(address _logger) {
        logger = ILogger(_logger);
    } 

    function payment(address _from, uint _number) public view returns(uint) {
        return logger.getEntry(_from, _number);
    }
    
    receive() external payable {
        logger.log(msg.sender, msg.value);
    }
}