pragma solidity ^0.5.0;

contract Test {
    address public owner;
    string public message;

    constructor() public {
        owner = msg.sender;
        message = "I'm a message inside a bottle.";
    }

    function setMessage(string memory _message) public returns (bool){
        message = _message;
        return true;
    }
}