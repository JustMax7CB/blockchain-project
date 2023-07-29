import { attachListeners } from "./script.js";
import { getAllBids } from "./web3_script.js";

async function getGameJson(id) {
  console.log("getGameJson", "Start");

  const url = `https://api.football-data.org/v4/matches/${id}`;
  try {
    return fetch(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": "06504d7bb1f74cde9d03d39b54241a8c",
      },
    }).then(async (temp) => {
      console.log(temp);
      return await paresJson(temp);
    });
    //   console.log(response.json)
    // data =response.json();
    // console.log(data);
    //   displayData(data); // קריאה לפונקציה להצגת הנתונים בדף
  } catch (error) {
    console.error("Error:", error);
  }
  // console.log(response)
}
async function paresJson(data) {
  return await data.json().then((temp) => {
    console.log("parseJson", temp);
    return temp;
  });
}

async function displayOpenBid() {
  /////CREATE new json file for all
  console.log("displayOpenBid", "Start");

  const dataContainer = document.getElementById("openbid-container");
  let html = "";
  await getAllBids().then((bids) => {
    bids.forEach(async (bid) => {
      console.log("display bid", bid.matchId);
      await getGameJson(bid.matchId).then((match) => {
        let secondTeam =
          bid.bidder1ResultGuess === match["homeTeam"].shortName
            ? match["awayTeam"].shortName
            : match["homeTeam"].shortName;
        console.log("getMatchDetails", match);
        document.createElement("div");
        html += `<div class="rectangle">
            <div class="image-container">
                <img src="${match["homeTeam"].crest}" alt="תמונה 1" >
            </div>
            <div class="form-div">
                <h2>${match["homeTeam"].shortName} vs ${match["awayTeam"].shortName}</h2>
                <p>${match.competition.name}</p>
                <p>ID:Game ID:  ${match.id}</p>
                <p>${match.utcDate}</p>
                <p>Bidder ID:  ${bid.bidder1}</p>
                <h1 >Bid Owner Guss:  ${bid.bidder1ResultGuess}-Win</h1>
                <h1>Bid Amount:  ${bid.bidAmount} ETC</h1>
                </br>
                <h2> Bet ${secondTeam} Win</h2>
                <button id="placeBidBtn" class="btn btn-success" data-bid-amount="${bid.bidAmount}" data-second-team="${secondTeam}" data-match-id="${match.id}">Confirm bet</button>
            </div>
            <div class="image-container">
                <img src="${match["awayTeam"].crest}" alt="תמונה 2" >
            </div>
            
        </div>`;
      });
      dataContainer.innerHTML = html;
      attachListeners();
    });
  });

  // data.forEach((match) => {
  //   document.createElement("div");
  //   html += `<div class="rectangle">
  //       <div class="image-container">
  //           <img src="${match["homeTeam"].crest}" alt="תמונה 1" >
  //       </div>
  //       <div class="form-div">
  //           <h2>${match["homeTeam"].shortName} vs ${match["awayTeam"].shortName}</h2>
  //           <p>${match.competition.name}</p>
  //           <p>ID:${match.id}</p>

  //           </br>
  //           <p>${match.utcDate}</p>
  //           <div class="form-inputs" id="match_id_${match.id}">
  //               <input type="text" placeholder="הזינו סכום הימור כאן">
  //               <select class="form-select">
  //               <option value="${match["homeTeam"].shortName}">${match["homeTeam"].shortName}</option>
  //               <option value="${match["awayTeam"].shortName}">${match["awayTeam"].shortName}</option>
  //               </select>
  //               <button id="openBidBtn" class="btn btn-success" data-match-id="${match.id}">Open Bid</button>
  //           </div>
  //       </div>
  //       <div class="image-container">
  //           <img src="${match["awayTeam"].crest}" alt="תמונה 2" >
  //       </div>

  //   </div>`;
  // });

  // attachListeners();
}

// fetchData();

displayOpenBid();
