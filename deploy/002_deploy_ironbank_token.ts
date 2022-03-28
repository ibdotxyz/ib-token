import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, ethers} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  // TODO: TBD
  const name = 'IronBank'
  const symbol = 'IB'

  await deploy('IronBankToken', {
    from: deployer,
    args: [name, symbol],
    log: true,
  });

};
export default func;
func.tags = ['IronBankToken'];
