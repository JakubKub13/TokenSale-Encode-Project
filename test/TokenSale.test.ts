import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { MyERC20, TokenSale } from "../typechain-types";

const ERC20_TOKEN_RATIO = 5;
const ERC20_TOKEN_PRICE = 0.1;

describe("NFT Shop", () => {
    let tokenSaleContract: TokenSale;
    let erc20Token: MyERC20;
    let deployer: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;
    
    beforeEach(async () => {
        [deployer, acc1, acc2] = await ethers.getSigners();
        const erc20TokenFactory = await ethers.getContractFactory("MyERC20")
        erc20Token = await erc20TokenFactory.deploy();
        await erc20Token.deployed();
        const tokenSaleContractFactory = await ethers.getContractFactory("TokenSale");
        tokenSaleContract = await tokenSaleContractFactory.deploy(ERC20_TOKEN_RATIO, erc20Token.address);
        await tokenSaleContract.deployed();
        const MINTER_ROLE = await erc20Token.MINTER_ROLE();
        const grantRoleTx = await erc20Token.grantRole(MINTER_ROLE, tokenSaleContract.address);
        await grantRoleTx.wait();
    });

    describe("When the Shop contract is deployed", () => {
        it("defines the ratio as provided in parameters", async () => {
            const rate = await tokenSaleContract.erc20Purchaseratio();
            expect(rate).to.eq(ERC20_TOKEN_RATIO)
        });

        it("uses a valid ERC20 as payment token", async () => {
            const paymentTokenAddress = await tokenSaleContract.paymentToken();
            expect(paymentTokenAddress).to.eq(erc20Token.address);
            const erc20TokenFactory = await ethers.getContractFactory("MyERC20");
            const paymentTokenContract = erc20TokenFactory.attach(paymentTokenAddress);
            const myBalance = await paymentTokenContract.balanceOf(deployer.address);
            expect(myBalance).to.eq(0);
            const totalSupply = await paymentTokenContract.totalSupply();
            expect(totalSupply).to.eq(0)
        });
    });

    describe("When a user purchase an ERC20 from the Token contract", async () => {
        let amountToBeSentBn = ethers.utils.parseEther("1");
        
        beforeEach(async () => {
            const purchaseTokenTx = await tokenSaleContract.connect(acc2).purchaseTokens({value: amountToBeSentBn});
            await purchaseTokenTx.wait();
        });
        
        it("charges the correct amount of ETH", async () => {
            const balanceAfterBn = await acc1.getBalance();
            const diff = balanceBeforeBn.sub(balanceAfterBn);
            const expectedDiff = amountToBeSentBn.add(gasCost)
            const error = diff.sub(expectedDiff);
            expect(error).to.eq(0);
        });
        

        it("gives the correct amount of tokens", async () => {
            const acc2Balance = await erc20Token.balanceOf(acc2.address);
            expect(acc2Balance).to.eq(amountToBeSentBn.div(ERC20_TOKEN_RATIO));
        });
    })
    
    describe("When a user burns an ERC20 at the Token contract", () => {
        let gasCost: BigNumber;
        let approveGasCost: BigNumber

        beforeEach(async () => {
            const approveTx = await erc20Token.connect(acc1).approve(tokenSaleContract.address, amountToBeRecived)
            const approveTxReceipt = await approveTx.wait()
            const burnTokenTx = await tokenSaleContract.connect(acc2).burnTokens(amountToBeRecived);
            const txReceipt = await burnTokenTx.wait();
            const gasUnitUsed = txReceipt.gasUsed;
            const gasPrice = txReceipt.effectiveGasPrice;
            gasCost = gasUnitUsed.mul(gasPrice);
            const approveGasUnitUsed = txReceipt.gasUsed;
            const gasPrice = txReceipt.effectiveGasPrice;
            gasCost = gasUnitUsed.mul(gasPrice);
        });

        it("gives the correct amount of ETH", async () => {
            const balanceAfterBn = await acc1.getBalance();
            const diff = balanceBeforeBn.sub(balanceAfterBn);
            const expectedDiff = purchaseGasCosts.add(approveGasCosts).add(burnGasCost);
            const error = expectedDiff.sub(diff);
            expect(error).to.eq(0);

        });

        it("burns the correct amount of tokens", async () => {
            const acc1Balance = await erc20Token.balanceOf(acc1.address);
            expect(acc1Balance).to.eq(0);
            const totalSupply = await erc20Token.totalSupply();
            expect(totalSupply).to.eq(0);

        });
    });

  describe("When a user purchase a NFT from the Shop contract", () => {
    it("charges the correct amount of ETH", () => {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", () => {
      throw new Error("Not implemented");
    });

    it("update the pool account correctly", () => {
      throw new Error("Not implemented");
    });

    it("favors the pool with the rounding", () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", () => {
    it("gives the correct amount of ERC20 tokens", () => {
      throw new Error("Not implemented");
    });
    it("updates the pool correctly", () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraw from the Shop contract", () => {
    it("recovers the right amount of ERC20 tokens", () => {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", () => {
      throw new Error("Not implemented");
    });
  });
});