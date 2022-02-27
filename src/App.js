import logo from './logo.svg'
import {Fragment, useEffect, useState} from "react"
import "../node_modules/bootstrap/dist/css/bootstrap.css"
import "./App.css"

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


const chains = {
    avax: AVALANCHE,
}

const platforms = {
    elk: new Platform("ELK", "https://4126527139-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-MW_PNk7A0t0ux_cdlkt%2F-MiWHF5mPB0N_QTE7e-j%2F-MiWHWQjSbekcPtPUdwV%2FElkLogo%20512x512.svg?alt=media&token=27da238a-7b85-4ea8-b1f0-8a67aeaf2049")
}

const chainIds = {
    "0xa86a": "Avalanche"
}

const tokens = {
    elk: new Token("Elk", "", "https://4126527139-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-MW_PNk7A0t0ux_cdlkt%2F-MiWHF5mPB0N_QTE7e-j%2F-MiWHWQjSbekcPtPUdwV%2FElkLogo%20512x512.svg?alt=media&token=27da238a-7b85-4ea8-b1f0-8a67aeaf2049"),
    wavax: new Token("Wrapped Avalanche", "", "https://assets.coingecko.com/coins/images/15075/large/wrapped-avax.png?1629873618"),
    usdte: new Token("USDT.e", "", "https://cryptologos.cc/logos/tether-usdt-logo.png"),
    usdce: new Token("USDC.e", "", "https://cryptologos.cc/logos/usd-coin-usdc-logo.png")
    // elkPng: new LP("ELKPNGLP", "", ""),
    // elkDcau: new LP("ELKDCAULP", "", ""),
}

const lps = {
    elkWavax: new LP(AVALANCHE, "ELK/WAVAX LP", "0x2612dA8fc26Efbca3cC3F8fD543BCBa72b10aB59", tokens.elk, tokens.wavax),
    elkUsdce: new LP(AVALANCHE, "ELK/USCTE LP", "0xd185c562306cb257a53c6b9d7287ebed9b1bb410", tokens.elk, tokens.usdce),
}

const farms = {
    elkWavax: new Farm(AVALANCHE, "ELKWAVAX", "0x9ec3ca469F415a7e55A21Dc662D427d59e8De8F6", lps.elkWavax, platforms.elk),
    elkUsdce: new Farm(AVALANCHE, "ELKUSDC", "0xe935028DF3285D1852E11dAe384534d27887c196", lps.elkUsdce, platforms.elk),
    // elkPng: new Farm("ELKPNG", tokens.elkPng, platforms.elk),
    // elkDcau: new Farm("ELKDCAU", tokens.elkDcau, platforms.elk),
}

const strategies = {
    elkWavax: new Strategy("ELKWAVAX", "0xb90cFF851899C56f10Da6125EE790004e3eeC426"),
    elkUsdce: new Strategy("ELKUSDCE", "0x72eADD8BBE9d3076e7F108641bB92b3b8078D96D")
}


const vaults = {
    elkWavax: new Vault(chains.avax, platforms.elk, farms.elkWavax, "0xd1b524ee1d1278b4770c5d6c97Cf70D3F73358a6", strategies.elkWavax),
    elkUsdce: new Vault(chains.avax, platforms.elk, farms.elkUsdce, "0x91590A3733F80f7646264B03738e810815Ba30eC", strategies.elkUsdce),
    // elkPolygon: new Vault(chains.matic, platforms.elk, farms.elkWavax, "0xd1b524ee1d1278b4770c5d6c97Cf70D3F73358a6", strategies.elkWavax)
}

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
        <Fragment>
            <Navbar chainId={chainId} accounts={accounts}/>
            <div className="container mt-3">
                <h1 className={"fw-bolder "}>Rebuy Farm</h1>
                <p className={"text-muted"}>The cross chain yield optimizer</p>
                <VaultTable accounts={accounts} chainId={chainId}/>
            </div>
        </Fragment>
    );
}

function Navbar(props) {
    let chainId = props.chainId;
    let accounts = props.accounts;


    return <nav className="navbar border  bg-white">
        <div className="container">
            <a href="#" className="navbar-brand fw-bolder">Rebuy Farm</a>
            <div className={"d-flex"}>
                <div className="btn btn-light">{chainIds[chainId]}</div>
                <div className="btn btn-light">{accounts ?? "None"}</div>
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
                <div className={"col-md-3 mb-3"}>
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
        // try {

            const lpUsdPerToken = await lp.usdPerToken()
            const tvlUSD = parseFloat(lpUsdPerToken) * parseFloat(tvl) /.2
            const walletBalance = await farm.token.balanceOfPromise().then(r => web3.utils.fromWei(r.toString()))
            const initialStake = await vault.depositedPromise().then(r => web3.utils.fromWei(r.toString()))
            const isApproved = await vault.isApprovedPromise().then(r => r)
            const currentStake = await vault.getPricePerFullSharePromise().then(r => web3.utils.fromWei(r.toString())) * initialStake
            const currentStakedUSD = currentStake * lpUsdPerToken / .2
            const apr = await farm.aprPromise().then(r => r)
            const apy = (((1 + (apr / 100 / 365)) ** 365) - 1) * 100
            const rewards = await vault.strategy.rewardsAvailablePromise().then(r=>r)
        console.log("walletBalance", walletBalance)


            setApr(apr)
            setApy(apy)
            setTvl(tvl)
            setTvlUSD(tvlUSD)
            setWallet(walletBalance)
            setDeposited(initialStake)
            setApproved(isApproved)
            setCurrentStake(currentStake)
            setCurrentStakeUSD(currentStakedUSD)
            setRewards(rewards)
        // } catch (e) {
        //
        // }
    }, [])

    return <div key={vaultKey} className={"card"}>
        <div className="card-body">
            <div className={"fw-bolder text-center"}>
                <h2 className={"fw-bolder"}>Elk Finance</h2>
                {farm.name}
                <div>
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
            <table className={"table table-sm"}>
                <tbody>
                <tr>
                    <th>APR</th>
                    <td className={"mb-0"}>{apr ? apr.toFixed(0) + "%" : <Skeleton/>}</td>
                </tr>
                <tr>
                    <th>APY</th>
                    <td>{apy ? apy.toFixed(0) + "%" : <Skeleton/>}</td>
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
                    <td>{wallet ? parseFloat(wallet).toPrecision(4): <Skeleton/>}</td>
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
                    <td>{currentStakeUSD ? "$" + (parseFloat(currentStakeUSD).toFixed(0)) : <Skeleton/>}</td>
                </tr>
                <tr>
                    <th>Rewards </th>
                    <td>{rewards ? "$" + (parseFloat(rewards).toPrecision(4)) : <Skeleton/>}</td>
                </tr>
                </tbody>
            </table>
            <div className="btn-group w-100" role="group" aria-label="...">
                <button className="btn btn-sm btn-outline-dark"
                        onClick={async () => vault.harvestPromise()}>
                    Compound
                </button>
                <button className="btn btn-sm btn-outline-dark"
                        onClick={vault.withdrawAllPromise}>
                    Withdraw
                </button>

                { // Approval switch
                    approved ? (
                        <button className="btn btn-sm btn-outline-dark"
                                onClick={vault.depositAllPromise}>
                            Deposit
                        </button>
                    ) : (
                        <button className="btn btn-sm btn-outline-dark"
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
