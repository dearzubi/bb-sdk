import { ethers } from "ethers";
import { GasFee } from "./types/types";

export const gasFee = async (
  provider: ethers.providers.JsonRpcProvider, 
  eip1559: boolean = true
): Promise<GasFee> => {
  const [fee, block] = await Promise.all<[Promise<ethers.BigNumber>, Promise<ethers.providers.Block>]>
  ([
    provider.send("eth_gasPrice", []),
    provider.getBlock("latest"),
  ]);

  if(block?.baseFeePerGas && eip1559){
    let maxPriorityFee = ethers.BigNumber.from(fee).sub(block.baseFeePerGas);
    const buffer = maxPriorityFee.div(100).mul(13);
    maxPriorityFee = maxPriorityFee.add(buffer);
    const maxFee = block.baseFeePerGas.mul(2).add(maxPriorityFee);
    return { maxFee: maxFee, maxPriorityFee: maxPriorityFee };
  }
  return ethers.BigNumber.from(fee);
};