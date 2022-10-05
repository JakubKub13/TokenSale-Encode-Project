//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMyERC20Token is IERC20 {
    function mint(address to, uint256 amount) external;
}

contract TokenSale {
    /// @notice Purchase Ratio between Sale ERC20 and Ether
    uint256 public erc20Purchaseratio;
    IMyERC20Token public paymentToken;

    constructor(uint256 _ratio, address _paymentToken) {
        erc20Purchaseratio = _ratio;
        paymentToken = IMyERC20Token(_paymentToken);
    }

    function purchaseTokens() public payable {
        uint256 etherReceived = msg.value;
        uint256 tokensToBeEarned = etherReceived / erc20Purchaseratio;
        paymentToken.mint(msg.sender, tokensToBeEarned);
    }
}