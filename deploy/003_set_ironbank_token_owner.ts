import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {execute, get, read} = deployments;

  const {deployer, multisig} = await getNamedAccounts();

//   const controller = await get('TokenController')

  await execute(
    'IronBankToken',
    { from: deployer },
    'transferOwnership',
    multisig,
  )

  const owner = await read('IronBankToken', 'owner')
  console.log('owner', owner)
};
export default func;
func.tags = ['SetTokenController'];
