import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute, read} = deployments;

  const {deployer, multisig} = await getNamedAccounts();

  const minDelay = 2 * 24 * 3600
  const proposers = [multisig]

  const executors = [multisig]

  await deploy('TokenController', {
    from: deployer,
    args: [minDelay, proposers, executors],
    log: true,
  });

  const TIMELOCK_ADMIN_ROLE = await read('TokenController', 'TIMELOCK_ADMIN_ROLE')

  // renounce deployer's timelock admin role
  console.log('renounce deployer\'s timelock admin role')
  await execute(
    'TokenController',
    { from: deployer },
    'renounceRole',
    TIMELOCK_ADMIN_ROLE,
    deployer
  )
  console.log(
    'deployer has timelock admin role:',
    await read('TokenController', 'hasRole', TIMELOCK_ADMIN_ROLE, deployer)
  )

};
export default func;
func.tags = ['TokenController'];
