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
    button.addEventListener("click", handleButtonClick);
  });
}

function handleButtonClick(event) {
  const matchId = event.target.dataset.matchId;
  openNewBid(matchId);
}

async function openNewBid(matchId) {
  const amount = document.querySelector(`#match_id_${matchId} > input`).value;
  const firstGuess = document.querySelector(
    `#match_id_${matchId} > select`
  ).value;
  log("openBid", `Amount: ${amount}, First guess: ${firstGuess}`);
  await openBid(matchId, firstGuess, amount);
}
