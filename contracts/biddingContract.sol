// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6 <0.9.0;
pragma experimental ABIEncoderV2;

import "../node_modules/@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract BiddingContract is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    // Contract Variables
    address private contractOwner;

    // Chainlink oracle variables
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    uint256 arrayIndex = 0;

    Bid[] public bids;

    struct Bid {
        string matchId;
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

    function storeBid(Bid memory bid) public {
        bids.push(bid);
        arrayIndex = bids.length; // Update the arrayIndex whenever a new bid is added
    }

    function getBid(uint256 index) public view returns (Bid memory) {
        return bids[index];
    }

    function getNumberOfBids() public view returns (uint256) {
        return arrayIndex;
    }

    function getAllBids() public view returns (Bid[] memory) {
        Bid[] memory result = new Bid[](arrayIndex);
        for (uint256 i = 0; i < arrayIndex; i++) {
            result[i] = bids[i];
        }
        return result;
    }

    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    function resolvedBid() public {
        currentBid.resolved = true;
    }

    function getResolvedStatus() public view returns (bool) {
        return currentBid.resolved;
    }

    function openBid(
        string memory _matchId,
        address _bidder2,
        string memory _bidder1ResultGuess, // result format: "2-1"
        string memory _bidder2ResultGuess, // result format: "3-5"
        uint256 _bidAmount
    ) public {
        // require(currentBid.resolved, "A bid is already open.");
        require(_bidder2 != address(0), "Invalid bidder address.");

        currentBid = Bid({
            matchId: _matchId,
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
        require(!currentBid.resolved, "No open bid available.");
        require(
            msg.sender != currentBid.bidder2,
            "You cannot outbid yourself."
        );
        
        storeBid(currentBid);
    }

    function resolveBid() public payable {
        require(!currentBid.resolved, "No open bid available.");
        require(
            msg.sender == contractOwner,
            "Only the contract owner can resolve the bid."
        );
        // Return funds to previous bidder
        payable(currentBid.bidder2).transfer(currentBid.bidAmount);
  
        // requestMatchData();
    }


    // function requestMatchData() private {
    //     currentBid.resolved = true;
    // Chainlink.Request memory request = buildChainlinkRequest(
    //     jobId,
    //     address(this),
    //     this.handleMatchData.selector
    // );
    // request.add("get", "https://api.football-data.org/v4/matches"); // Set the Football-Data.org API endpoint for retrieving match data
    // request.add(
    //     "headers",
    //     "X-Auth-Token: 8b752b2a04694a799db1fdf1b9bca649"
    // ); // Set the actual auth token
    // sendChainlinkRequestTo(oracle, request, fee);
    // }

    // function handleMatchData(
    //     bytes32 _requestId,
    //     uint256 _result
    // ) public recordChainlinkFulfillment(_requestId) {
    //     // Process the match data received from the API
    //     // Update the bid results based on the fetched data

    //     // For example:
    //     currentBid.result1 = 2; // Update result for team 1;
    //     currentBid.result2 = 2; // Update result for team 2;

    //     // Mark the bid as resolved
    //     currentBid.resolved = true;
    // }
}
