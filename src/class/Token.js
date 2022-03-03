import axios from "axios";
import {ethers} from "ethers";
import Metamask from "./Metamask";
import {ELKFINANCE} from "./Exchange";

class Token {
    constructor(name, address, image = null, cgid) {
        this.name = name;
        this.address = address;
        this.image = image;
        this.cgid = cgid;
    }

    static getPriceByAddress = (address) => {
        const pricePromise = axios.get("")
    }

    getCoingeckoPriceOf = async () => {
        const {data} = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${this.cgid}&vs_currencies=usd`)
        return data[this.cgid]["usd"]
    }

}

export default Token
