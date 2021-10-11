import { DeployFunction } from 'hardhat-deploy/types';
import { typedDeployments } from '../shared/typed-hardhat-deploy';

const deploy: DeployFunction = async ({ deployments: d, getNamedAccounts }) => {
  const { deploy } = typedDeployments(d);
  const { deployer } = await getNamedAccounts();
};

export default deploy;
