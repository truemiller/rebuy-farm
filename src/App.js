import logo from './logo.svg'
import {Fragment, useEffect, useState} from "react"
import "./css/bootstrap.css"
import "./css/App.css"

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import web3 from "web3"

import Metamask from "./class/Metamask"
import Token from "./class/Token"
import LP from "./class/LP"
import Farm from "./class/Farm"
import Platform from "./class/Platform"
import Vault from "./class/Vault"
import Strategy from "./class/Strategy"
import Chain, {AVALANCHE, POLYGON} from "./class/Chain"
import {chainIds, vaults} from "./constants";

function App() {
    const [chainId, setChainId] = useState("")
    const [accounts, setAccounts] = useState([])

    useEffect(async () => {
        setAccounts(await Metamask.address())
        setChainId(await Metamask.chainId())
    }, [])

    window.ethereum.on("accountsChanged", () => window.location.reload())
    window.ethereum.on("chainChanged", () => window.location.reload())

    return (
        accounts && chainId === "0xa86a" ?
            <Fragment>
                <Navbar chainId={chainId} accounts={accounts}/>
                <div className="container mt-3">
                    <h1 className={"fw-bolder text-light"}>Rebuy Farm</h1>
                    <p className={" text-white-50"}>The cross chain yield optimizer</p>
                    <VaultTable accounts={accounts} chainId={chainId}/>
                </div>
            </Fragment>
            :
            <>
                <div className={"d-flex vw-100 vh-100 align-items-center justify-content-center"}>
                    <div className="card">
                        <div className="card-body">
                            <a href="#" className="btn btn-primary" onClick={() => {
                                window?.ethereum?.request({method: 'eth_requestAccounts'})
                                window?.ethereum?.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{chainId: '0xa86a'}], // chainId must be in hexadecimal numbers})
                                })
                            }
                            }>Connect to Avalanche wallet</a>
                        </div>
                    </div>
                </div>
            </>
    );
}

function Navbar(props) {
    let chainId = props.chainId;
    let accounts = props.accounts;


    return <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
            <a href="#" className="navbar-brand fw-bolder">Rebuy Farm</a>
            <div className={"d-flex"}>
                <div className="btn ">{chainIds[chainId]}</div>
                <div className="btn ">{accounts ?? "None"}</div>
            </div>
        </div>
    </nav>
}

function VaultTable(props) {
    const accounts = props.accounts ?? []
    const chainId = props.chainId ?? null
    const isConnected = accounts.length > 0


    return <div className={"row"}>
        {Object.keys(vaults).map((vaultKey) => {
            const vault = vaults[vaultKey]
            const farm = vault.farm
            const vaultChainId = vault.chain.chainId
            return vaultChainId === chainId ? (
                <div className={"col-xl-3 col-lg-4 col-md-6 mb-3"}>
                    <VaultTableRow vault={vault} farm={farm} vaultKey={vaultKey} key={vaultKey}
                                   accounts={accounts}/>
                </div>
            ) : null
        })}
    </div>

}

function VaultTableRow(props) {
    let vault = props.vault
    let farm = props.farm
    let lp = farm.token

    let vaultKey = props.vaultKey
    let [accounts, setAccounts] = useState(props.accounts)

    let [tvl, setTvl] = useState(0)
    let [tvlUSD, setTvlUSD] = useState(0)
    let [wallet, setWallet] = useState(0)
    let [deposited, setDeposited] = useState(0)
    let [currentStake, setCurrentStake] = useState(0)
    let [apr, setApr] = useState(0)
    let [apy, setApy] = useState(0)
    let [currentStakeUSD, setCurrentStakeUSD] = useState(0)
    let [rewards, setRewards] = useState(0)

    let [approved, setApproved] = useState(false)


    useEffect(async () => {
        const tvl = await vault.tvlPromise().then(r => web3.utils.fromWei(r.toString()))
        setTvl(tvl)
        let lpUsdPerToken = 0
        try {
            lpUsdPerToken = await lp.usdPerToken()
        } catch (e) {

        }
        const tvlUSD = parseFloat(lpUsdPerToken) * parseFloat(tvl)
        setTvlUSD(tvlUSD)
        const walletBalance = await farm.token.balanceOfPromise().then(r => web3.utils.fromWei(r.toString()))
        const initialStake = await vault.depositedPromise().then(r => web3.utils.fromWei(r.toString()))
        const isApproved = await vault.isApprovedPromise().then(r => r)
        const currentStake = await vault.getPricePerFullSharePromise().then(r => web3.utils.fromWei(r.toString())) * initialStake
        const currentStakedUSD = currentStake * lpUsdPerToken
        const apr = await farm?.aprPromise()?.then(r => r)
        const apy = (((1 + (apr / 100 / 365)) ** 365) - 1) * 100
        const rewards = await vault.strategy.rewardsAvailablePromise().then(r => r)


        setWallet(walletBalance)
        setDeposited(initialStake)
        setApproved(isApproved)
        setCurrentStake(currentStake)
        setCurrentStakeUSD(currentStakedUSD)
        setRewards(rewards)
        setApr(apr)
        setApy(apy)
        // } catch (e) {
        //
        // }
    }, [])

    return <div key={vaultKey} className="card">
        <div className="card-body shadow-lg">
            <div className={"fw-bolder text-center"}>
                <h2 className={"fw-bolder"}>Elk Finance</h2>
                {farm.name}
                <div className={"mb-3"}>
                    <img loading={"lazy"} src={farm.token.token0.image}
                         alt={farm.platform.name + " logo"}
                         title={farm.platform.name} height={24} width={24}/>
                    <img loading={"lazy"}
                         src={farm.token.token1.image}
                         alt={farm.platform.name + " logo"}
                         title={farm.platform.name}
                         height={24} width={24}/>
                </div>
            </div>
            <table className={"table table-sm table-bordered"}>
                <tbody>
                <tr>
                    <th>APR</th>
                    <td>{apr ? parseFloat(apr).toFixed(4) : <Skeleton/>}</td>
                </tr>
                <tr>
                    <th>APY</th>
                    <td>{apy ? parseFloat(apy).toFixed(4) : <Skeleton/>}</td>
                </tr>

                <tr>
                    <th>TVL</th>
                    <td>{tvl ? parseFloat(tvl).toFixed(4) : <Skeleton/>}</td>
                </tr>
                <tr>
                    <th>TVL ($)</th>
                    <td>{tvlUSD ? parseFloat(tvlUSD).toFixed(0) : <Skeleton/>}</td>
                </tr>
                <tr>
                    <th>Wallet Balance</th>
                    <td>{wallet ? parseFloat(wallet).toPrecision(4) : <Skeleton/>}</td>
                </tr>
                <tr>
                    <th>Deposited</th>
                    <td>{deposited ? parseFloat(deposited).toFixed(4) :
                        <Skeleton/>}</td>
                </tr>
                <tr>

                    <th>Current stake</th>
                    <td>{currentStake ? parseFloat(currentStake).toFixed(4) :
                        <Skeleton/>}</td>
                </tr>
                <tr>
                    <th>Current stake ($)</th>
                    <td>{currentStakeUSD ? (parseFloat(currentStakeUSD).toFixed(0)) : <Skeleton/>}</td>
                </tr>
                <tr>
                    <th>Rewards</th>
                    <td>{rewards ? (parseFloat(rewards).toPrecision(4)) : <Skeleton/>}</td>
                </tr>
                </tbody>
            </table>
            <div className="btn-group w-100" role="group" aria-label="...">
                <button className="btn btn-sm btn-success"
                        onClick={async () => vault.harvestPromise()}>
                    Compound
                </button>
                <button className="btn btn-sm btn-primary"
                        onClick={vault.withdrawAllPromise}>
                    Withdraw
                </button>

                { // Approval switch
                    approved ? (
                        <button className="btn btn-sm btn-dark"
                                onClick={vault.depositAllPromise}>
                            Deposit
                        </button>
                    ) : (
                        <button className="btn btn-sm btn-outline-light"
                                onClick={vault.approvePromise}>
                            Approve
                        </button>
                    )
                }
            </div>
        </div>
    </div>
}


export default App;
