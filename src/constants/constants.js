import Chain, {AVALANCHE, MATIC} from "../class/Chain";
import Platform from "../class/Platform";
import Token from "../class/Token";
import LP from "../class/LP";
import Farm from "../class/Farm";
import Strategy from "../class/Strategy";
import Vault from "../class/Vault";
import Exchange from "../class/Exchange";

export const chains = {
    avax: new Chain("Avalanche", "0xa86a", "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", "https://rpc.ankr.com/avalanche", 1),
    matic: new Chain("Polygon", "0x89", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "https://rpc.ankr.com/polygon", 1),
}

export const chainIds = {
    "0xa86a": "Avalanche",
    "0x89": "Polygon"
}

export const platforms = {
    elk: new Platform("ELK", "https://4126527139-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-MW_PNk7A0t0ux_cdlkt%2F-MiWHF5mPB0N_QTE7e-j%2F-MiWHWQjSbekcPtPUdwV%2FElkLogo%20512x512.svg?alt=media&token=27da238a-7b85-4ea8-b1f0-8a67aeaf2049")
}

export const exchanges = {
    elk: new Exchange(chains.avax, "Elk Finance","0x9E4AAbd2B3E60Ee1322E94307d0776F2c8e6CFbb", "//elk.finance"),
    maticElk: new Exchange(chains.matic, "Elk Finance","0xf38a7A7Ac2D745E2204c13F824c00139DF831FFf", "//elk.finance"),
}

export const tokens = {
    elk: new Token("Elk", "", "https://4126527139-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-MW_PNk7A0t0ux_cdlkt%2F-MiWHF5mPB0N_QTE7e-j%2F-MiWHWQjSbekcPtPUdwV%2FElkLogo%20512x512.svg?alt=media&token=27da238a-7b85-4ea8-b1f0-8a67aeaf2049", "elk-finance"),
    wavax: new Token("Wrapped Avalanche", "", "https://assets.coingecko.com/coins/images/15075/large/wrapped-avax.png?1629873618", "wrapped-avax"),
    usdte: new Token("USDT.e", "", "https://cryptologos.cc/logos/tether-usdt-logo.png", "tether"),
    usdce: new Token("USDC.e", "", "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", "usd-coin-avalanche-bridged-usdc-e"),
    teddy: new Token("Teddy", "", "https://cryptologos.net/logos/teddy.png", "teddy"),
    matic: new Token("Matic", "", "https://cryptologos.cc/logos/polygon-matic-logo.png", "wmatic")
    // elkPng: new LP("ELKPNGLP", "", ""),
    // elkDcau: new LP("ELKDCAULP", "", ""),
}

export const lps = {
    elkWavax: new LP(chains.avax, "ELK/WAVAX LP", "0x2612dA8fc26Efbca3cC3F8fD543BCBa72b10aB59", tokens.elk, tokens.wavax, exchanges.elk, false),
    elkUsdce: new LP(chains.avax, "ELK/USDCE LP", "0xd185c562306cb257a53c6b9d7287ebed9b1bb410", tokens.elk, tokens.usdce, exchanges.elk, false),
    elkTeddy: new LP(chains.avax, "ELK/TEDDY LP", "0xe01f050b99424053a65822628da79c896f3263bd", tokens.elk, tokens.teddy, exchanges.elk, false),
    elkElk: new LP(chains.avax, "ELK/ELK LP", "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C", tokens.elk, tokens.elk, exchanges.elk, true),
    maticElkElk: new LP(chains.matic, "ELK/ELK LP", "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C", tokens.elk, tokens.elk, exchanges.maticElk, true),
    maticElkMatic: new LP(chains.matic, "ELK/ELK LP", "0x7Cb0703aa37601a02798BDFF63A18aF2dD082572", tokens.elk, tokens.matic, exchanges.maticElk, false),
}

export const farms = {
    elkWavax: new Farm(chains.avax, "ELKWAVAX", "0x9ec3ca469F415a7e55A21Dc662D427d59e8De8F6", lps.elkWavax, platforms.elk, exchanges.elk),
    elkUsdce: new Farm(chains.avax, "ELKUSDC", "0xe935028DF3285D1852E11dAe384534d27887c196", lps.elkUsdce, platforms.elk, exchanges.elk),
    elkTeddy: new Farm(chains.avax, "ELKTEDDY", "0x51e07fF9C0F78F88b3c094a71d338d1681C3ad20", lps.elkTeddy, platforms.elk, exchanges.elk),
    elkElk: new Farm(chains.avax, "ELK SINGLE", "0xB105D4D17a09397960f2678526A4063A64FAd9bd", lps.elkElk, platforms.elk, exchanges.elk),
    maticElkElk: new Farm(chains.matic, "ELK SINGLE", "0xB8CBce256a713228F690AC36B6A0953EEd58b957", lps.maticElkElk, platforms.elk, exchanges.maticElk),
    maticElkMatic: new Farm(chains.matic, "ELKMATIC", "0xEcC036390479B26D7aA10ba3F685204651Fb0887", lps.maticElkMatic, platforms.elk, exchanges.maticElk),
    // elkPng: new Farm("ELKPNG", tokens.elkPng, platforms.elk),
    // elkDcau: new Farm("ELKDCAU", tokens.elkDcau, platforms.elk),
}


export const strategies = {
    elkWavax: new Strategy(chains.avax,"ELKWAVAX", "0xb90cFF851899C56f10Da6125EE790004e3eeC426", exchanges.elk),
    elkUsdce: new Strategy(chains.avax,"ELKUSDCE", "0x72eADD8BBE9d3076e7F108641bB92b3b8078D96D", exchanges.elk),
    elkTeddy: new Strategy(chains.avax,"ELKTEDDY", "0xE920C406CbB5C277d6508F52a07E3849E0b9Ffde", exchanges.elk),
    elkElk: new Strategy(chains.avax,"ELKELK", "0xaDe4ABb9bca47Fe28d095Ad7Ed7ce4f1Cc3496a4", exchanges.elk),
    maticElkElk: new Strategy(chains.matic,"ELKELK", "0x687B9268C0b7247C23a8D9DCB8B2149cD3bD2e09", exchanges.maticElk),
    maticElkMatic: new Strategy(chains.matic,"ELKMATIC", "0x08C2FAE0C357CdDa4df7F877b4A05e865dFCBc3f", exchanges.maticElk),
}

export const vaults = {
    elkWavax: new Vault(chains.avax, platforms.elk, farms.elkWavax, "0xd1b524ee1d1278b4770c5d6c97Cf70D3F73358a6", strategies.elkWavax, "This vault claims impermanent loss protection."),
    elkUsdce: new Vault(chains.avax, platforms.elk, farms.elkUsdce, "0x91590A3733F80f7646264B03738e810815Ba30eC", strategies.elkUsdce, "This vault claims impermanent loss protection."),
    elkTeddy: new Vault(chains.avax, platforms.elk, farms.elkTeddy, "0x5aEd6C2c6d85C9013EeB189D6B393f4898d1ba55", strategies.elkTeddy, "This vault claims impermanent loss protection and dual rewards."),
    elkElk: new Vault(chains.avax, platforms.elk, farms.elkElk, "0x33CC0b0Fc80aB6e25BBAf9E0c8a0d87E32c8a18A", strategies.elkElk, "This vault charges upto 5% for withdrawals."),
    maticElkElk: new Vault(chains.matic, platforms.elk, farms.maticElkElk, "0x53d199b5bbe51563f116FDF58b2a3d12d51008d7", strategies.maticElkElk, "This vault charges upto 5% for withdrawals."),
    maticElkMatic: new Vault(chains.matic, platforms.elk, farms.maticElkMatic, "0xfe786197D8deb678900D7687c704021A2A9340Fc", strategies.maticElkMatic, "This vault charges upto 5% for withdrawals."),
    // elkPolygon: new Vault(chains.matic, platforms.elk, farms.elkWavax, "0xd1b524ee1d1278b4770c5d6c97Cf70D3F73358a6", strategies.elkWavax)
}

