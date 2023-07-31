// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6 <0.9.0;
pragma experimental ABIEncoderV2;

import "../node_modules/@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract BiddingContract is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    receive() external payable {
        emit Message(msg.sender, msg.value, "recieve");
    }

    fallback() external payable {
        emit Message(msg.sender, msg.value, "fallback");
    }

    // Contract Variables
    address private contractOwner;

    // Chainlink oracle variables
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    uint256 arrayIndex = 0;

    Bid[] public bids;

    struct Bid {
        uint256 index;
        string matchId;
        address payable bidder1;
        address payable bidder2;
        string bidder1ResultGuess; // result format: "2-1"
        string bidder2ResultGuess; // result format: "3-5"
        uint8 result1;
        uint8 result2;
        uint256 bidAmount;
        bool isBidder1Won;
        bool resolved;
    }

    Bid public currentBid;

    constructor() payable {
        // Set initial values
        contractOwner = msg.sender;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _amount);

    event Message(address messageSender, uint value, string message);

    function storeBid(Bid memory bid) public {
        bids.push(bid);
        arrayIndex = bids.length; // Update the arrayIndex whenever a new bid is added
    }

    function removeBid(uint256 index) public {
        delete bids[index];
        arrayIndex = bids.length; // Update the arrayIndex whenever a new bid is added
        clearCurrentBid(arrayIndex);
    }

    function clearCurrentBid(uint256 _index) public {
        currentBid = Bid({
            index: _index,
            matchId: "",
            bidder1: payable(address(0)),
            bidder2: payable(address(0)),
            bidder1ResultGuess: "",
            bidder2ResultGuess: "",
            bidAmount: 0,
            result1: 0,
            result2: 0,
            isBidder1Won: false,
            resolved: false
        });
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
        currentBid.isBidder1Won = true;
    }

    function getResolvedStatus() public view returns (bool) {
        return currentBid.isBidder1Won;
    }

    function getBidder1Guess() public view returns (string memory) {
        return currentBid.bidder1ResultGuess;
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function openBid(
        string memory _matchId,
        address payable _bidder1,
        string memory _bidder1Guess,
        uint256 _bidAmount,
        bool firstIsWinner,
        uint8 resultHome,
        uint8 resultAway
    ) public {
        currentBid = Bid({
            index: arrayIndex++,
            matchId: _matchId,
            bidder1: _bidder1,
            bidder2: currentBid.bidder2,
            bidder1ResultGuess: _bidder1Guess,
            bidder2ResultGuess: "",
            bidAmount: _bidAmount,
            result1: resultHome,
            result2: resultAway,
            isBidder1Won: firstIsWinner,
            resolved: false
        });
        storeBid(currentBid);
        emit Message(
            _bidder1,
            _bidAmount,
            "The Bid has been opened and stored"
        );
    }

    function placeBid(uint256 index) public {
        // require(
        //     msg.sender != currentBid.bidder1,
        //     "You cannot outbid yourself."
        // );
        currentBid.bidder2 = payable(msg.sender);
        currentBid.bidder2ResultGuess = keccak256(
            bytes(currentBid.bidder1ResultGuess)
        ) == keccak256(bytes("HOME_TEAM"))
            ? "AWAY_TEAM"
            : "HOME_TEAM";
        setBidder2InArray(currentBid.bidder2, index);
        emit Message(
            currentBid.bidder2,
            currentBid.bidAmount,
            "The Bid has been placed"
        );
    }

    function setBidder2InArray(address payable bidder2, uint256 index) public {
        bids[index].bidder2 = bidder2;
    }

    function resolveBid() public payable {
        // require(msg.sender == contractOwner, "Only the contractOwner can resolve the bid");
        require(!currentBid.resolved, "This Bid has already been resolved");

        if (currentBid.isBidder1Won) {
            emit Message(
                currentBid.bidder1,
                0,
                "Bidder1 - Before the payment call"
            );
            (bool success, ) = payable(currentBid.bidder1).call{
                value: getContractBalance()
            }("");
            require(success, "ResolveBid failed");
            emit Transfer(
                address(this),
                currentBid.bidder1,
                currentBid.bidAmount
            );
        } else {
            emit Message(
                currentBid.bidder2,
                0,
                "Bidder2 - Before the payment call"
            );
            (bool success, ) = payable(currentBid.bidder2).call{
                value: getContractBalance()
            }("");
            require(success, "ResolveBid failed");
            emit Transfer(
                address(this),
                currentBid.bidder2,
                currentBid.bidAmount
            );
        }
        removeBid(currentBid.index);
    }
}
