import {ethers} from "ethers";
import web3 from "web3";
import {routerAbi} from "../constants/abis";
import {chains} from "../constants/constants";

export default class Exchange {
    constructor(chain, name, router, url) {
        this.chain = chain
        this.name = name
        this.url = url
        try {
            this.router = new ethers.Contract(router, routerAbi, this.chain.defaultProvider())
        } catch (e) {
        }
    }

    getStableCoinPriceOf_Promise = async (address, stablecoinAddress = this.chain.stablecoinAddress) => {

        const checksumAddress = web3.utils.toChecksumAddress(address)
        const checksumChainStableAddress = web3.utils.toChecksumAddress(stablecoinAddress)

        if (checksumAddress === checksumChainStableAddress) {
            return "1000000000000000000"
        }

        const amountsOut = await this.router.functions.getAmountsOut("1000000000000000000", [address, this.chain.stablecoinAddress])
        const bFloat = amountsOut[0][1].toString()
        return (bFloat)
    }
}
