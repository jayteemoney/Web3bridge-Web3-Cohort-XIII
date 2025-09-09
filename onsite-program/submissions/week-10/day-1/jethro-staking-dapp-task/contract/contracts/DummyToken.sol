// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyToken is ERC20 {
    constructor() ERC20("Dummy Token", "DMT") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}