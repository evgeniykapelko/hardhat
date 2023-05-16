// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Modifiers 
{
    // require
    // revert
    // assert

    address owner;
    
    // How many fields can be to mark as indexed ?
    event Paid(address indexed _from, uint _amount, uint _timestamp);

    constructor () {
        owner = msg.sender;
    }

    receive() external payable {
        pay();
    }

    function pay() public payable {
        emit Paid(msg.sender, msg.value, block.timestamp);
    }

    modifier onlyOwner(address _to) {
        require(msg.sender != owner, "You are not an owner!");
        require(_to != address(0), "Incorrect address!");
        _;

        // require(...)  - When after condition will be execute ?
    }

    function withdraw(address payable _to) external onlyOwner(_to) {
        // Panic
        // assert(msg.sender != owner);

        // Error
        // require(msg.sender == owner, "You are not an owner!");
        // if(msg.sender != owner) {
        //     revert("You are not an owner!");
        // } else {}    
        
        _to.transfer(address(this).balance);
    }
}