import logo from './logo.svg'
import {Fragment, useEffect, useState} from "react"
import "./css/bootstrap.css"
import "./css/App.css"

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import web3 from "web3"

import Metamask from "./class/Metamask"
import {chainIds, vaults} from "./constants";

function App() {
    const [chainId, setChainId] = useState("")
    const [accounts, setAccounts] = useState([])
    const [query, setQuery] = useState("")

    useEffect(async () => {
        setAccounts(await Metamask.address())
        setChainId(await Metamask.chainId())
    }, [])

    window.ethereum.on("accountsChanged", () => window.location.reload())
    window.ethereum.on("chainChanged", () => window.location.reload())

    return (
        accounts && chainId ?
            <Fragment>
                <Navbar chainId={chainId} accounts={accounts}/>
                <div className="container mt-3">
                    <div id="hero" className="text-center">
                        <h1 className={"fw-bolder text-light display-1"}>Rebuy Farm</h1>
                        <p className={"lead text-white-50"}>The cross chain yield optimizer</p>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <input type="text" className="form-control mb-3 shadow-lg" placeholder={"Search"} onChange={event=>setQuery(event.target.value)}/></div>
                    </div>
                    <VaultTable accounts={accounts} chainId={chainId} query={query}/>
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


    return <nav className="navbar navbar-dark bg-gradient shadow">
        <div className="container">
            <div className="d-flex align-self-start">
                <a href="/" className="navbar-brand fw-bolder">Rebuy Farm</a>
                <a href="//t.me/rebuyfarm" className="nav-link text-white">Telegram</a>
                <a href="//twitter.com/rebuyfarm" className="nav-link text-white">Twitter</a>
            </div>
            <div className={"d-flex"}>
                <a href={""} className="nav-link text-white">{accounts && chainIds[chainId]? `Connected to ${chainIds[chainId]}` : "Not connected"}</a>
            </div>
        </div>
    </nav>
}

function VaultTable(props) {
    const accounts = props.accounts ?? []
    const chainId = props.chainId ?? null
    const query = props.query
    const isConnected = accounts.length > 0
    const vaultArray = Object.keys(vaults).map(vaultKey => vaults[vaultKey])
        .filter(vault=>vault.chain.chainId === chainId)
        .filter(vault=>{
            const lowerCaseQuery = query.toLowerCase()
            const platformName = vault.platform.name.toLowerCase()
            const strategyName = vault.strategy.name.toLowerCase()
            const farmName = vault.farm.name.toLowerCase()
            const exchangeName = vault.farm.exchange.name.toLowerCase()
            return platformName.includes(lowerCaseQuery) ||
                strategyName.includes(lowerCaseQuery) ||
                farmName.includes(lowerCaseQuery) ||
                exchangeName.includes(lowerCaseQuery)
        })

    return <div className={"row"}>
        {
            vaultArray.length > 0 ?
            vaultArray.map(vault => {
                const farm = vault.farm
                const vaultChainId = vault.chain.chainId
                return vaultChainId === chainId ? (
                    <div className={"col-xl-4 col-lg-4 col-md-6 mb-3"} key={vault.address}>
                        <VaultTableRow vault={vault} farm={farm} accounts={accounts}/>
                    </div>
                ) : null
            })
                :
                <>
                    <div className="alert alert-danger" role="alert">
                        There aren't any farms! Try using <a href="#" onClick={()=>
                        window?.ethereum?.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{chainId: '0xa86a'}], // chainId must be in hexadecimal numbers})
                        })}>Avalanche</a> or update your search query.
                    </div>
                </>
        }
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
        const isApproved =  await vault.isApprovedPromise()
        setApproved(isApproved)

        const apr = await farm?.aprPromise()
        setApr(apr)
        const apy = (((1 + (apr / 100 / 365)) ** 365) - 1) * 100
        setApy(apy)
        const tvl = await vault.tvlPromise().then(r => web3.utils.fromWei(r.toString()))
        setTvl(tvl)
        let lpUsdPerToken = 0
        try {
            lpUsdPerToken = await lp.usdPerToken()
        } catch (e) {

        }
        const rewards = await vault.strategy.rewardsAvailablePromise().then(r => r)
        const tvlUSD = parseFloat(lpUsdPerToken) * parseFloat(tvl)
        setTvlUSD(tvlUSD)
        const walletBalance = await farm.token.balanceOfPromise().then(r => web3.utils.fromWei(r.toString()))
        setWallet(walletBalance)
        const initialStake = await vault.depositedPromise().then(r => web3.utils.fromWei(r.toString()))
        setDeposited(initialStake)
        const currentStake = await vault.getPricePerFullSharePromise().then(r => web3.utils.fromWei(r.toString())) * initialStake
        setCurrentStake(currentStake)
        const currentStakedUSD = currentStake * lpUsdPerToken
        setCurrentStakeUSD(currentStakedUSD)
        setRewards(rewards)


    }, [])

    console.log(vault.note)

    return <div key={vaultKey} className={"card border shadow-lg"}>
        <div className={"card-body"}>
            <div className={"fw-bolder text-center"}>
                <h2 className={"fw-bolder"}><a className={"text-decoration-none"} href={farm.exchange.url}>{farm.exchange.name}</a></h2>
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
                {vault.note ? <div className={"alert alert-info"}>{vault.note}</div> : null }
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
                {/*<tr>*/}
                {/*    <th>Deposited</th>*/}
                {/*    <td>{deposited ? parseFloat(deposited).toFixed(4) :*/}
                {/*        <Skeleton/>}</td>*/}
                {/*</tr>*/}
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
                    <th>Awaiting compound</th>
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
