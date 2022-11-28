import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, execute} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('AnyswapV6ERC20', {
    from: deployer,
    args: ['IronBank', 'IB', 18, '0x0000000000000000000000000000000000000000', deployer],
    log: true,
  });

  // let tx = await execute('AnyswapV6ERC20', { from: deployer }, 'initVault', vault);
  // console.log('initVault, tx:', tx.transactionHash);
};
export default func;
func.tags = ['anyswap'];
