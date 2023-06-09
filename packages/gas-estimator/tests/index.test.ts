import { gasFee } from '../src';
import { GasFee, IGasFee } from '../src/types/types';
import { expect } from 'chai';
import ganache from 'ganache';
import { ethers } from 'ethers';

type EthereumInstance = {
  chainId?: number
  provider?: ethers.providers.Web3Provider
}

describe('Gas Fee Estimates', () => {
  const ethnode: EthereumInstance = {}

  before(async () => {
    // Provider from hardhat without a server instance
    ethnode.provider = new ethers.providers.Web3Provider(<any>ganache.provider({
      logging: {
        quiet: true
      }
    }));
    ethnode.chainId = 1337
  });

  it('It should return valid EIP1559 Gas Fee as BigNumber', async () => {
    const fee = await gasFee(ethnode.provider!, true) as IGasFee;
    expect(fee).to.be.an('object');
    expect(fee).to.have.property('maxFee');
    expect(fee).to.have.property('maxPriorityFee');
    expect(fee.maxFee).instanceOf(ethers.BigNumber);
    expect(fee.maxPriorityFee).instanceOf(ethers.BigNumber);
  });

  it('It should return valid legacy Gas Fee as BigNumber if EIP1559 is not present', async () => {
    ethnode.provider = new ethers.providers.Web3Provider(<any>ganache.provider({
      logging: {
        quiet: true
      },
      chain:{
        hardfork: 'berlin'
      }
    }));
    const fee = await gasFee(ethnode.provider!, true) as GasFee;
    expect(fee).instanceOf(ethers.BigNumber);
  });

});