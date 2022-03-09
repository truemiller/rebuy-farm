import Chain, {AVALANCHE, MATIC} from "../class/Chain";
import Platform from "../class/Platform";
import Token from "../class/Token";
import LP from "../class/LP";
import Farm, {FarmChef} from "../class/Farm";
import Strategy from "../class/Strategy";
import Vault from "../class/Vault";
import Exchange from "../class/Exchange";

export const chains = {
    avax: new Chain("Avalanche", "0xa86a", "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", "https://api.avax.network/ext/bc/C/rpc", 1),
    matic: new Chain("Polygon", "0x89", "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "https://rpc.ankr.com/polygon", 1),
}

export const chainIds = {
    "0xa86a": "Avalanche",
    "0x89": "Polygon"
}

export const platforms = {
    elk: new Platform("ELK", "https://4126527139-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-MW_PNk7A0t0ux_cdlkt%2F-MiWHF5mPB0N_QTE7e-j%2F-MiWHWQjSbekcPtPUdwV%2FElkLogo%20512x512.svg?alt=media&token=27da238a-7b85-4ea8-b1f0-8a67aeaf2049"),
    joe: new Platform("JOE", "")
}

export const exchanges = {
    elk: new Exchange(chains.avax, "Elk Finance","0x9E4AAbd2B3E60Ee1322E94307d0776F2c8e6CFbb", "//elk.finance"),
    maticElk: new Exchange(chains.matic, "Elk Finance","0xf38a7A7Ac2D745E2204c13F824c00139DF831FFf", "//elk.finance"),
    joe: new Exchange(chains.avax, "Trader Joe", "0x60aE616a2155Ee3d9A68541Ba4544862310933d4", "//traderjoexyz.com")
}

export const tokens = {
    elk: new Token("Elk", "", "https://4126527139-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-MW_PNk7A0t0ux_cdlkt%2F-MiWHF5mPB0N_QTE7e-j%2F-MiWHWQjSbekcPtPUdwV%2FElkLogo%20512x512.svg?alt=media&token=27da238a-7b85-4ea8-b1f0-8a67aeaf2049", "elk-finance"),
    wavax: new Token("Wrapped Avalanche", "", "https://assets.coingecko.com/coins/images/15075/large/wrapped-avax.png?1629873618", "wrapped-avax"),
    ave: new Token("AVE", "", "https://raw.githubusercontent.com/elkfinance/tokens/main/logos/all/0x78ea17559B3D2CF85a7F9C2C704eda119Db5E6dE/logo.png", "avaware"),
    usdte: new Token("USDT.e", "", "https://cryptologos.cc/logos/tether-usdt-logo.png", "tether"),
    ust: new Token("UST", "", "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x260Bbf5698121EB85e7a74f2E45E16Ce762EbE11/logo.png", "terra-usd"),
    usdce: new Token("USDC.e", "", "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", "usd-coin-avalanche-bridged-usdc-e"),
    teddy: new Token("Teddy", "", "https://cryptologos.net/logos/teddy.png", "teddy"),
    matic: new Token("Matic", "", "https://cryptologos.cc/logos/polygon-matic-logo.png", "wmatic"),
    avme: new Token("AVME", "", "https://raw.githubusercontent.com/elkfinance/tokens/main/logos/avax/0x1ECd47FF4d9598f89721A2866BFEb99505a413Ed/logo.png", "avme"),
    vso: new Token("VSO", "", "https://raw.githubusercontent.com/elkfinance/tokens/main/logos/all/0x846D50248BAf8b7ceAA9d9B53BFd12d7D7FBB25a/logo.png", "verso"),
    png: new Token("PNG", "", "https://raw.githubusercontent.com/elkfinance/tokens/main/logos/all/0x60781C2586D68229fde47564546784ab3fACA982/logo.png", "pangolin")
    // elkPng: new LP("ELKPNGLP", "", ""),
    // elkDcau: new LP("ELKDCAULP", "", ""),
}

export const lps = {
    // avalanche
    /// elk
    elkWavax: new LP(chains.avax, "ELK/WAVAX LP", "0x2612dA8fc26Efbca3cC3F8fD543BCBa72b10aB59", tokens.elk, tokens.wavax, exchanges.elk, false),
    elkAve: new LP(chains.avax, "ELK/AVE LP", "0x70aC8E9F324800e7f20B31EceA9210E0D2B4B4b9", tokens.elk, tokens.ave, exchanges.elk, false),
    elkUsdce: new LP(chains.avax, "ELK/USDCE LP", "0xd185c562306cb257a53c6b9d7287ebed9b1bb410", tokens.elk, tokens.usdce, exchanges.elk, false),
    elkTeddy: new LP(chains.avax, "ELK/TEDDY LP", "0xe01f050b99424053a65822628da79c896f3263bd", tokens.elk, tokens.teddy, exchanges.elk, false),
    elkPng: new LP(chains.avax, "ELK/PNG LP", "0x8ea0328052F094E8136cA91faB08d07DDbb1366f", tokens.elk, tokens.png, exchanges.elk, false),
    elkElk: new LP(chains.avax, "ELK/ELK LP", "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C", tokens.elk, tokens.elk, exchanges.elk, true),
    /// joe
    ustUsdce: new LP(chains.avax, "UST/USDC.E JLP", "0xA3A029224857bF467E896523E268a5fc005Ce810", tokens.ust, tokens.usdce, exchanges.joe, false),
    // matic
    maticElkElk: new LP(chains.matic, "ELK/ELK LP", "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C", tokens.elk, tokens.elk, exchanges.maticElk, true),
    maticElkMatic: new LP(chains.matic, "ELK/ELK LP", "0x7Cb0703aa37601a02798BDFF63A18aF2dD082572", tokens.elk, tokens.matic, exchanges.maticElk, false),
}

export const farms = {
    // avalanche
    /// elk
    elkWavax: new Farm(chains.avax, "ELKWAVAX", "0x9ec3ca469F415a7e55A21Dc662D427d59e8De8F6", lps.elkWavax, platforms.elk, exchanges.elk),
    elkAve: new Farm(chains.avax, "ELKAVE", "0xa4F5447cE95Fe4Cdb7eCD023d6Ea0274b85A27fF", lps.elkAve, platforms.elk, exchanges.elk),
    elkUsdce: new Farm(chains.avax, "ELKUSDC", "0xe935028DF3285D1852E11dAe384534d27887c196", lps.elkUsdce, platforms.elk, exchanges.elk),
    elkTeddy: new Farm(chains.avax, "ELKTEDDY", "0x51e07fF9C0F78F88b3c094a71d338d1681C3ad20", lps.elkTeddy, platforms.elk, exchanges.elk),
    elkPng: new Farm(chains.avax, "ELKPNG", "0xcF025C16C9cD72EEBf0513A1ed8f588F99d1Bcd9", lps.elkPng, platforms.elk, exchanges.elk),
    elkElk: new Farm(chains.avax, "ELK SINGLE", "0xB105D4D17a09397960f2678526A4063A64FAd9bd", lps.elkElk, platforms.elk, exchanges.elk),
    /// joe
    ustUsdce: new FarmChef(chains.avax, "USTUSDCE", "0x188bed1968b795d5c9022f6a0bb5931ac4c18f00", lps.ustUsdce, platforms.elk, exchanges.joe, 49),
    // matic
    /// elk
    maticElkElk: new Farm(chains.matic, "ELK SINGLE", "0xB8CBce256a713228F690AC36B6A0953EEd58b957", lps.maticElkElk, platforms.elk, exchanges.maticElk),
    maticElkMatic: new Farm(chains.matic, "ELKMATIC", "0xEcC036390479B26D7aA10ba3F685204651Fb0887", lps.maticElkMatic, platforms.elk, exchanges.maticElk),
    // elkPng: new Farm("ELKPNG", tokens.elkPng, platforms.elk),
    // elkDcau: new Farm("ELKDCAU", tokens.elkDcau, platforms.elk),
}

export const strategies = {
    // avalanche
    /// elk
    elkWavax: new Strategy(chains.avax,"ELKWAVAX", "0xb90cFF851899C56f10Da6125EE790004e3eeC426", exchanges.elk),
    elkUsdce: new Strategy(chains.avax,"ELKUSDCE", "0x72eADD8BBE9d3076e7F108641bB92b3b8078D96D", exchanges.elk),
    elkPng: new Strategy(chains.avax,"ELKPNG", "0x5F1E13f6559242c49a2d00DeF366BdA178275e94", exchanges.elk),
    elkTeddy: new Strategy(chains.avax,"ELKTEDDY", "0xE920C406CbB5C277d6508F52a07E3849E0b9Ffde", exchanges.elk),
    elkAve: new Strategy(chains.avax,"ELKAVE", "0x9E5eA997b8a6576244a6F34693f17E328F761c32", exchanges.elk),
    elkElk: new Strategy(chains.avax,"ELKELK", "0xaDe4ABb9bca47Fe28d095Ad7Ed7ce4f1Cc3496a4", exchanges.elk),
    /// joe
    ustUsdce: new Farm(chains.avax, "USTUSDCE", "0x4779e452E7E136b566c46b94B3E01195c32f5BD8", exchanges.joe),
    // matic
    /// elk
    maticElkElk: new Strategy(chains.matic,"ELKELK", "0x687B9268C0b7247C23a8D9DCB8B2149cD3bD2e09", exchanges.maticElk),
    maticElkMatic: new Strategy(chains.matic,"ELKMATIC", "0x08C2FAE0C357CdDa4df7F877b4A05e865dFCBc3f", exchanges.maticElk),
}

export const vaults = {
    //avalanche
    ///elk
    elkWavax: new Vault(chains.avax, platforms.elk, farms.elkWavax, "0xd1b524ee1d1278b4770c5d6c97Cf70D3F73358a6", strategies.elkWavax, "This vault claims impermanent loss protection."),
    elkUsdce: new Vault(chains.avax, platforms.elk, farms.elkUsdce, "0x91590A3733F80f7646264B03738e810815Ba30eC", strategies.elkUsdce, "This vault claims impermanent loss protection."),
    elkPng: new Vault(chains.avax, platforms.elk, farms.elkPng, "0x256B3DffB808f76560ad01415e113e0FC7d0De62", strategies.elkPng, "This vault claims impermanent loss protection."),
    elkAve: new Vault(chains.avax, platforms.elk, farms.elkAve, "0xc828B1BB82324C957E9ff14fCA68ABDeF3192e8f", strategies.elkAve, "This vault claims impermanent loss protection."),
    elkTeddy: new Vault(chains.avax, platforms.elk, farms.elkTeddy, "0x5aEd6C2c6d85C9013EeB189D6B393f4898d1ba55", strategies.elkTeddy, "This vault claims impermanent loss protection and dual rewards."),
    elkElk: new Vault(chains.avax, platforms.elk, farms.elkElk, "0x33CC0b0Fc80aB6e25BBAf9E0c8a0d87E32c8a18A", strategies.elkElk, "This vault charges upto 5% for withdrawals."),
    ///joe
    // ustUsdce: new Vault(chains.avax, platforms.joe, farms.ustUsdce, "0x8523f2845d4aAd53c41921E43F8dd77041c1F365", strategies.ustUsdce, ""),
    //matic
    maticElkElk: new Vault(chains.matic, platforms.elk, farms.maticElkElk, "0x53d199b5bbe51563f116FDF58b2a3d12d51008d7", strategies.maticElkElk, "This vault charges upto 5% for withdrawals."),
    maticElkMatic: new Vault(chains.matic, platforms.elk, farms.maticElkMatic, "0xfe786197D8deb678900D7687c704021A2A9340Fc", strategies.maticElkMatic, "This vault charges upto 5% for withdrawals."),
}

