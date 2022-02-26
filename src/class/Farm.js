import {ethers} from "ethers";
import Metamask from "./Metamask";
import web3 from "web3";

class Farm {
    constructor(chain, name, address, token, platform) {
        this.chain = chain;
        this.name = name;
        this.address = address;
        this.token = token;
        this.platform = platform;
        this.contract = new ethers.Contract(this.address, "[]", Metamask.signer)
    }



}

export default Farm