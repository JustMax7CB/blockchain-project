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
  openNewBid(matchId);
}

function handlePlaceButtonClick(event) {
  const secondTeam = event.target.dataset.secondTeam;
  const bidAmount = event.target.dataset.bidAmount;
  placeNewBid(secondTeam, bidAmount);
}

async function openNewBid(matchId) {
  const amount = document.querySelector(`#match_id_${matchId} > input`).value;
  const firstGuess = document.querySelector(
    `#match_id_${matchId} > select`
  ).value;
  log("openBid", `Amount: ${amount}, First guess: ${firstGuess}`);
  await openBid(matchId, firstGuess, amount);
  amount.value = "";
}

async function placeNewBid(secondTeam, bidAmount) {
  await placeBid(secondTeam, bidAmount);
}
