import { makeRequestJSON } from "/public/js/helpers.js";
import { getUsername } from "/public/js/preferences.js";
import {
  addToLeaderboard,
  getBest,
  updateBest,
} from "/public/js/leaderboard.js";

let listOfWords;
let helpScreenGone;
let gameStarted;
let gameFinished;
let wordList;
let wordIndex;
let currWord;
let currWordDisplay;
let charIndex;
let nextWord;
let nextWordDisplay;
let prevWord;
let prevWordDisplay;
let time;
let timeDisplay;
let wpm;
let wpmDisplay;
let acc;
let accDisplay;
let numPress;
let numCorrect;

let myWorker = new Worker("/public/js/worker.js");
myWorker.onmessage = (e) => {
  if (!gameStarted) {
    myWorker.postMessage({ gameStarted: gameStarted });
    return;
  }

  let t = e.data["time"];
  setTime(t);
  if (t < 0) {
    gameStarted = false;
    gameFinished = true;
    updateBest(getUsername(), wpm, Math.trunc(acc * 1000) / 10);
    addToLeaderboard(getUsername(), wpm, Math.trunc(acc * 1000) / 10);
    updatePersonalBestDisplay();
    document.querySelector(".play-header").style.backgroundColor =
      "var(--background-color4)";
  }
  if (!gameFinished) {
    let w = Math.trunc((numCorrect / 4.7 / (15 - time)) * 60 * 10) / 10;
    setWpm(w);
  }
  myWorker.postMessage({ gameStarted: gameStarted });
};

async function initializeVariables() {
  listOfWords = await generateWords();
  helpScreenGone = false;
  gameStarted = false;
  gameFinished = false;
  currWordDisplay = document.querySelector("#currword");
  nextWordDisplay = document.querySelector("#nextword");
  prevWordDisplay = document.querySelector("#prevword");
  timeDisplay = document.querySelector("#TIME");
  wpmDisplay = document.querySelector("#WPM");
  accDisplay = document.querySelector("#ACC");
}

function playButtonFunction() {
  document
    .querySelector(".welcome-container")
    .style.setProperty("display", "none");
  helpScreenGone = true;
  document.querySelector(".play-container").hidden = false;
  initializeGame();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function generateWords() {
  let result = await makeRequestJSON(
    "GET",
    "https://random-word-api.herokuapp.com/word?number=1000"
  );
  return result;
}

function setWords() {
  currWord = wordList[wordIndex];
  let calc = "";
  for (let i = 0; i < currWord.length; i++) {
    calc = calc + `<h2>${currWord[i]}</h2>`;
  }
  currWordDisplay.innerHTML = calc;

  nextWord = wordList[wordIndex + 1];
  nextWordDisplay.innerHTML = nextWord;

  if (wordIndex == 0) {
    prevWord = "";
    prevWordDisplay.innerHTML = prevWord;
  } else {
    prevWord = wordList[wordIndex - 1];
    prevWordDisplay.innerHTML = prevWord;
  }
}

function setTime(t) {
  time = t;
  if (time < 0) time = "DONE";
  timeDisplay.innerHTML = `TIME: ${time}`;
  if (time !== "DONE") timeDisplay.innerHTML = timeDisplay.innerHTML + "s";
}

function setWpm(w) {
  wpm = w;
  wpmDisplay.innerHTML = `WPM: ${wpm}`;
}

function setAcc(a) {
  acc = a;
  accDisplay.innerHTML = `ACCURACY: ${acc}%`;
}

function updatePersonalBestDisplay() {
  let display = document.querySelector("#personalBestHeader");
  let best = getBest(getUsername());
  if (best === null) display.innerHTML = `Personal Best || N/A`;
  else
    display.innerHTML = `Peronsal Best || WPM: ${best["wpm"]} | Accuracy: ${best["acc"]}%`;
}

function initializeGame() {
  gameStarted = false;
  gameFinished = false;
  wordList = [];
  for (let i = 0; i < 300; i++) {
    wordList.push(listOfWords[getRandomInt(listOfWords.length)]);
  }
  wordIndex = 0;
  charIndex = 0;
  setWords();
  numPress = 0;
  numCorrect = 0;
  setTime(15);
  setWpm(0);
  setAcc(0);
  document
    .querySelector(".play-header")
    .style.removeProperty("background-color");
}

function gameKeydownFunction(event) {
  // DETERMINE IF RESTART
  if (helpScreenGone && event.key == "Escape") {
    console.log("RESTARTING GAME");
    initializeGame();
    return;
  }

  // DETERMINE IF STARTING GAME
  if (helpScreenGone && !gameStarted && !gameFinished) {
    console.log("STARTING GAME");
    gameStarted = true;
    myWorker.postMessage({ gameStarted: gameStarted });
  }

  // DETERMINE IF INCORRECT LETTER
  if (gameStarted && event.key != currWord[charIndex] && !gameFinished) {
    console.log("INCORRECT LETTER");
    numPress = numPress + 1;
  }

  // DETERMINE IF CORRECT LETTER
  if (
    gameStarted &&
    event.key == currWord[charIndex] &&
    charIndex != currWord.length - 1 &&
    !gameFinished
  ) {
    console.log("CORRECT LETTER");
    document
      .querySelector(`#currword :nth-child(${charIndex + 1})`)
      .style.setProperty("color", "var(--text-color2)");
    charIndex = charIndex + 1;
    numPress = numPress + 1;
    numCorrect = numCorrect + 1;
  }

  // DETERMINE IF CORRECT AND END OF WORD
  if (
    gameStarted &&
    event.key == currWord[charIndex] &&
    charIndex == currWord.length - 1 &&
    !gameFinished
  ) {
    wordIndex = wordIndex + 1;
    charIndex = 0;
    setWords();
  }

  // UPDATE STATS
  acc = numCorrect / numPress;
  document.querySelector("#ACC").innerHTML = `ACCURACY: ${
    Math.trunc(acc * 1000) / 10
  }%`;
}

async function setupsAndListeners() {
  // INITIALIZING GLOBAL VARIABLES
  await initializeVariables();

  // INITIAL ELEMENT CHANGES
  document.querySelector("#greeting").innerHTML = `Hello, ${getUsername()}.`;
  updatePersonalBestDisplay();

  // PLAY BUTTON ON CLICK LISTENER
  document
    .querySelector("#play-button")
    .addEventListener("click", playButtonFunction);

  // RESTART BUTTON ON CLICK LISTENER
  document.querySelector("#restart-button").addEventListener("click", () => {
    initializeGame();
  });

  // GAME KEYDOWN LISTENER
  document.addEventListener("keydown", gameKeydownFunction);

  console.log("LISTENERS SET");
}

document.addEventListener("DOMContentLoaded", setupsAndListeners);
