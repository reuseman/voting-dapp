// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SULToken is ERC20 {

    constructor(uint256 initialSupply) ERC20("Soul", "SUL") {
        _mint(msg.sender, initialSupply);
    }

    // function get_sul(address account, uint256 ether_amount) public payable {
    //     // check that sender has enough ethers
    //     // check that contract has  enough sul, otherwise mint them
    //     this.transfer(msg.value);
    //     emit(msg.value, account);
        
    //     _transfer(deployer, account, ether_amount);
    // }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    // 
	function send(address receiver, uint256 value) public
	{
        assert(value >= 0);

        _transfer(address(this), receiver, value);
        emit Transfer(address(this), receiver, value);
	}

}
