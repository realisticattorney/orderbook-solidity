const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');
const { provider } = waffle;

const supplyA = ethers.utils.parseEther('1000000');
const amountA = ethers.utils.parseEther('1000');
const amountB = ethers.utils.parseEther('100');

describe('Contract', function () {
  beforeEach(async function () {
    [maker, taker] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('ERC20Token');
    tokenA = await Token.deploy('Token A', 'TA', supplyA);
    await tokenA.deployed();
    tokenB = await Token.connect(taker).deploy('Token B', 'TB', supplyA);
    await tokenB.deployed();

    const Contract = await ethers.getContractFactory('OrderBook');
    contract = await Contract.deploy(tokenA.address, tokenB.address);
    await contract.deployed();
  });

  it('Should return tokens address', async function () {
    const addressA = await contract.tokenA();
    expect(addressA).to.equal(tokenA.address);
  });

  it('Should tokenB take', async function () {
    expect(parseInt(await tokenB.balanceOf(taker.address))).to.greaterThan(0);
  });

  it('Should create order', async function () {
    const order = await contract.createOrder(amountA, amountB);
    expect(order.maker).to.equal(maker.address);
    expect(order.taker).to.equal(taker.address);
    expect(order.amountA).to.equal(amountA);
    expect(order.amountB).to.equal(amountB);

  })
});
