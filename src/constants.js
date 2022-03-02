import {AVALANCHE} from "./class/Chain";
import Platform from "./class/Platform";
import Token from "./class/Token";
import LP from "./class/LP";
import Farm from "./class/Farm";
import Strategy from "./class/Strategy";
import Vault from "./class/Vault";
import Exchange from "./class/Exchange";

export const chains = {
    avax: AVALANCHE,
}

export const platforms = {
    elk: new Platform("ELK", "https://4126527139-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-MW_PNk7A0t0ux_cdlkt%2F-MiWHF5mPB0N_QTE7e-j%2F-MiWHWQjSbekcPtPUdwV%2FElkLogo%20512x512.svg?alt=media&token=27da238a-7b85-4ea8-b1f0-8a67aeaf2049")
}

export const chainIds = {
    "0xa86a": "Avalanche"
}

export const exchanges = {
    elk: new Exchange("Elk Finance","0x9E4AAbd2B3E60Ee1322E94307d0776F2c8e6CFbb"),
}

export const tokens = {
    elk: new Token("Elk", "", "https://4126527139-files.gitbook.io/~/files/v0/b/gitbook-28427.appspot.com/o/assets%2F-MW_PNk7A0t0ux_cdlkt%2F-MiWHF5mPB0N_QTE7e-j%2F-MiWHWQjSbekcPtPUdwV%2FElkLogo%20512x512.svg?alt=media&token=27da238a-7b85-4ea8-b1f0-8a67aeaf2049", "elk-finance"),
    wavax: new Token("Wrapped Avalanche", "", "https://assets.coingecko.com/coins/images/15075/large/wrapped-avax.png?1629873618", "wrapped-avax"),
    usdte: new Token("USDT.e", "", "https://cryptologos.cc/logos/tether-usdt-logo.png", "tether"),
    usdce: new Token("USDC.e", "", "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", "usd-coin-avalanche-bridged-usdc-e"),
    teddy: new Token("Teddy", "", "https://cryptologos.net/logos/teddy.png", "teddy"),
    // elkPng: new LP("ELKPNGLP", "", ""),
    // elkDcau: new LP("ELKDCAULP", "", ""),
}

export const lps = {
    elkWavax: new LP(chains.avax, "ELK/WAVAX LP", "0x2612dA8fc26Efbca3cC3F8fD543BCBa72b10aB59", tokens.elk, tokens.wavax),
    elkUsdce: new LP(chains.avax, "ELK/USDCE LP", "0xd185c562306cb257a53c6b9d7287ebed9b1bb410", tokens.elk, tokens.usdce),
    elkTeddy: new LP(chains.avax, "ELK/TEDDY LP", "0xe01f050b99424053a65822628da79c896f3263bd", tokens.elk, tokens.teddy),
}

export const farms = {
    elkWavax: new Farm(chains.avax, "ELKWAVAX", "0x9ec3ca469F415a7e55A21Dc662D427d59e8De8F6", lps.elkWavax, platforms.elk, exchanges.elk),
    elkUsdce: new Farm(chains.avax, "ELKUSDC", "0xe935028DF3285D1852E11dAe384534d27887c196", lps.elkUsdce, platforms.elk, exchanges.elk),
    elkTeddy: new Farm(chains.avax, "ELKTEDDY", "0x51e07fF9C0F78F88b3c094a71d338d1681C3ad20", lps.elkTeddy, platforms.elk, exchanges.elk),
    // elkPng: new Farm("ELKPNG", tokens.elkPng, platforms.elk),
    // elkDcau: new Farm("ELKDCAU", tokens.elkDcau, platforms.elk),
}

export const strategies = {
    elkWavax: new Strategy(chains.avax,"ELKWAVAX", "0xb90cFF851899C56f10Da6125EE790004e3eeC426", exchanges.elk),
    elkUsdce: new Strategy(chains.avax,"ELKUSDCE", "0x72eADD8BBE9d3076e7F108641bB92b3b8078D96D", exchanges.elk),
    elkTeddy: new Strategy(chains.avax,"ELKTEDDY", "0xE920C406CbB5C277d6508F52a07E3849E0b9Ffde", exchanges.elk),
}

export const vaults = {
    elkWavax: new Vault(chains.avax, platforms.elk, farms.elkWavax, "0xd1b524ee1d1278b4770c5d6c97Cf70D3F73358a6", strategies.elkWavax),
    elkUsdce: new Vault(chains.avax, platforms.elk, farms.elkUsdce, "0x91590A3733F80f7646264B03738e810815Ba30eC", strategies.elkUsdce),
    elkTeddy: new Vault(chains.avax, platforms.elk, farms.elkTeddy, "0x5aEd6C2c6d85C9013EeB189D6B393f4898d1ba55", strategies.elkTeddy),
    // elkPolygon: new Vault(chains.matic, platforms.elk, farms.elkWavax, "0xd1b524ee1d1278b4770c5d6c97Cf70D3F73358a6", strategies.elkWavax)
}

