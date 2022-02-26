import axios from "axios";

class Token {
    constructor(name, address, image=null) {
        this.name=name;this.address=address;this.image=image;
    }

    static getPriceByAddress = (address) => {
        const pricePromise = axios.get("")
    }

    getPrice = () => {}
}

export default Token
