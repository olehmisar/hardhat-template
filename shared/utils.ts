import { ethers } from 'ethers';
import { DeploymentsExtension, DeployOptions, DeployResult } from 'hardhat-deploy/types';

type _Contracts = typeof import('../typechain');
type _Factories0 = {
  [key in keyof _Contracts as key extends `${infer N}__factory` ? N : never]: InstanceType<_Contracts[key]>;
};
type Factories = Pick<
  _Factories0,
  { [key in keyof _Factories0]: _Factories0[key] extends ethers.ContractFactory ? key : never }[keyof _Factories0]
>;
interface TypedDeployOptions<F extends ethers.ContractFactory> extends DeployOptions {
  args: Parameters<F['deploy']>;
}
export function typedDeploy(
  deploy: DeploymentsExtension['deploy'],
): <N extends keyof Factories>(name: N, options: TypedDeployOptions<Factories[N]>) => Promise<DeployResult> {
  return deploy;
}
