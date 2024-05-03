import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATEKEY = process.env.METACHAT_ACCOUNT;
const TESTNET_URL = process.env.AVAX_TEST_URL;
const MAINNET_URL = process.env.AVAS_MAINNET_URL;

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {},
};

if (TESTNET_URL) {
  config.networks!.testnet = {
    url: TESTNET_URL,
    accounts: [PRIVATEKEY!],
  };
}

export default config;
