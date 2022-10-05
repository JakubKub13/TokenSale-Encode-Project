import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyERC20, TokenSale } from "../typechain-types";

const ERC20_TOKEN_RATIO = 5;

describe("NFT Shop", () => {
    let tokenSaleContract: TokenSale;
    let erc20Token: MyERC20;
    let deployer: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;

    beforeEach(async () => {
        [deployer, acc1, acc2] = await ethers.getSigners();
        const erc20TokenFactory = await ethers.getContractFactory("MyERC20")
        const erc20Token = await erc20TokenFactory.deploy();
        await erc20Token.deployed();
        const tokenSaleContractFactory = await ethers.getContractFactory("TokenSale");
        tokenSaleContract = await tokenSaleContractFactory.deploy(ERC20_TOKEN_RATIO, erc20Token.address);
        await tokenSaleContract.deployed();
        const MINTER_ROLE = await erc20Token.MINTER_ROLE();
        const grantRoleTx = await erc20Token.grantRole(MINTER_ROLE, tokenSaleContract.address);
        await grantRoleTx.wait();
    });
    
    describe("When the Shop contract is deployed",  () => {
        it("defines the ratio as provided in parameters", async () => {
            const rate = await tokenSaleContract.erc20Purchaseratio();
            expect(rate).to.eq(ERC20_TOKEN_RATIO)
        });
    
        it("uses a valid ERC20 as payment token", async () => {
          const paymentTokenAddress = await tokenSaleContract.paymentToken();
          const erc20TokenFactory = await ethers.getContractFactory("MyERC20");
          const paymentTokenContract = erc20TokenFactory.attach(paymentTokenAddress);
          const totalSupply = await paymentTokenContract.totalSupply();
          expect(totalSupply).to.eq(0)
        });
    });

})