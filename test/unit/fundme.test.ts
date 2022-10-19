import { assert } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";

describe("Fundme", function () {
  let Fundme: FundMe, deployer: string, MockV3Aggregator: MockV3Aggregator;

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    Fundme = await ethers.getContract("FundMe", deployer);
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("Constructor", async function () {
    it("Set the aggregator address correctly", async function () {
      const response = await Fundme.priceFeed();
      console.log(response);
      assert.equal(response, MockV3Aggregator.address);
    });
  });
});
