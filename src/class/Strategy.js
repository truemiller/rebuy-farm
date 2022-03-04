import {ethers} from "ethers";
import Metamask from "./Metamask";
import web3 from "web3";
import {strategyAbi} from "../constants/abis";

class Strategy {
    constructor(chain, name, address) {
        this.chain = chain
        this.name = name
        this.address = address
        this.contract = new ethers.Contract(address, strategyAbi, this.chain.defaultProvider())
    }

    signerContract = () => new ethers.Contract(this.address, strategyAbi, Metamask.signer)

    harvestPromise = async () => {
        return new ethers.Contract(this.address, strategyAbi, Metamask.signer()).functions.harvest()
    }
    rewardsAvailablePromise = async () => {
        return web3.utils.fromWei(await this.contract.functions.rewardsAvailable().then(r => r.toString()))
    }
}

export default Strategy

