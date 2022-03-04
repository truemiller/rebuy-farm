import {ethers} from "ethers"
import Metamask from "./Metamask";
import {Component} from "react";
import {vaultAbi} from "../constants/abis";

class Vault {

    constructor(chain, platform, farm, address, strategy, note) {
        this.note=note;
        this.chain=chain;
        this.platform = platform;
        this.farm = farm;
        this.address = address;
        this.contract = new ethers.Contract(this.address, vaultAbi, this.chain.defaultProvider())
        this.strategy = strategy;
    }

    tvlPromise = async () => this.contract.functions.balance()

    depositedPromise = async () => {
        const address = await Metamask.address()
        return this.contract?.functions?.balanceOf(`${address[0]}`)
    }

    withdrawAllPromise = async () => this.contract.functions.withdrawAll()

    depositAllPromise = async () => {
        const address = await Metamask.address()
        const balance = await this.farm.token.contract?.functions?.balanceOf(`${address[0]}`)

        // approve contract to spend lp
        if ( await this.isApprovedPromise ){
            await this.contract.functions.deposit(balance.toString())
        }
        //
    }

    approvePromise = async () => {
        return this.farm.token.contract.approve(this.address, ethers.constants.MaxUint256)
    }

    isApprovedPromise = async () => {
        const address = await Metamask.address()
        const allowance = await this.farm.token.contract.allowance(address[0], this.address)
        // console.log('allowance', allowance)
        const balanceOfOwner = await this.farm.token.contract.balanceOf(address[0])
        // console.log('balanceOfOwner', balanceOfOwner)

        let isApproved;
        isApproved = ethers.BigNumber.from(allowance).gt(ethers.BigNumber.from(balanceOfOwner));

        return isApproved
    }


    getPricePerFullSharePromise = async () =>  this.contract.functions.getPricePerFullShare()

    harvestPromise = async () => this.strategy.contract.functions.harvest().then(r=>r.wait().then(r=>window.location.reload()))

}

export default Vault;