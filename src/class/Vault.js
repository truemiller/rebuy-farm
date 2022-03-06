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

    signerContract = () => new ethers.Contract(this.address, vaultAbi, Metamask.signer)

    tvlPromise = async () => {
        return this.contract?.functions?.balance()
    }

    depositedPromise = async () => {
        const address = await Metamask.address()
        return this.contract?.functions?.balanceOf(`${address[0]}`)
    }

    withdrawAllPromise = async () => this.signerContract().functions.withdrawAll()

    depositAllPromise = async () => {
        const address = await Metamask.address()

        // approve contract to spend lp
        if ( await this.isApprovedPromise ){
            const balance = await this.farm.token.contract?.functions?.balanceOf(`${address[0]}`)
            await new ethers.Contract(this.address, vaultAbi, Metamask.signer).functions.deposit(balance.toString())
        }
        //
    }

    approvePromise = async () => {
        return this.farm.token.signerContract().approve(this.address, ethers.constants.MaxUint256)
    }

    isApprovedPromise = async () => {
        const address = await Metamask.address()
        const allowance = await this.farm.token.contract.allowance(address[0], this.address)
        const balanceOfOwner = await this.farm.token.contract.balanceOf(address[0])

        let isApproved;
        isApproved = ethers.BigNumber.from(allowance).gt(ethers.BigNumber.from(balanceOfOwner));

        return isApproved
    }


    getPricePerFullSharePromise = async () =>  this.contract.functions.getPricePerFullShare()

    harvestPromise = async () => this.strategy.signerContract().functions.harvest().then(r=>r.wait().then(r=>window.location.reload()))

}

export default Vault;