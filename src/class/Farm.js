import {BigNumber, ethers} from "ethers"
import web3 from "web3"
import {masterchefv3Abi, rewardPoolAbi} from "../constants/abis"
import Metamask from "./Metamask";

class Farm {
    constructor(chain, name, address, token, platform, exchange) {
        this.exchange = exchange
        this.chain = chain;
        this.name = name;
        this.address = address;
        this.token = token;
        this.platform = platform;
    }
    providerContract = () => new ethers.Contract(this.address, rewardPoolAbi, this.chain.defaultProvider())
    signerContract = () => new ethers.Contract(this.address, rewardPoolAbi, Metamask.signer)
    apy = (apr)=>(((1 + (apr / 100 / 365)) ** 365) - 1) * 100
    aprPromise = async () => {
        const emissions = await this.providerContract().functions.rewardRate().then(r=>r.toString())

        //calculate yearly emissions
        const emissionsGwei = web3.utils.fromWei(emissions)
        const blockRate = this.chain.blocktime
        const emissionsPerSecond=emissionsGwei * blockRate
        const emissionsPerMinute=emissionsPerSecond*60
        const emissionsPerHour=emissionsPerMinute*60
        const emissionsPerDay=emissionsPerHour*24
        const emissionsPerYear=emissionsPerDay*365
        // calc price of yearly emissions
        const rewardTokenAddress = await this.providerContract().functions.rewardsToken().then(r=>r[0]);
        const priceOfRewardToken = await this.exchange.getStableCoinPriceOf_Promise(rewardTokenAddress);
        const priceOfYearlyEmissions = priceOfRewardToken * emissionsPerYear

        // get total staked (tvl)
        const priceOfLP = await this.token.usdPerToken()
        const balanceOfPoolWei = await this.token.providerContract().balanceOf(this.address).then(r=>r.toString())

        const balanceOfPool = web3.utils.fromWei(balanceOfPoolWei)
        const priceOfPool = balanceOfPool * priceOfLP
        // apr
        const apr = priceOfYearlyEmissions / priceOfPool
        return apr / 100 / 100
    }
}

export class FarmChef extends Farm {
    constructor(chain,name,address,token,platform,exchange, poolId) {
        super(chain,name,address,token,platform,exchange);
        this.poolId=poolId
    }

    providerContract = () => new ethers.Contract(this.address, masterchefv3Abi, this.chain.defaultProvider())
    signerContract = () => new ethers.Contract(this.address, masterchefv3Abi, Metamask.signer)

    aprPromise = async () => {
        const poolInfo = await this.providerContract().functions.poolInfo(49).then(r=>r)
        let allocPoints = parseFloat(poolInfo.allocPoint)
        let joePerSec = await this.providerContract().functions.joePerSec().then(r=>r.toString())
        let totalAllocPoints = await this.providerContract().functions.totalAllocPoint().then(r=>r.toString())
        let poolWeight = parseFloat(allocPoints/totalAllocPoints).toFixed()
        let emissions = parseFloat(joePerSec * poolWeight)

        //calculate yearly emissions
        const emissionsGwei = web3.utils.fromWei(emissions)
        const blockRate = this.chain.blocktime
        const emissionsPerSecond=emissionsGwei * blockRate
        const emissionsPerMinute=emissionsPerSecond*60
        const emissionsPerHour=emissionsPerMinute*60
        const emissionsPerDay=emissionsPerHour*24
        const emissionsPerYear=emissionsPerDay*365

        // calc price of yearly emissions
        const rewardTokenAddress = await this.providerContract().functions.JOE().then(r=>r[0]);
        const priceOfRewardToken = await this.exchange.getStableCoinPriceOf_Promise(rewardTokenAddress);
        const priceOfYearlyEmissions = priceOfRewardToken * emissionsPerYear

        // get total staked (tvl)
        const priceOfLP = await this.token.usdPerToken()
        const balanceOfPoolWei = await this.token.providerContract().balanceOf(this.address).then(r=>r.toString())
        const balanceOfPool = web3.utils.fromWei(balanceOfPoolWei)
        const priceOfPool = balanceOfPool * priceOfLP

        // apr
        const apr = priceOfYearlyEmissions / priceOfPool
        return apr / 100 / 100
    }
}

export default Farm