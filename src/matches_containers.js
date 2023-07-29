import { attachListeners } from "./script.js";

async function fetchData() {
  const url =
    "https://api.football-data.org/v4/competitions/CL/matches?state=FINISHED";
  let data;

  try {
    const response = fetch(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": "06504d7bb1f74cde9d03d39b54241a8c",
      },
    }).then((temp) => printdata(temp));
    //   console.log(response.json)
    // data =response.json();
    // console.log(data);
    //   displayData(data); // קריאה לפונקציה להצגת הנתונים בדף
  } catch (error) {
    console.error("Error:", error);
  }
  // console.log(response)
}
function printdata(data) {
  data.json().then((temp) => paresJson(temp));
  // console.log(temp);
}
function paresJson(temp) {
  let resultSet = temp["resultSet"];
  console.log("paresJson", resultSet);
  displayData(temp["matches"]);
}

function displayData(data) {
  const dataContainer = document.getElementById("data-container");
  let html = "";

  data.forEach((match) => {
    document.createElement("div");
    html += `<div class="rectangle">
        <div class="image-container">
            <img src="${match["homeTeam"].crest}" alt="תמונה 1" >
        </div>
        <div class="form-div">
            <h2>${match["homeTeam"].shortName} vs ${match["awayTeam"].shortName}</h2>
            <p>${match.competition.name}</p>
            <p>ID:${match.id}</p>

            </br>
            <p>${match.utcDate}</p>
            <div class="form-inputs" id="match_id_${match.id}">
                <input class="form-control" type="text" placeholder="הזינו סכום הימור כאן">
                <select class="form-select">
                <option value="HOME_TEAM">${match["homeTeam"].shortName}</option>
                <option value="AWAY_TEAM">${match["awayTeam"].shortName}</option>
                </select>
                <button id="openBidBtn" class="btn btn-success" data-match-id="${match.id}">Open Bid</button>
            </div>
        </div>
        <div class="image-container">
            <img src="${match["awayTeam"].crest}" alt="תמונה 2" >
        </div>
        
    </div>`;
  });

  dataContainer.innerHTML = html;
  attachListeners();
}

fetchData();
