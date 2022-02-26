export default class Chain {
    constructor(name, chainId, stablecoinAddress) {
        this.name=name;
        this.chainId=chainId;
        this.stablecoinAddress=stablecoinAddress;
    }
}

export const AVALANCHE = new Chain("Avalanche", "0xa86a", "0xc7198437980c041c805a1edcba50c1ce5db95118")
