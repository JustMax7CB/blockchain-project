const Web3 = require("web3");

// Contract ABI (Application Binary Interface) obtained from compiling the Solidity file
const contractABI = [
  // Contract ABI here
];

// // Address of the deployed contract
// const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with the actual contract address

// Ethereum provider URL
const providerUrl = "http://localhost:5500"; // Replace with your actual Ethereum provider URL

// Create a new instance of the Web3 class
const contractAddress = Web3.providers.providerUrl
console.log(contractAddress)

// Create a contract instance using the ABI and contract address
const contract = Web3.eth.contract.Contract
console.log(contract)
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
    const accounts = await Web3.eth.getAccounts();
    const contractOwner = accounts[0]; // Assuming the contract owner is the first account
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
    "0x1234567890abcdef1234567890abcdef12345678",
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
