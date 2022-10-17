import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "dotenv/config";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL as string;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY as string;
const ETHERSCANAPIKEY = process.env.ETHERSCANAPIKEY as string;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY as string;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
  },
  etherscan: {
    apiKey: ETHERSCANAPIKEY,
  },
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [GOERLI_PRIVATE_KEY],
      chainId: 5,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    currency: "USD",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: { default: 0 },
  },
};

export default config;
