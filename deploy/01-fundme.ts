import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { developmentChains, networkConfig } from "../helper.config";
import verifyContract from "../utils/verify";
import "dotenv/config";

module.exports = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  if (!chainId) return false;
  let ethUsdPriceFeedAddress, networkconfirmation;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
    networkconfirmation = 1;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    networkconfirmation = 3;
  }
  const args = [ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkconfirmation,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCANAPIKEY
  ) {
    await verifyContract(fundMe.address, args);
  }

  log("::::::::::::::::::::::::::::::::::::::::::::::");
};
module.exports.tags = ["all", "fundMe"];
