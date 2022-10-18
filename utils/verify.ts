import { run } from "hardhat";

/**
 * verifiying contract after deploying
 * @param {*} contractAddress
 * @param {*} arg
 */
const verifyContract = async (contractAddress: string, arg: Array<any>) => {
  console.log("verifing contract ::::");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: arg,
    });
  } catch (e) {
    console.log(e);
  }
};

export default verifyContract;
