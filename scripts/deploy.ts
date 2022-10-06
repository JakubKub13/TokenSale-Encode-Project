import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyERC20__factory, TokenSale__factory } from "../typechain-types";
dotenv.config();

const ERC20_TOKEN_RATIO = 5;
const NFT_TOKEN_PRICE = 0.1;
const ERC20_CONTRACT_ADDRESS = "0x123";
const ERC721_CONTRACT_ADDRESS = "0x333";

async function main() {
  // Deploy using ethers
  const provider = ethers.getDefaultProvider("goerli");
  const wallet = ethers.Wallet.createRandom();
  const signer = wallet.connect(provider);
  const tokenSaleContractFactory = new TokenSale__factory(signer);
  const tokenSaleContract = await tokenSaleContractFactory.deploy(ERC20_TOKEN_RATIO, NFT_TOKEN_PRICE, ERC20_CONTRACT_ADDRESS, ERC721_CONTRACT_ADDRESS  );
  await tokenSaleContract.deployed();
  const erc20TokenFactory = new MyERC20__factory(signer);
  const erc20Token = erc20TokenFactory.attach("0x addr of tokendeployed")
  const MINTER_ROLE = await ERC20_TOKEN_RATIO.MINTER_ROLE();
  const grantRoleTx = await ERC20_TOKEN_RATIO.grantRole(MINTER_ROLE, tokenSaleContract.address);
  await grantRoleTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
