import { assert, expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";

describe("Fundme", function () {
  let Fundme: FundMe,
    deployer: string,
    MockV3Aggregator: MockV3Aggregator,
    sendvalue = ethers.utils.parseEther("11");

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;

    await deployments.fixture(["all"]);
    Fundme = await ethers.getContract("FundMe", deployer);
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("Constructor", async function () {
    it("Set the aggregator address correctly", async function () {
      const response = await Fundme.getPricefeed();
      assert.equal(response, MockV3Aggregator.address);
    });
  });

  describe("Funding", async function () {
    it("Reject if amount is less than 50$", async function () {
      await expect(Fundme.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });
    it("Update the addressToAmountFunded   ", async function () {
      await Fundme.fund({ value: sendvalue });
      const response = await Fundme.getFunders(deployer);
      assert.equal(response.toString(), sendvalue.toString());
    });
  });

  describe("withdraw", async () => {
    beforeEach(async () => {
      await Fundme.fund({ value: sendvalue });
    });
    it("only owner can withdraw", async () => {
      const accounts = await ethers.getSigners();

      const fundmeConnect = Fundme.connect(accounts[1]);

      await expect(fundmeConnect.withdraw()).to.be.revertedWithCustomError(
        Fundme,
        "FundMe_NotOwner"
      );
    });
  });
});
