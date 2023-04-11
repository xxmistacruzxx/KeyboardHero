import {
  getUsername,
  setUsername,
  colorPalettes,
  changeColorPalette,
} from "/public/js/preferences.js";
function colorPaletteButtonListener(e) {
  if (!(e.target.value in colorPalettes)) {
    console.log(`e.target.value is invald: ${e.target.value}`);
    return;
  }
  changeColorPalette(e.target.value);
}

function setupColorPaletteButtons() {
  let buttons = document.querySelectorAll(".color-palette-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", colorPaletteButtonListener);
  }
}

function updateUsername() {
  let inputtedUsername = document.querySelector("#username-input").value;
  let feedbackDisplay = document.querySelector("#username-feedback");
  try {
    setUsername(inputtedUsername);
    feedbackDisplay.innerHTML = `Username successfully changed to ${inputtedUsername}.`;
  } catch (e) {
    feedbackDisplay.innerHTML = `Failed to set username: ${e}`;
  }
}

function setupUsernameButtons() {
  document.querySelector("#username-input").value = getUsername();
  document.querySelector("#username-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") updateUsername();
  });
  document
    .querySelector("#username-submit")
    .addEventListener("click", updateUsername);
}

function setupsAndListeners() {
  setupColorPaletteButtons();
  setupUsernameButtons();
}

document.addEventListener("DOMContentLoaded", setupsAndListeners);
