const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Test token controller with ironbank token', function() {

  const minDelay = 86400

  let ironbankToken
  let tokenController

  let accounts
  let executor
  let proposer

  beforeEach(async () => {
    let tx
    accounts = await ethers.getSigners()
    executor = accounts[0]
    proposer = accounts[1]

    const TokenController = await ethers.getContractFactory('TokenController')

    tokenController = await TokenController.deploy(86400, [proposer.address], [executor.address])
    await tokenController.deployed()

    // renounce admin role for deployer
    tx = await tokenController.renounceRole(await tokenController.TIMELOCK_ADMIN_ROLE(), accounts[0].address)
    await tx.wait()

    const IronBankToken = await ethers.getContractFactory('IronBankToken')
    ironbankToken = await IronBankToken.deploy('IronBank Token', 'IB')
    await ironbankToken.deployed()

    tx = await ironbankToken.setMinter(tokenController.address)
    await tx.wait()
    tx = await ironbankToken.transferOwnership(tokenController.address)
    await tx.wait()
  })

  it('can mint', async () => {
    const to = accounts[0]
    const mintAmount = ethers.utils.parseEther('100')

    let tx = await tokenController.connect(proposer).schedule(
      ironbankToken.address,
      ethers.constants.Zero,
      ironbankToken.interface.encodeFunctionData('mint', [to.address, mintAmount]),
      ethers.constants.HashZero,
      ethers.constants.HashZero,
      minDelay,
    )
    await tx.wait()

    await network.provider.send('evm_increaseTime', [minDelay + 1])
    await network.provider.send('evm_mine')

    tx = await tokenController.connect(executor).execute(
      ironbankToken.address,
      ethers.constants.Zero,
      ironbankToken.interface.encodeFunctionData('mint', [to.address, mintAmount]),
      ethers.constants.HashZero,
      ethers.constants.HashZero,
    )
    await tx.wait()

    expect(
      await ironbankToken.balanceOf(to.address)
    ).to.be.equal(mintAmount)
    expect(
      await ironbankToken.totalSupply()
    ).to.be.equal(mintAmount)

  })

  it('can grant executor role by timelock itself', async () => {
    const other = accounts[2]
    const executorRole = await tokenController.EXECUTOR_ROLE()

    expect(await tokenController.hasRole(executorRole, other.address)).to.be.false

    let tx = await tokenController.connect(proposer).schedule(
      tokenController.address,
      ethers.constants.Zero,
      tokenController.interface.encodeFunctionData('grantRole', [executorRole, other.address]),
      ethers.constants.HashZero,
      ethers.constants.HashZero,
      minDelay,
    )
    await tx.wait()

    await network.provider.send('evm_increaseTime', [minDelay + 1])
    await network.provider.send('evm_mine')

    tx = await tokenController.connect(executor).execute(
      tokenController.address,
      ethers.constants.Zero,
      tokenController.interface.encodeFunctionData('grantRole', [executorRole, other.address]),
      ethers.constants.HashZero,
      ethers.constants.HashZero,
    )
    await tx.wait()

    expect(await tokenController.hasRole(executorRole, other.address)).to.be.true
  })

  it('cannot grant executor role by deployer', async () => {
    const other = accounts[2]
    await expect(
      tokenController.grantRole(await tokenController.EXECUTOR_ROLE(), other.address)
    ).to.be.revertedWith('missing role')
  })

})
