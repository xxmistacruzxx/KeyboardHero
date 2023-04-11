import { getUsername } from "/public/js/preferences.js";
import { getLeaderboard, getBest } from "/public/js/leaderboard.js";

function populatePersonalBest() {
  let best = getBest(getUsername());
  let personalBestDisplay = document.querySelector("#personalBest");
  if (best === null) {
    personalBestDisplay.innerHTML =
      personalBestDisplay.innerHTML + `<h2>N/A</h2>`;
  } else {
    personalBestDisplay.innerHTML =
      personalBestDisplay.innerHTML +
      `<h2>WPM: ${best["wpm"]} | Accuracy: ${best["acc"]}</h2>`;
  }
}

function populateLeaderboard() {
  let leaderboard = getLeaderboard();
  let leaderboardDisplay = document.querySelector("#leaderboard");
  for (let i = 0; i < leaderboard["leaders"].length; i++) {
    console.log(`CREATING ENTRY: ${i}`);
    if (leaderboard["leaders"][i] === null) {
      leaderboardDisplay.innerHTML =
        leaderboardDisplay.innerHTML + `<div><h2>${i + 1}. N/A</h2></div>`;
    } else {
      leaderboardDisplay.innerHTML =
        leaderboardDisplay.innerHTML +
        `<div><h2>${i + 1}. ${leaderboard["leaders"][i]["username"]}</h2><h2>Accuracy: ${
          leaderboard["leaders"][i]["acc"]
        } | WPM: ${leaderboard["leaders"][i]["wpm"]}</h2></div>`;
    }
  }
}

function setupsAndListeners() {
  populatePersonalBest();
  populateLeaderboard();
}

document.addEventListener("DOMContentLoaded", setupsAndListeners);
