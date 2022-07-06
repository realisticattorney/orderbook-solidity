const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');
const { provider } = waffle;

const amountA = ethers.utils.parseEther('10000');
const amountB = ethers.utils.parseEther('1000');

describe("Contract", function () {
  beforeEach(async function () {
    const Token = await ethers.getContractFactory("Token");
    const tokenA = await Token.deploy();


    const Contract = await ethers.getContractFactory('Orderbook');
    const contract = await Contract.deploy(tokenA, tokenB);
  }
  
  
  it("Should return the new greeting once it's changed", async function () {
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
