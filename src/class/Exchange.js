import {ethers} from "ethers";
import web3 from "web3";
import {routerAbi} from "../constants/abis";
import {chains} from "../constants/constants";

export default class Exchange {
    constructor(chain, name, router, url) {
        this.chain=chain
        this.name=name
        this.url=url
        try {
            this.router = new ethers.Contract(router, routerAbi, this.chain.defaultProvider())
        } catch (e) {}
    }

    getStableCoinPriceOf_Promise = async (address, stablecoinAddress = this.chain.stablecoinAddress) => {

        if (web3.utils.toChecksumAddress(address) === web3.utils.toChecksumAddress(stablecoinAddress)) {
            return "1000000000000000000"
        }

        const amountsOut = await this.router.functions.getAmountsOut("1000000000000000000", [address,"0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"])
        // const a = amountsOut[0][0].toString()

        const bFloat = amountsOut[0][1].toString()
        return (bFloat)
    }
}
