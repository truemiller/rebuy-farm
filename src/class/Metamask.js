import {ethers} from "ethers";

class Metamask {
    ethereum;
    static chainId = async () => await window?.ethereum?.request({method: 'eth_chainId'})
    static address = async () => await window?.ethereum?.request({method: 'eth_requestAccounts'})
    static provider = () => new ethers.providers.Web3Provider(window?.ethereum, "any")
    static signer = this.provider().getSigner()
}
export default Metamask