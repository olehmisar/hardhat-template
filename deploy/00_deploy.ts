import { DeployFunction } from 'hardhat-deploy/types';

const deploy: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
};

export default deploy;
