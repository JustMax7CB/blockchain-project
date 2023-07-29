import {
  log,
  openBid,
  placeBid,
  resolveBid,
  resolvedBid,
  getAllBids,
} from "./web3_script.js";

// Update the account and chain id when user clicks on button

const openBidBtn = document.querySelector("#open-Bid");
const placeBidBtn = document.querySelector("#place-Bid");
const resolveBidBtn = document.querySelector("#resolve-Bid");

const allBids = async () => {
  const jsonResult = await getAllBids();
  const bidsTable = document
    .querySelector("#bidsTable")
    .getElementsByTagName("tbody")[0];

  jsonResult.forEach((bid, index) => {
    const newRow = bidsTable.insertRow();
    newRow.innerHTML = `
    <td>${bid.bidAmount}</td>
    <td>${bid.bidder1}</td>
    <td>${bid.bidder1ResultGuess}</td>
    <td>${bid.bidder2}</td>
    <td>${bid.bidder2ResultGuess}</td>
    <td>${bid.team1}</td>
    <td>${bid.team2}</td>
    <td>${bid.result1}</td>
    <td>${bid.result2}</td>
    <button
        id="resolve-Bid${index}"
        class="btn btn-success"
        type="button"
        class="btn btn-primary"
      >
        Resolve Bid
      </button>
  `;
  });
};

openBidBtn.addEventListener("click", async () => {
  const secondBidder = document.querySelector("#second-bidder").value;
  const bidAmount = document.querySelector("#bid-amount").value;
  const matchId = document.querySelector(".games_dropdown").value;
  const firstGuess = document.querySelector("#first-guess").value;
  const secondGuess = document.querySelector("#second-guess").value;

  // Open a bid
  await openBid(matchId, secondBidder, firstGuess, secondGuess, bidAmount);
});

placeBidBtn.addEventListener("click", async () => {
  const bidAmount = document.querySelector("#bid-amount").value;
  await placeBid(bidAmount);
});

// resolveBidBtn.addEventListener("click", async () => {
//   await resolveBid();
// });

const FOOTBALL_API_KEY = "8b752b2a04694a799db1fdf1b9bca649";
const baseUrl = "https://api.football-data.org/v4";
const matchesUrl = "/competitions/CL/matches";

function callFootballApi() {
  fetch(baseUrl + matchesUrl, {
    method: "GET",
    headers: { "X-Auth-Token": FOOTBALL_API_KEY },
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => parseMatchesJSON(json))
    .catch((err) => console.error(err));
}

function parseMatchesJSON(json) {
  const selectOptions = [];
  let matches = json["matches"];
  matches.forEach((element) => {
    const matchId = element["id"];
    const homeTeamCode = element.homeTeam.tla;
    const awayTeamCode = element.awayTeam.tla;
    const optionHTML = `<option value="${matchId}">${homeTeamCode} - ${awayTeamCode}</option>`;
    selectOptions.push(optionHTML);
  });

  setSelectOptions(selectOptions);
}

function setSelectOptions(selectOptions) {
  const selectElement = document.querySelector(".games_dropdown");
  selectElement.innerHTML = selectOptions;
}

callFootballApi();
await allBids();
