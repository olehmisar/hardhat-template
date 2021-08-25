import { DeployFunction } from 'hardhat-deploy/types';
import { typedDeploy } from '../shared/utils';

const deploy: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const deploy = typedDeploy(deployments.deploy);
  const { deployer } = await getNamedAccounts();
};

export default deploy;