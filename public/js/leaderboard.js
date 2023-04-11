let leaderboard = {
  leaders: [null, null, null, null, null],
};

function loadLeaderboard() {
  let l = localStorage.getItem("keyboardHeroLeaderboard");
  if (l === null) {
    console.log("NO LEADERBOARD FOUND.");
    localStorage.setItem(
      "keyboardHeroLeaderboard",
      JSON.stringify(leaderboard)
    );
  } else {
    leaderboard = JSON.parse(l);
  }
}

export function getLeaderboard() {
  return leaderboard;
}

export function addToLeaderboard(user, wpm, acc) {
  for (let i = 0; i < leaderboard["leaders"].length; i++) {
    let curr = leaderboard["leaders"][i];
    if (curr === null || curr["wpm"] < wpm) {
      console.log(`ADDING NEW ENTRY`);
      for (let j = i + 1; j < leaderboard["leaders"].length - 1; j++) {
        leaderboard["leaders"][j] = leaderboard["leaders"][j - 1];
      }
      leaderboard["leaders"][i] = { username: user, wpm: wpm, acc: acc };
      console.log(leaderboard);
      break;
    }
  }
  localStorage.setItem("keyboardHeroLeaderboard", JSON.stringify(leaderboard));
}

export function getBest(user) {
  let best = localStorage.getItem(`keyboardHeroBest-${user}`);
  if (best !== null) best = JSON.parse(best);
  return best;
}

export function updateBest(user, wpm, acc) {
  let best = localStorage.getItem(`keyboardHeroBest-${user}`);
  if (best === null || JSON.parse(best)["wpm"] < wpm)
    localStorage.setItem(
      `keyboardHeroBest-${user}`,
      JSON.stringify({
        user: user,
        wpm: wpm,
        acc: acc,
      })
    );
}

function setupsAndListeners() {
  loadLeaderboard();
}

document.addEventListener("DOMContentLoaded", setupsAndListeners);
