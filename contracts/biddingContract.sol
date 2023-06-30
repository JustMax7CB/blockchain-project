// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../node_modules/@chainlink/contracts";

contract BiddingContract is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    // Contract Variables
    address private contractOwner;

    // Chainlink oracle variables
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    struct Bid {
        string team1;
        string team2;
        address bidder1;
        address bidder2;
        string bidder1ResultGuess; // result format: "2-1"
        string bidder2ResultGuess; // result format: "3-5"
        uint result1;
        uint result2;
        uint256 bidAmount;
        bool resolved;
    }

    Bid public currentBid;

    constructor() {
        // Set initial values
        contractOwner = msg.sender;
    }

    function openBid(
        string memory _team1,
        string memory _team2,
        address _bidder2,
        string memory _bidder1ResultGuess, // result format: "2-1"
        string memory _bidder2ResultGuess, // result format: "3-5"
        uint256 memory _bidAmount
    ) public {
        require(currentBid.resolved, "A bid is already open.");
        require(_bidder2 != address(0), "Invalid bidder address.");

        currentBid = Bid({
            team1: _team1,
            team2: _team2,
            bidder1: msg.sender,
            bidder2: _bidder2,
            bidder1ResultGuess: _bidder1ResultGuess,
            bidder2ResultGuess: _bidder2ResultGuess,
            result1: 0,
            result2: 0,
            bidAmount: _bidAmount,
            resolved: false
        });

    }

    function placeBid() public payable {
        require(msg.sender != currentBid.bidder1, "You cannot outbid yourself.");

        // Return funds to previous bidder
        payable(currentBid.bidder2).transfer(currentBid.bidAmount);

        // Update bidder
        currentBid.bidder2 = msg.sender;
    }

    function resolveBid() public {
        require(!currentBid.resolved, "No open bid available.");
        require(msg.sender == contractOwner, "Only the contract owner can resolve the bid.");

        requestMatchData();
    }

    function requestMatchData() private {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.handleMatchData.selector
        );
        request.add("get", "https://api.football-data.org/v4/matches"); // Set the Football-Data.org API endpoint for retrieving match data
        request.add(
            "headers",
            "X-Auth-Token: 8b752b2a04694a799db1fdf1b9bca649"
        ); // Set the actual auth token
        sendChainlinkRequestTo(oracle, request, fee);
    }
}
