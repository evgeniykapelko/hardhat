// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Payments {
    struct Payment {
        uint amount;
        uint timestamp;
        address from;
        string message;
    }

    struct Balance {
        uint totalPayments;
        mapping(uint => Payment) payments;
    }

    mapping(address => Balance) public balances;

    function currentBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    function getPayment(address _addr, uint _index) public view returns(Payment memory) {
        return balances[_addr].payments[_index];
    }

    function pay(string memory message) public payable {
        uint paymentNumber = balances[msg.sender].totalPayments;

        balances[msg.sender].totalPayments++;

        Payment memory newPayment = Payment(
            msg.value,
            block.timestamp,
            msg.sender,
            message
        );

        balances[msg.sender].payments[paymentNumber] = newPayment;
    }

    //Byte
    bytes1 public myVar;
    bytes32 public byteCodeString = "Hey!";

    uint[10] public items = [1, 2, 3];
    uint[] public itemsDynamicLength;
    uint public len;

    function workWithArrayDynamicLength() public {
        itemsDynamicLength.push(1);
        itemsDynamicLength.push(2);
        len  = items.length;
    }

    function demo() public {
        items[0] = 100;
    }

    enum Status { Paid, Delivered, Received }
    Status public currentStatus;

    function pay() public {
        currentStatus = Status.Paid;
    }

    function delivered() public {
        currentStatus = Status.Delivered;
    }

    function sampleMemory() public pure returns (uint[] memory) {
        uint[] memory tmpArray = new uint[](10);

        tmpArray[0] = 1;

        return tmpArray;
    }
}