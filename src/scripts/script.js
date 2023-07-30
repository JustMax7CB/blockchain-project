import {
  log,
  openBid,
  placeBid,
  resolveBid,
  resolvedBid,
  getAllBids,
} from "./web3_script.js";

export function attachListeners() {
  const openBidButtons = document.querySelectorAll("#openBidBtn");
  openBidButtons.forEach((button) => {
    button.addEventListener("click", handleOpenButtonClick);
  });

  const placeBidButtons = document.querySelectorAll("#placeBidBtn");
  placeBidButtons.forEach((button) => {
    button.addEventListener("click", handlePlaceButtonClick);
  });
  log("PlaceBidButton", placeBidButtons);
}

function handleOpenButtonClick(event) {
  const matchId = event.target.dataset.matchId;
  const matchWinner = event.target.dataset.matchWinner;
  const matchResult = event.target.dataset.matchResult;
  openNewBid(matchId, matchWinner, matchResult);
}

function handlePlaceButtonClick(event) {
  const bidAmount = event.target.dataset.bidAmount;
  const bidIndex = event.target.dataset.index;
  placeNewBid(bidAmount, bidIndex);
}

async function openNewBid(matchId, matchWinner, matchResult) {
  const amount = document.querySelector(`#match_id_${matchId} > input`).value;
  const firstGuess = document.querySelector(
    `#match_id_${matchId} > select`
  ).value;
  let firstIsWinner = false;
  log("openBid", `Amount: ${amount}, First guess: ${firstGuess}`);
  if (firstGuess === matchWinner) firstIsWinner = true;
  await openBid(matchId, firstGuess, amount, firstIsWinner, matchResult);
}

async function placeNewBid(bidAmount, bidIndex) {
  await placeBid(bidAmount, bidIndex);
}
