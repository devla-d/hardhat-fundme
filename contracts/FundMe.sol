// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe_NotOwner();

/**
 * @title  A contract for crowd funding
 * @author Sammy
 * @notice a demo  funnding contract
 * @dev this implements pricefeed as our library
 */
contract FundMe {
    using PriceConverter for uint256;

    // event Funded(address indexed from, uint256 amount);

    mapping(address => uint256) private s_addressToAmountFunded;

    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 10 * 10**18;
    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe_NotOwner();
        _;
    }

    constructor(address PriceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(PriceFeedAddress);
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }

    /**
     * @notice this function funds the contrat
     * @dev this implements pricefeed as our library
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function getOwnwer() public view returns (address) {
        return i_owner;
    }

    function getFunders(address funder) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPricefeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
