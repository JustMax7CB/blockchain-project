// Contract ABI (Application Binary Interface) obtained from compiling the Solidity file

const ABI_JsonFilePath = "../build/contracts/BiddingContract.json";

// Ethereum provider URL
const providerUrl = "http://127.0.0.1:7545"; // Replace with your actual Ethereum provider URL

const web3 = new Web3(providerUrl);
log("Web3 Instance", web3.currentProvider);

const reader = new FileReader();
let contractABI = fetch(ABI_JsonFilePath).then((response) =>
  response.json()
    .then((data) => (contractABI = data.abi))
);
log("ABI JSON DATA", await contractABI);



// Create a new instance of the Web3 class
const contractAddress = "0x5Ab94c45A9b8a37154e356584e588d1dDc7ae782"; // Replace with the actual contract address
log("CONTRACT ADDRESS", contractAddress);

const contract = new web3.eth.Contract(contractABI, contractAddress);
log("Contract Instance", contract);



// Create a contract instance using the ABI and contract address
// Function to open a bid
async function openBid(
  team1,
  team2,
  bidder2,
  bidder1ResultGuess,
  bidder2ResultGuess,
  bidAmount
) {
  try {
    await contract.methods
      .openBid(
        team1,
        team2,
        bidder2,
        bidder1ResultGuess,
        bidder2ResultGuess,
        bidAmount
      )
      .send({ from: contractOwner });
    console.log("Bid opened successfully.");
  } catch (error) {
    console.error("Error opening bid:", error);
  }
}

// Function to place a bid
async function placeBid() {
  try {
    const accounts = await web3.eth.getAccounts();
    const bidder = accounts[0]; // Assuming the bidder is the first account
    await contract.methods.placeBid().send({ from: bidder });
    console.log("Bid placed successfully.");
  } catch (error) {
    console.error("Error placing bid:", error);
  }
}

// Function to resolve a bid
async function resolveBid() {
  try {
    const accounts = await web3.eth.getAccounts();
    const contractOwner = accounts[0]; // Assuming the contract owner is the first account
    await contract.methods.resolveBid().send({ from: contractOwner });
    console.log("Bid resolved successfully.");
  } catch (error) {
    console.error("Error resolving bid:", error);
  }
}

// Example usage
async function main() {
  // Connect to the Ethereum provider
  await web3.eth.net.isListening();
  console.log("Connected to Ethereum provider.");

  // Open a bid
  await openBid(
    "Team A",
    "Team B",
    "0xb6e6571b503D9C77C0C3936D41bd9007F9EC2185",
    "2-1",
    "3-5",
    100
  );

  // Place a bid
  await placeBid();

  // Resolve the bid
  await resolveBid();
}

main().catch(console.error);

function log(tag, message) {
  console.log("[" + tag + "]", message);
}
