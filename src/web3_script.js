// Initialise the page objects to interact with
const ethereumButton = document.querySelector(".enableEthereumButton");
const showAccount = document.querySelector(".showAccount");
const showChainId = document.querySelector(".showChainId");

// Initialise the active account and chain id
let activeAccount;
let activeChainId;

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
const contractAddress = "0x59176d880d04395625A48504DB6E841684DBd3aD"; // Replace with the actual contract address
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

// Create a contract instance using the ABI and contract address
// Function to open a bid
export async function openBid(
  team1,
  team2,
  bidder2,
  bidder1ResultGuess,
  bidder2ResultGuess,
  bidAmount
) {
  try {
    await getAccount();
    await getChainId();

    log("FUNCTION CALL", "openBid");
    await contract.methods
      .openBid(
        team1,
        team2,
        bidder2,
        bidder1ResultGuess,
        bidder2ResultGuess,
        bidAmount
      )
      .send({
        from: activeAccount,
        gas: "100000",
      });
    console.log("Bid opened successfully.");
  } catch (error) {
    console.error("Error opening bid:", error);
  }
}

// Function to place a bid
export async function placeBid() {
  try {
    log("FUNCTION CALL", "placeBid");
    const accounts = await web3.eth.getAccounts();
    const bidder = accounts[0]; // Assuming the bidder is the first account
    await contract.methods.placeBid().send({ from: bidder });
    console.log("Bid placed successfully.");
  } catch (error) {
    console.error("Error placing bid:", error);
  }
}

// Function to resolve a bid
export async function resolveBid() {
  try {
    await getAccount();
    getChainId();
    log("FUNCTION CALL", "resolveBid");
    await contract.methods.resolveBid().send({ from: activeAccount });
    console.log("Bid resolved successfully.");
  } catch (error) {
    console.error("Error resolving bid:", error);
  }
}

function connectToMetaMask() {
  let ethereum = window.ethereum;
  if (typeof ethereum !== "undefined") {
    log("METAMASK", "MetaMast is installed!");
  }
  if (ethereum) {
    ethereum.request({ method: "eth_requestAccounts" }).then((address) => {
      log("ETHEREUM ACCOUNT", "Account Connected" + address[0]);
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
  const accounts = await web3.eth.getAccounts();
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log("Please connect to MetaMask.");
  } else if (accounts[0] !== activeAccount) {
    activeAccount = accounts[0];
  }
  showAccount.innerHTML = activeAccount;
  log("Second Bidder Address: ", activeAccount);
}

// Get the connected network chainId
async function getChainId() {
  activeChainId = await ethereum.request({ method: "eth_chainId" });
  showChainId.innerHTML = activeChainId;
}

// Update the selected account and chain id on change
ethereum.on("accountsChanged", getAccount);
ethereum.on("chainChanged", getChainId);
