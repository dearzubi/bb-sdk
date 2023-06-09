import { BigNumber } from "ethers";

export interface IGasFee {
  maxFee: BigNumber;
  maxPriorityFee: BigNumber;
}

export type GasFee = IGasFee | BigNumber;