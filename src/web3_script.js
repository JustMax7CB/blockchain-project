// Initialise the page objects to interact with
const ethereumButton = document.querySelector(".enableEthereumButton");
const showAccount = document.querySelector(".showAccount");
const showChainId = document.querySelector(".showChainId");

// Initialise the active account and chain id
let activeAccount;
let activeChainId;
let et_ActiveAccount;
let accountBalance;

// Contract ABI (Application Binary Interface) obtained from compiling the Solidity file
const ABI_JsonFilePath = "../build/contracts/BiddingContract.json";

// Ethereum provider URL
const providerUrl = "http://127.0.0.1:7545"; // Replace with your actual Ethereum provider URL

const web3 = new Web3(providerUrl);

log("Web3 Instance", web3.currentProvider);

let contractOwner = null;

const reader = new FileReader();
let contractABI = fetch(ABI_JsonFilePath).then((response) =>
  response.json().then((data) => (contractABI = data.abi))
);
log("ABI JSON DATA", await contractABI);

// Create a new instance of the Web3 class
const contractAddress = "0x3C89f48405582aE1FC3a413B732ab7C0c77DD4AD"; // Replace with the actual contract address
log("CONTRACT ADDRESS", contractAddress);

export let contract = new web3.eth.Contract(contractABI, contractAddress);
log("Contract Instance", contract);

export async function resolvedBid() {
  try {
    contract.methods.resolvedBid();
    log("Resolved BID", contract.methods.getResolvedStatus());
  } catch (error) {
    console.error("Resolved BID Error", error);
  }
}

function findClosestWeiToEther(targetEtherAmount) {
  let low = 0;
  let high = Number.MAX_SAFE_INTEGER;
  let closestWei = null;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midEtherAmount = web3.utils.fromWei(mid.toString(), "ether");

    if (midEtherAmount === targetEtherAmount) {
      closestWei = mid.toString();
      break;
    } else if (midEtherAmount < targetEtherAmount) {
      low = mid + 1;
      closestWei = mid.toString();
    } else {
      high = mid - 1;
    }
  }

  return closestWei;
}

// Create a contract instance using the ABI and contract address
// Function to open a bid

export async function openBid(matchId, bidder1Guess, bidAmount) {
  try {
    await window.ethereum.on("accountsChanged", function (accounts) {
      activeAccount = et_ActiveAccount;
      console.log(activeAccount);
    });
    log("FUNCTION CALL START", "openBid");
    await contract.methods
      .openBid(matchId, et_ActiveAccount, bidder1Guess, bidAmount)
      .send({ from: et_ActiveAccount, gas: 300000 });

    log("openBid", "Bid opened successfully.");

    ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: et_ActiveAccount,
            to: contractAddress,
            value: findClosestWeiToEther(bidAmount),
          },
        ],
      })
      .then((txHash) => log("txHash", txHash));
  } catch (error) {
    console.error("Error opening bid:", error);
  }

  log("FUNCTION CALL END", "openBid");
}

// Function to place a bid
export async function placeBid(secondTeam, bidAmount) {
  try {
    log("FUNCTION CALL START", "placeBid");
    await contract.methods
      .placeBid(secondTeam)
      .send({ from: et_ActiveAccount, gas: 300000 });

    ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: et_ActiveAccount,
            to: contractAddress,
            value: findClosestWeiToEther(bidAmount),
          },
        ],
      })
      .then((txHash) => log("txHash", txHash));

    log("placeBid", "Bid placed successfully.");
  } catch (error) {
    console.error("Error placing bid:", error);
  }
  log("FUNCTION CALL ENDED", "placeBid");

  setTimeout(async () => {
    log("FUNCTION CALL START", "relosveBid");
    await contract.methods
      .resolveBid()
      .send({ from: et_ActiveAccount, gas: 300000 });

    log("FUNCTION CALL ENDED", "relosveBid");
  }, 5000);
}

// Function to resolve a bid
export async function resolveBid() {
  try {
    log("FUNCTION CALL START", "resolveBid");

    const gas = await contract.methods
      .transfer()
      .estimateGas({ from: et_ActiveAccount });
    const result = await contract.methods
      .transfer()
      .send({ from: et_ActiveAccount, gas });
    // await contract.methods
    //   .resolveBid()
    //   .send({ from: et_ActiveAccount, gas: 300000 });
    console.log(
      "Transaction successful. Transaction hash:",
      result.transactionHash
    );
    console.log("Bid resolved successfully.");
  } catch (error) {
    console.error("Error resolving bid:", error);
  }
  log("FUNCTION CALL ENDED", "resolveBid");
}

export async function getAllBids() {
  try {
    log("FUNCTION CALL START", "getAllBids");
    const numberOfBids = await contract.methods.getNumberOfBids().call();
    const allBids = [];

    for (let i = 0; i < numberOfBids; i++) {
      const bid = await contract.methods.getBid(i).call();
      allBids.push({
        matchId: bid.matchId,
        bidder1: bid.bidder1,
        bidder2: bid.bidder2,
        bidder1ResultGuess: bid.bidder1ResultGuess,
        bidder2ResultGuess: bid.bidder2ResultGuess,
        result1: bid.result1,
        result2: bid.result2,
        bidAmount: bid.bidAmount,
        resolved: bid.resolved,
      });
    }
    return allBids;
  } catch (error) {
    console.error("getAllBids finished with error: ", error);
    log("FUNCTION CALL ENDED", "getAllBids");
    return null;
  }
}

function connectToMetaMask() {
  let ethereum = window.ethereum;
  if (typeof ethereum !== "undefined") {
    log("METAMASK", "MetaMast is installed!");
  }
  if (ethereum) {
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (address) => {
        log("ETHEREUM ACCOUNT", "Account Connected: " + address[0]);
        et_ActiveAccount = address[0];
        accountBalance = await web3.eth.getBalance(et_ActiveAccount);
        log("ETHEREUM ACCOUNT", "Account Balance: " + accountBalance);
      });
  }
}

// Example usage
async function main() {
  // Connect to the Ethereum provider
  await web3.eth.net.isListening();
  console.log("Connected to Ethereum provider.");

  connectToMetaMask();
}

main().catch(console.error);

export function log(tag, message) {
  console.log(`[${tag}]`, message);
}

// Get the account in the window object
async function getAccount() {
  if (window.ethereum) {
    await ethereum.enable();
  }

  web3.eth.getAccounts((error, result) => {
    if (error) {
      log("getAccount ERROR", error);
    } else {
      log("getAccount RESULT", result[0]);
    }
  });
}

// Get the connected network chainId
async function getChainId() {
  activeChainId = await ethereum.request({ method: "eth_chainId" });
  showChainId.innerHTML = activeChainId;
}

// Update the selected account and chain id on change
ethereum.on("accountsChanged", getAccount);
ethereum.on("chainChanged", getChainId);

// var request = require('request');
// var options = {
//   'method': 'GET',
//   'url': 'https://v3.football.api-sports.io/{endpoint}',
//   'headers': {
//     'x-rapidapi-key': 'XxXxXxXxXxXxXxXxXxXxXxXx',
//     'x-rapidapi-host': 'v3.football.api-sports.io'
//   }
// };
// request(options, function (error, response) {
//   if (error) throw new Error(error);
//   console.log(response.body);
// });
