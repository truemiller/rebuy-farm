import {ethers} from "ethers";
import {AVALANCHE} from "./Chain";
import {chains} from "../constants/constants";

class Metamask {
    ethereum;
    static chainId = async () => window?.ethereum?.request({method: 'eth_chainId'}) ?? null
    static address = async () => window?.ethereum?.request({method: 'eth_requestAccounts'}) ?? null
    static provider = () => window?.ethereum ? new ethers.providers.Web3Provider(window?.ethereum ?? null, "any") : null
    static signer = this.provider()?.getSigner()
}
export default Metamask