const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');
const { provider } = waffle;

const amountA = ethers.utils.parseEther('10000');
const amountB = ethers.utils.parseEther('1000');

describe('Exchange NoRefs', function () {
  beforeEach(async function () {


  })
  

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
