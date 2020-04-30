pragma solidity >=0.4.21 <0.7.0;


contract SimpleStorage {
    event ValueChanged(string oldValue, string newValue);

    string public _value;

    constructor() public {
        _value = "Hello Ether.js";
    }

    function setValue(string memory value) public {
        _value = value;
        emit ValueChanged(_value, value);
    }
}
