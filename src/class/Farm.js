import {BigNumber, ethers} from "ethers";
import Metamask from "./Metamask";
import web3 from "web3";
import {AVALANCHE} from "./Chain";
import {ELKFINANCE} from "./Exchange";
import {rewardPoolAbi} from "../constants/abis";

class Farm {
    constructor(chain, name, address, token, platform, exchange) {
        this.exchange = exchange
        this.chain = chain;
        this.name = name;
        this.address = address;
        this.token = token;
        this.platform = platform;
        this.contract = new ethers.Contract(this.address, rewardPoolAbi, this.chain.defaultProvider())
    }

    aprPromise = async () => {
        const emissions = await this.contract.functions.rewardRate().then(r=>r.toString())

        //calculate yearly emissions
        const emissionsGwei = web3.utils.fromWei(emissions)
        const blockRate = this.chain.blocktime
        const emissionsPerSecond=emissionsGwei * blockRate
        const emissionsPerMinute=emissionsPerSecond*60
        const emissionsPerHour=emissionsPerMinute*60
        const emissionsPerDay=emissionsPerHour*24
        const emissionsPerYear=emissionsPerDay*365
        // calc price of yearly emissions
        const rewardTokenAddress = await this.contract.functions.rewardsToken().then(r=>r[0]);
        const priceOfRewardToken = await this.exchange.getStableCoinPriceOf_Promise(rewardTokenAddress);

        const priceOfYearlyEmissions = priceOfRewardToken * emissionsPerYear
        // get total staked (tvl)
        const priceOfLP = await this.token.usdPerToken()
        const balanceOfPoolWei = await this.token.contract.balanceOf(this.address).then(r=>r.toString())

        const balanceOfPool = web3.utils.fromWei(balanceOfPoolWei)
        const priceOfPool = balanceOfPool * priceOfLP
        // apr
        const apr = priceOfYearlyEmissions / priceOfPool
        return apr / 100 / 100
    }


}

export default Farm