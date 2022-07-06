const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');
const { provider } = waffle;

const supplyA = ethers.utils.parseEther('1000000');
const amountA = ethers.utils.parseEther('1000');
const amountB = ethers.utils.parseEther('100');

describe("Contract", function () {
  beforeEach(async function () {
    const Token = await ethers.getContractFactory("Token");
    const tokenA = await Token.deploy("Token A", "TA", supplyA);
    await tokenA.deployed();
    const tokenB = await Token.deploy("Token B", "TB", supplyA);
    await tokenB.deployed();

    const Contract = await ethers.getContractFactory('Orderbook');
    const contract = await Contract.deploy(tokenA, tokenB);
  })
  
  it("Should return tokens address", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
