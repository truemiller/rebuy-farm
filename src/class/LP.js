import {ethers} from "ethers"
// import Web3 from "web3"
import Metamask from "./Metamask";
import Token from "./Token";
import web3 from "web3";
import {erc20Abi, lpAbi} from "../constants/abis";

class LP extends Token {
    constructor(chain, name, address, token0, token1, exchange, isSingle) {
        super(name, address);
        this.isSingle=isSingle
        this.exchange=exchange
        this.token0=token0
        this.token1=token1
        this.chain=chain
    }

    signerContract = () => new ethers.Contract(this.address, lpAbi, Metamask.signer)
    providerContract = () => new ethers.Contract(this.address, lpAbi, this.chain.defaultProvider())

    balanceOfPromise = async () => {
        const address = await Metamask.address()
        const balance = this.providerContract()?.functions?.balanceOf(`${address[0]}`)
        return balance
    }

    lpRatioPromise = async () => this.providerContract().functions.getReserves().then(r => r._reserve0 / r._reserve1)

    usdPerToken = async () => {
            if (!this.isSingle){
            // get the addresses of the two tokens in the LP
            const token0Address = await this.providerContract().functions.token0().then(r => r[0])
            const token1Address = await this.providerContract().functions.token1().then(r => r[0])
            // find the balance of each token
            const lpBalanceOfToken0 = await new ethers.Contract(token0Address ,erc20Abi, this.chain.defaultProvider())
                .functions.balanceOf(this.address).then(r=> r.toString())
            const lpBalanceOfToken1 = await new ethers.Contract(token1Address ,erc20Abi, this.chain.defaultProvider())
                .functions.balanceOf(this.address).then(r=> r.toString())
            // find the total supply of lp tokens
            const lpTotalSupply = await this.providerContract().functions.totalSupply().then(r => r.toString())
            // find the price of each token

            const token0Price = await this.exchange.getStableCoinPriceOf_Promise(token0Address)
            const token1Price = await this.exchange.getStableCoinPriceOf_Promise(token1Address)

            // find the full value of both sides of lp supply
            const lpToken0BalancePrice = parseFloat(lpBalanceOfToken0) * parseFloat(token0Price)
            const lpToken1BalancePrice = parseFloat(lpBalanceOfToken1) * parseFloat(token1Price)

            // add the two buckets together
            const totalLPValuation = lpToken0BalancePrice + lpToken1BalancePrice
            // divide the total valuation by the number of lp tokens
            const singleTokenPrice = totalLPValuation / parseFloat(lpTotalSupply)
            return singleTokenPrice / 1000000
            } else {
                const singlePrice = await this.exchange.getStableCoinPriceOf_Promise(this.address) / 1000000

                return singlePrice
            }



    }
}

export default LP