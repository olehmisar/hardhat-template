import type { ethers } from "ethers";
import type {
  CallOptions,
  Deployment,
  DeploymentsExtension,
  DeployOptions,
  DeployResult,
  Receipt,
  TxOptions,
} from "hardhat-deploy/types";
import { extendEnvironment } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type { MergeN, OmitProperties } from "ts-essentials";

declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    /**
     * Type-only wrapper around `hardhat-deploy` for typesafe deployments.
     */
    typedDeployments: TypedDeploymentsExtension;
    /**
     * Return `hre.getNamedAccounts` but additionally ensure that they are all valid addresses.
     */
    safeGetNamedAccounts: <N extends Record<string, true>>(
      names: N,
    ) => Promise<Record<keyof N, string>>;
  }

  interface TypedHardhatDeployNames {}
}

extendEnvironment((hre) => {
  hre.typedDeployments = hre.deployments as TypedDeploymentsExtension;
  hre.safeGetNamedAccounts = (names) => safeGetNamedAccounts(hre, names);
});

async function safeGetNamedAccounts<N extends Record<string, true>>(
  hre: HardhatRuntimeEnvironment,
  names: N,
): Promise<Record<keyof N, string>> {
  const { pick } = await import("lodash");
  const addresses = await hre.getNamedAccounts();
  const namesAsArray = Object.keys(names);
  const invalidName = namesAsArray.find(
    (name) => !hre.ethers.utils.isAddress(addresses[name]),
  );
  if (invalidName) {
    throw new TypeError(
      `Invalid "namedAccounts" for network ${hre.network.name}: "${invalidName}" (${addresses[invalidName]})`,
    );
  }
  return pick(addresses, namesAsArray) as Record<keyof N, string>;
}

type CustomNames = OmitProperties<
  {
    [key in keyof import("hardhat/types/runtime").TypedHardhatDeployNames]: import("hardhat/types/runtime").TypedHardhatDeployNames[key] extends keyof Factories
      ? import("hardhat/types/runtime").TypedHardhatDeployNames[key]
      : never;
  },
  never
>;

interface TypedDeploymentsExtension extends DeploymentsExtension {
  deploy<N extends keyof CustomNames>(
    name: N,
    options: TypedDeployOptions<N>,
  ): Promise<DeployResult>;
  execute<
    N extends keyof CustomNames,
    M extends keyof Contracts[CustomNames[N]]["functions"],
  >(
    name: N,
    options: TxOptions,
    methodName: M,
    ...args: SafeParameters<Contracts[CustomNames[N]]["functions"][M]>
  ): Promise<Receipt>;
  read<
    N extends keyof CustomNames,
    M extends keyof Contracts[CustomNames[N]]["callStatic"],
  >(
    name: N,
    options: CallOptions,
    methodName: M,
    ...args: SafeParameters<Contracts[CustomNames[N]]["callStatic"][M]>
  ): SafeReturnType<Contracts[CustomNames[N]]["callStatic"][M]>;
  read<
    N extends keyof CustomNames,
    M extends keyof Contracts[CustomNames[N]]["callStatic"],
  >(
    name: N,
    methodName: M,
    ...args: SafeParameters<Contracts[CustomNames[N]]["callStatic"][M]>
  ): SafeReturnType<Contracts[CustomNames[N]]["callStatic"][M]>;
  get<N extends keyof CustomNames>(name: N): Promise<Deployment>;
}

type _Typechain = typeof import("../typechain-types");
type _Factories0 = {
  [key in keyof _Typechain as key extends `${infer N}__factory`
    ? N
    : never]: _Typechain[key] extends abstract new (...args: any) => any
    ? InstanceType<_Typechain[key]>
    : never;
};
type Factories = Pick<
  _Factories0,
  {
    [key in keyof _Factories0]: _Factories0[key] extends ethers.ContractFactory
      ? key
      : never;
  }[keyof _Factories0]
>;
type TypedDeployOptions<N extends keyof CustomNames> = ExpandObject<
  MergeN<
    [
      DeployOptions,
      {
        log: boolean;
      },
      Parameters<Factories[CustomNames[N]]["deploy"]> extends [
        ethers.Overrides?,
      ]
        ? {
            args?: Parameters<Factories[CustomNames[N]]["deploy"]>;
          }
        : {
            args: Parameters<Factories[CustomNames[N]]["deploy"]>;
          },
      N extends CustomNames[N]
        ? {
            contract?: CustomNames[N];
          }
        : {
            contract: CustomNames[N];
          },
    ]
  >
>;

type Contracts = {
  [key in keyof Factories]: Awaited<ReturnType<Factories[key]["deploy"]>>;
};

type SafeParameters<T> = T extends (...args: any[]) => any
  ? Parameters<T>
  : never;
type SafeReturnType<T> = T extends (...args: any[]) => any
  ? ReturnType<T>
  : never;
type ExpandObject<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
