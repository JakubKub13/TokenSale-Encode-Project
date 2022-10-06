//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMyERC20Token is IERC20 {
    function mint(address to, uint256 amount) external;
    function burnFrom(address from, uint256 amount) external;
}

contract TokenSale {
    /// @notice Purchase Ratio between Sale ERC20 and Ether
    uint256 public erc20Purchaseratio;
    uint256 public tokenPrice;
    IMyERC20Token public paymentToken;

    constructor(uint256 _ratio, uint256 _tokenPrice, address _paymentToken) {
        erc20Purchaseratio = _ratio;
        tokenPrice = _tokenPrice;
        paymentToken = IMyERC20Token(_paymentToken);
    }

    function purchaseTokens() public payable {
        uint256 etherReceived = msg.value;
        uint256 tokensToBeEarned = etherReceived / erc20Purchaseratio;
        paymentToken.mint(msg.sender, tokensToBeEarned);
    }

    function burnTokens(uint256 amount) public {
        paymentToken.burnFrom(msg.sender, amount);
        uint256 ethToBeReturned = amount / erc20Purchaseratio;
        payable(msg.sender).transfer(ethToBeReturned);
    }

    function purchaseNFT() public {
        paymentToken.transferFrom(msg.sender, address(this), tokenPrice);
    }
}