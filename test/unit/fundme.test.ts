import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";

describe("Fundme", function () {
  let Fundme: FundMe,
    deployer: string,
    MockV3Aggregator: MockV3Aggregator,
    sendvalue = ethers.utils.parseEther("11");
  let testAccount: string;

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    const [owner, otherAccount] = await ethers.getSigners();

    testAccount = otherAccount.address;
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

  describe("Funding", async function () {
    it("Reject if amount is less than 50$", async function () {
      await expect(Fundme.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });
    it("Update the addressToAmountFunded   ", async function () {
      await Fundme.fund({ value: sendvalue });
      const response = await Fundme.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendvalue.toString());
    });
  });

  describe("withdraw", async () => {
    beforeEach(async () => {
      await Fundme.fund({ value: sendvalue });
    });
    it("only owner can withdraw", async () => {
      const accounts = await ethers.getSigners();
      for (let i = 1; i < 6; i++) {
        const fundmeConnect = Fundme.connect(accounts[i]);

        await expect(fundmeConnect.withdraw()).to.be.revertedWithCustomError(
          Fundme,
          "FundMe_NotOwner"
        );
      }
    });
  });
});
