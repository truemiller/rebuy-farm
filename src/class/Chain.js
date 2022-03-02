export default class Chain {
    constructor(name, chainId, stablecoinAddress) {
        this.name=name;
        this.chainId=chainId;
        this.stablecoinAddress=stablecoinAddress;
    }
}

export const AVALANCHE = new Chain("Avalanche", "0xa86a", "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664")
