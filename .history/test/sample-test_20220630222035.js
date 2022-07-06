const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');
const { provider } = waffle;

const supplyA = ethers.utils.parseEther('1000000');
const amountA = ethers.utils.parseEther('1000');
const amountB = ethers.utils.parseEther('100');

describe("Contract", function () {
  let contract;
  beforeEach(async function () {
    const Token = await ethers.getContractFactory("Token");
    const tokenA = await Token.deploy("Token A", "TA", supplyA);
    await tokenA.deployed();
    const tokenB = await Token.deploy("Token B", "TB", supplyA);
    await tokenB.deployed();

    const Contract = await ethers.getContractFactory('Orderbook');
    contract = await Contract.deploy(tokenA, tokenB);
  })
  
  it("Should return tokens address", async function () {
    const addressA = await contract.tokenA();
    const addressB = await contract.tokenB();

    expect().to.equal("Hola, mundo!");
  });
});
