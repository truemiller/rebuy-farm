import {ethers} from "ethers";
import Metamask from "./Metamask";
import web3 from "web3";
import {strategyAbi} from "../constants/abis";

class Strategy {
    constructor(chain, name, address) {
        this.chain = chain
        this.name = name
        this.address = address
    }

    providerContract = () => new ethers.Contract(this.address, strategyAbi, this.chain.defaultProvider())
    signerContract = () => new ethers.Contract(this.address, strategyAbi, Metamask.signer)
    harvestPromise = async () => this.signerContract.functions.harvest()
    rewardsAvailablePromise = async () => web3.utils.fromWei(
        await this.providerContract().rewardsAvailable().then(r => r.toString())
    )
}

class MasterChefStrategy extends Strategy{
    constructor(chain,name,address) {
        super(chain,name,address);
    }
}

export default Strategy

