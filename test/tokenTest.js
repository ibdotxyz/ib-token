const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Test ironbank token', function() {

  let ironbankToken
  let owner
  let other

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    owner = accounts[0]
    other = accounts[1]

    const IronBankToken = await ethers.getContractFactory('IronBankToken')
    ironbankToken = await IronBankToken.deploy('IronBank Token', 'IB')
    await ironbankToken.deployed()

    tx = await ironbankToken.setMinter(owner.address)
    await tx.wait()
  })

  it('mint', async () => {
    const to = accounts[0]
    const mintAmount = ethers.utils.parseEther('100')

    let tx = await ironbankToken.mint(to.address, mintAmount)
    await tx.wait()

    const toBalance = await ironbankToken.balanceOf(to.address)
    const totalSupply = await ironbankToken.totalSupply()
    expect(toBalance).to.be.equal(mintAmount)
    expect(totalSupply).to.be.equal(mintAmount)
  })

  it('mint by other', async () => {
    const mintAmount = ethers.utils.parseEther('100')
    await expect(
      ironbankToken.connect(other).mint(other.address, mintAmount)
    ).to.be.revertedWith('caller is not the minter')
  })

  it('burn', async () => {
    const owner = accounts[0]
    const mintAmount = ethers.utils.parseEther('100')

    let tx = await ironbankToken.mint(owner.address, mintAmount)
    await tx.wait()

    tx = await ironbankToken.burn(mintAmount)
    await tx.wait()

    const toBalance = await ironbankToken.balanceOf(owner.address)
    const totalSupply = await ironbankToken.totalSupply()
    expect(toBalance).to.be.equal(0)
    expect(totalSupply).to.be.equal(0)
  })

  it('burn more than balance', async () => {
    const owner = accounts[0]
    const mintAmount = ethers.utils.parseEther('100')

    let tx = await ironbankToken.mint(owner.address, mintAmount)
    await tx.wait()

    await expect(
      ironbankToken.burn(mintAmount.add(1))
    ).to.be.revertedWith('burn amount exceeds balance')
  })

  it('burn by other', async () => {
    const mintAmount = ethers.utils.parseEther('100')

    let tx = await ironbankToken.mint(other.address, mintAmount)
    await tx.wait()

    await expect(
      ironbankToken.connect(other).burn(mintAmount)
    ).to.be.revertedWith('caller is not the owner')
  })

  it('set minter', async () => {
    await expect(
      ironbankToken.setMinter(other.address)
    ).to.emit(ironbankToken, 'NewMinter').withArgs(owner.address, other.address)
  })

  it('set minter by other', async () => {
    await expect(
      ironbankToken.connect(other).setMinter(other.address)
    ).to.be.revertedWith('caller is not the owner')
  })
})
