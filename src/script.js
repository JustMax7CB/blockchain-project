import {
  log,
  openBid,
  placeBid,
  resolveBid,
  resolvedBid,
  
} from "./web3_script.js";

// Update the account and chain id when user clicks on button

const openBidBtn = document.querySelector("#open-Bid");
const placeBidBtn = document.querySelector("#place-Bid");
const resolveBidBtn = document.querySelector("#resolve-Bid");

openBidBtn.addEventListener("click", async () => {
  const secondBidder = document.querySelector("#second-bidder").value;
  const bidAmount = document.querySelector("#bid-amount").value;
  const firstTeam = document.querySelector("#team_a").value;
  const secondTeam = document.querySelector("#team_b").value;
  const firstGuess = document.querySelector("#first-guess").value;
  const secondGuess = document.querySelector("#second-guess").value;
  log("SECOND BIDDER ADDRESS", secondBidder);
  log("BID AMOUNT", bidAmount);
  log("FIRST TEAM", firstTeam);
  log("SECOND TEAM", secondTeam);
  log("FIRST GUESS", firstGuess);
  log("SECOND GUESS", secondGuess);

  // Open a bid
  await openBid(
    firstTeam,
    secondTeam,
    secondBidder,
    firstGuess,
    secondGuess,
    bidAmount
  );
});


placeBidBtn.addEventListener("click", async () => {
  await placeBid();
});


resolveBidBtn.addEventListener("click", async () => {
  await resolveBid();
});
