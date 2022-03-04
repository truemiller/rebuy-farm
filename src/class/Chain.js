import web3 from "web3";
import {ethers} from "ethers";

export default class Chain {
    constructor(name, chainId, stablecoinAddress, provider, blocktime) {
        this.name=name;
        this.chainId=chainId;
        this.stablecoinAddress=stablecoinAddress;
        this.provider = provider
        this.blocktime = blocktime
    }

    defaultProvider = () => new ethers.providers.JsonRpcProvider(this.provider);
}


