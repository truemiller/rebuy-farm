import logo from './logo.svg'
import {Fragment, useEffect, useState} from "react"
import "./css/bootstrap.css"
import "./css/App.css"

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import web3 from "web3"

import Metamask from "./class/Metamask"
import {chainIds, vaults} from "./constants/constants";

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
                <div className="d-flex flex-column vh-100">
                    <Navbar chainId={chainId} accounts={accounts}/>
                    <main className="container mt-3">
                        <header id="hero" className="text-center">
                            <h1 className={"fw-bolder text-light display-1"}>Rebuy Farm</h1>
                            <p className={"lead text-white-50"}>The cross chain yield optimizer</p>
                        </header>
                        <section className="row mb-3">
                            <div className="col-md-3"/>
                            <div className="col-md-6">
                                <input type="text" className="form-control mb-3 shadow-lg" placeholder={"Search"}
                                       onChange={event => setQuery(event.target.value)}/>
                            </div>
                        </section>
                        <section>
                            <VaultTable accounts={accounts} chainId={chainId} query={query}/>
                        </section>
                    </main>
                    <footer className="footer bg-gradient mt-auto">
                        <div className="navbar">
                            <div className="container">
                            <span className="text-white-50">&copy; <a href="//truemiller.com"
                                                                      className={"text-decoration-none"}>True Miller</a> 2021. All rights reserved. This dApp (decentralized application) is in beta, use at your own risk. Smart contracts are experimental. Contact us <a
                                href="//t.me/truemiller1">here</a>.</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </Fragment>
            :
            <>
                <Navbar/>
                <header id="hero" className="text-center">
                    <h1 className={"fw-bolder text-light display-1"}>Rebuy Farm</h1>
                    <p className={"lead text-white-50"}>The cross chain yield optimizer</p>
                </header>
                <div className={"d-flex align-items-center justify-content-center"}>
                    <div className="card">
                        <div className="card-body">
                            <a href="#" className="btn btn-primary" onClick={() => {
                                window?.ethereum?.request({method: 'eth_requestAccounts'})
                                window?.ethereum?.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{chainId: '0xa86a'}], // chainId must be in hexadecimal numbers})
                                })
                            }
                            }>Connect to Metamask</a>
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
                <a href={""}
                   className="nav-link text-white">{accounts && chainIds[chainId] ? `Connected to ${chainIds[chainId]}` : "Not connected"}</a>
            </div>
        </div>
    </nav>
}

function VaultTable(props) {
    const accounts = props.accounts ?? []
    const chainId = props.chainId ?? null
    const query = props.query
    const vaultArray = Object.keys(vaults).map(vaultKey => vaults[vaultKey])
        .filter(vault => vault.chain.chainId === chainId)
        .filter(vault => {
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
                        <div className={"col-xl-12 mb-3"} key={vault.address}>
                            <VaultTableRow vault={vault} farm={farm} accounts={accounts}/>
                        </div>
                    ) : null
                })
                :
                <>
                    <div className="alert alert-danger" role="alert">
                        There aren't any farms! Try using <a href="#" onClick={() =>
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

    let [lpUsd, setLpUsd] = useState(0)
    let [tvl, setTvl] = useState(0)
    let [tvlUSD, setTvlUSD] = useState(0)
    let [wallet, setWallet] = useState(0)
    let [walletUsd, setWalletUsd] = useState(0)
    let [deposited, setDeposited] = useState(0)
    let [currentStake, setCurrentStake] = useState(0)
    let [apr, setApr] = useState(0)
    let [apy, setApy] = useState(0)
    let [currentStakeUSD, setCurrentStakeUSD] = useState(0)
    let [rewards, setRewards] = useState(0)

    let [expanded, setExpanded] = useState(false)
    let [approved, setApproved] = useState(false)


    useEffect(async () => {

        // const apr = await farm?.aprPromise()
        // let tvl = await vault?.tvlPromise()
        // setTvl(web3.utils.fromWei(tvl.toString()))
        // debugger
        // let lpUsdPerToken = await lp.usdPerToken()
        //
        // const walletBalance = await farm.token.balanceOfPromise().then(r => web3.utils.fromWei(r.toString()))
        // const initialStake = await vault.depositedPromise().then(r => web3.utils.fromWei(r.toString()))
        // // const currentStake = await vault.getPricePerFullSharePromise().then(r => web3.utils.fromWei(r.toString())) * initialStake

        const [apr, tvl, lpUsdPerToken, walletBalance, initialStake] = await Promise.all([
            farm?.aprPromise(), //apr
            vault.tvlPromise(),
            lp.usdPerToken(), //usdpertoken
            farm.token.balanceOfPromise(),
            vault.depositedPromise(),
        ])
        const apy = (((1 + (apr / 100 / 365)) ** 365) - 1) * 100

        // const currentStake = await vault.getPricePerFullSharePromise().then(r => web3.utils.fromWei(r.toString())) * initialStake

        const tvlUSD = parseFloat(lpUsdPerToken) * parseFloat(web3.utils.fromWei(`${tvl}`))
        const currentStakedUSD = currentStake * lpUsdPerToken
        setApr(apr)
        setApy(apy)
        setTvl(web3.utils.fromWei(`${tvl}`))
        setLpUsd(lpUsdPerToken)
        setTvlUSD(tvlUSD)
        setWallet(web3.utils.fromWei(`${walletBalance}`))
        setDeposited(web3.utils.fromWei(`${initialStake}`))
        setCurrentStake(currentStake)
        setCurrentStakeUSD(currentStakedUSD)

    }, [])

    useEffect(async () => {
        if (expanded) {
            const isApproved = await vault.isApprovedPromise()
            setApproved(isApproved)
            const rewards = await vault.strategy.rewardsAvailablePromise().then(r => r)
            setRewards(rewards)
            setWalletUsd(wallet * lpUsd)
        }
    }, [expanded])

    return <div key={vaultKey} className={"card border shadow-lg"}>
        <div className={"card-body d-flex justify-content-between"}>
            <div className={"text-center d-flex mt-auto mb-auto"}>
                <img loading={"lazy"} src={farm.token.token0.image}
                     alt={farm.platform.name + " logo"}
                     title={farm.platform.name} height={24} width={24}/>
                {!farm.token.isSingle ?
                    <img loading={"lazy"}
                         src={farm.token.token1.image}
                         alt={farm.platform.name + " logo"}
                         title={farm.platform.name}
                         className={"rounded-circle"}
                         height={24} width={24}/> : null}
            </div>
            <div className="d-flex flex-column align-self-start">
                <strong>{farm.name}</strong>
                <strong className={"fw-bolder d-inline-block"}>
                    <a className={"text-decoration-none text-truncate"}
                       href={farm.exchange.url}>{farm.exchange.name}</a></strong>
            </div>
            <div className="d-flex flex-column text-center">
                {parseFloat(wallet).toFixed(4)}
                <strong>Balance</strong>
            </div>
            <div className="d-flex flex-column text-center">
                {parseFloat(deposited).toFixed(4)}
                <strong>Deposited</strong>
            </div>
            <div className="d-flex flex-column text-center">
                {apy ? apy.toFixed(2) : <Skeleton/>}%
                <strong>APY</strong>
            </div>
            <div className="d-flex flex-column text-center">
                {apy ? (apy / 365).toFixed(2) : <Skeleton/>}%
                <strong>Daily</strong>
            </div>
            <div className="d-flex flex-column text-center">
                ${tvlUSD != null ? tvlUSD.toFixed(2).toLocaleString() : <Skeleton/>}
                <strong>TVL</strong>
            </div>
            <div className="d-flex flex-column text-center align-self-end">
                <a href="#" className="btn btn-dark btn-lg" onClick={() => setExpanded(!expanded)}>More</a>
            </div>
        </div>
        {
            expanded ?
                <div className="card-footer">
                    {vault.note ? <div className={"alert alert-info"}>{vault.note}</div> : null}
                    <div className="row">
                        <div className="col-md-4 d-flex flex-column">
                            <h3>Wallet</h3>
                            <span className={"mb-3"}>
                            <strong>Balance</strong>: {wallet} (${wallet})
                            </span>
                            { // Approval switch
                                approved ? (
                                    <button className="btn btn-lg btn-dark"
                                            onClick={vault.depositAllPromise}>
                                        Deposit
                                    </button>
                                ) : (
                                    <button className="btn btn-lg btn-danger"
                                            onClick={vault.approvePromise}>
                                        Approve
                                    </button>
                                )
                            }
                        </div>
                        <div className="col-md-4 d-flex flex-column">
                            <h3>Vault</h3>
                            <span className={"mb-3"}>
                            <strong>Deposited</strong>: {currentStake != null ? currentStake.toFixed(4) : 0} (${currentStakeUSD ? currentStakeUSD.toFixed(4) : 0})
                            </span>
                            <button className="btn btn-lg btn-dark"
                                    onClick={vault.withdrawAllPromise}>
                                Withdraw
                            </button>
                        </div>
                        <div className="col-md-4 d-flex flex-column">
                            <h3>Pending</h3>
                            <span className={"mb-3"}>
                                <strong>Rewards</strong>: {rewards ? rewards : <Skeleton/>}
                            </span>
                            <button className="btn btn-lg btn-success"
                                    onClick={async () => vault.harvestPromise()}>
                                Compound
                            </button>

                        </div>
                    </div>
                    <hr/>
                    <table className={"table table-sm table-bordered"}>
                        <tbody>
                        <tr>
                            <th>APR</th>
                            <td>{apr != null ? parseFloat(apr).toFixed(4) : <Skeleton/>}</td>
                        </tr>
                        <tr>
                            <th>APY</th>
                            <td>{apy != null ? parseFloat(apy).toFixed(4) : <Skeleton/>}</td>
                        </tr>

                        <tr>
                            <th>TVL</th>
                            <td>{tvl != null ? parseFloat(tvl).toFixed(4) : <Skeleton/>}</td>
                        </tr>
                        <tr>
                            <th>TVL ($)</th>
                            <td>{tvlUSD != null ? parseFloat(tvlUSD).toFixed(0) : <Skeleton/>}</td>
                        </tr>
                        <tr>
                            <th>Wallet Balance</th>
                            <td>{wallet != null ? parseFloat(wallet).toPrecision(4) : <Skeleton/>}</td>
                        </tr>
                        {/*<tr>*/}
                        {/*    <th>Deposited</th>*/}
                        {/*    <td>{deposited ? parseFloat(deposited).toFixed(4) :*/}
                        {/*        <Skeleton/>}</td>*/}
                        {/*</tr>*/}
                        <tr>

                            <th>Current stake</th>
                            <td>{currentStake != null ? parseFloat(currentStake).toFixed(4) :
                                <Skeleton/>}</td>
                        </tr>
                        <tr>
                            <th>Current stake ($)</th>
                            <td>{currentStakeUSD != null ? (parseFloat(currentStakeUSD).toFixed(0)) : <Skeleton/>}</td>
                        </tr>
                        <tr>
                            <th>Awaiting compound</th>
                            <td>{rewards != null ? (parseFloat(rewards).toPrecision(4)) : <Skeleton/>}</td>
                        </tr>
                        </tbody>
                    </table>
                </div> : null
        }
    </div>
}


export default App;
