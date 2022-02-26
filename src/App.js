import logo from './logo.svg'
import "../node_modules/bootswatch/dist/zephyr/bootstrap.css"
import {Fragment, useEffect, useState} from "react"
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
    elkWavax: new LP(AVALANCHE, "ELKWAVAXLP", "0x2612dA8fc26Efbca3cC3F8fD543BCBa72b10aB59", null, null),
    // elkUsdte: new LP("ELKUSDTELP", "", ""),
    // elkPng: new LP("ELKPNGLP", "", ""),
    // elkDcau: new LP("ELKDCAULP", "", ""),
}

const farms = {
    elkWavax: new Farm(AVALANCHE, "ELKWAVAX", "0x9ec3ca469F415a7e55A21Dc662D427d59e8De8F6", tokens.elkWavax, platforms.elk),
    // elkUsdte: new Farm("ELKUSDT", tokens.elkUsdte, platforms.elk),
    // elkPng: new Farm("ELKPNG", tokens.elkPng, platforms.elk),
    // elkDcau: new Farm("ELKDCAU", tokens.elkDcau, platforms.elk),
}

const strategies = {
    elkWavax: new Strategy("ELKWAVAX", "0xb90cFF851899C56f10Da6125EE790004e3eeC426")
}


const vaults = {
    elkWavax: new Vault(chains.avax, platforms.elk, farms.elkWavax, "0xd1b524ee1d1278b4770c5d6c97Cf70D3F73358a6", strategies.elkWavax),
    // elkPolygon: new Vault(chains.matic, platforms.elk, farms.elkWavax, "0xd1b524ee1d1278b4770c5d6c97Cf70D3F73358a6", strategies.elkWavax)
}

function App() {
    const [chainId, setChainId] = useState("")
    const [accounts, setAccounts] = useState([])

    useEffect(async () => {
        setAccounts(await Metamask.address())
        setChainId(await Metamask.chainId())
    }, [])

    useEffect(async () => {

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            })

            window.ethereum.on('accountsChanged', () => {
                window.location.reload();
            })
        }
    )

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


    return <nav className="navbar bg-white shadow-lg">
        <div className="container">
            <a href="#" className="navbar-brand  fw-bolder">Rebuy Farm</a>
            <div className="nav-link">Connected to chain: {chainIds[chainId] ?? "Unrecognized"}</div>
            <div className="nav-link">Wallet: {accounts ?? "None"}</div>
        </div>
    </nav>
}

function VaultTable(props) {
    const accounts = props.accounts ?? []
    const chainId = props.chainId ?? null
    const isConnected = accounts.length > 0


    return <>
        <table className="table bg-white rounded border shadow-lg table-sm small">
            <thead>
            <tr>
                <th>Platform</th>
                <th>Farm Name</th>
                <th>LP Token</th>
                <th>APR</th>
                <th>APY</th>
                <th>TVL</th>
                <th>$</th>
                <th>Wallet</th>
                <th>Initial stake</th>
                <th>Current stake</th>
                <th>$</th>
            </tr>
            </thead>
            <tbody>
            {Object.keys(vaults).map((vaultKey) => {
                const vault = vaults[vaultKey]
                const farm = vault.farm
                const vaultChainId = vault.chain.chainId
                return vaultChainId === chainId ?
                    <VaultTableRow vault={vault} farm={farm} vaultKey={vaultKey} key={vaultKey}
                                   accounts={accounts}/> : null
            })}
            </tbody>
        </table>
    </>

}

function VaultTableRow(props) {
    let vault = props.vault
    let farm = props.farm
    let lp = farm.token

    let vaultKey = props.vaultKey
    let [accounts, setAccounts] = useState(props.accounts)

    let [tvl, setTvl] = useState()
    let [tvlUSD, setTvlUSD] = useState()
    let [wallet, setWallet] = useState()
    let [deposited, setDeposited] = useState()
    let [currentStake, setCurrentStake] = useState()
    let [apr, setApr] = useState()
    let [apy, setApy] = useState()
    let [currentStakeUSD, setCurrentStakeUSD] = useState()

    let [approved, setApproved] = useState(false)


    useEffect(async () => {
        const lpUsdPerToken = await lp.usdPerToken()
        const tvl = await vault.tvlPromise().then(r => web3.utils.fromWei(r.toString()))
        const tvlUSD = lpUsdPerToken * parseFloat(tvl)
        const walletBalance = await farm.token.balanceOfPromise().then(r => web3.utils.fromWei(r.toString()))
        const initialStake = await vault.depositedPromise().then(r => web3.utils.fromWei(r.toString()))
        const isApproved = await vault.isApprovedPromise().then(r => r)
        const currentStake = await vault.getPricePerFullSharePromise().then(r => web3.utils.fromWei(r.toString())) * initialStake
        const currentStakedUSD = currentStake * lpUsdPerToken
        const apr = null
        const apy = null

        setTvl(tvl)
        setTvlUSD(tvlUSD)
        setWallet(walletBalance)
        setDeposited(initialStake)
        setApproved(isApproved)
        setCurrentStake(currentStake)
        setCurrentStakeUSD(currentStakedUSD)
        // setApr()
        // setApy()




        console.log("lp.usdPerToken", await lp.usdPerToken())

    })

    return <tr key={vaultKey} className={""}>
        <td className={"fw-bolder"}><img loading={"lazy"} src={farm.platform.logo}
                                         alt={farm.platform.name + " logo"}
                                         title={farm.platform.name} height={24} width={24}/> {farm.platform.name}
        </td>
        <td>{farm.name}</td>
        <td>{farm.token.name}</td>
        <td>{apr ? apr + "%" : <Skeleton/>}</td>
        <td>{apy ? apy + "%" : <Skeleton/>}</td>
        <td>{tvl ? parseFloat(tvl).toFixed(4) : <Skeleton/>}</td>
        <td>{tvlUSD ? parseFloat(tvlUSD).toFixed(4) : <Skeleton/>}</td>
        <td>{wallet ? parseFloat(wallet).toFixed(4) : <Skeleton/>}</td>
        <td>{deposited ? parseFloat(deposited).toFixed(4) : <Skeleton/>}</td>
        <td>{currentStake ? parseFloat(currentStake).toFixed(4) : <Skeleton/>}</td>
        <td>{currentStakeUSD ? "$" + (parseFloat(currentStakeUSD).toFixed(2)) : <Skeleton/>}</td>
        <td>
            <button className="btn btn-sm btn-primary"
                    onClick={async () => vault.strategy.contract.functions.harvest()}>
                Compound
            </button>
        </td>
        <td>
            <button className="btn btn-sm btn-primary"
                    onClick={vault.withdrawAllPromise}>
                Withdraw
            </button>
        </td>
        { // Approval switch
            approved ? (
                <td>
                    <button className="btn btn-sm btn-primary"
                            onClick={vault.depositAllPromise}>
                        Deposit
                    </button>
                </td>
            ) : (
                <td>
                    <button className="btn btn-sm btn-light"
                            onClick={vault.approvePromise}>
                        Approve
                    </button>
                </td>
            )
        }
    </tr>
}


export default App;
