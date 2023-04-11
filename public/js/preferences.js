let username = "Guest";

export const colorPalettes = {
  original: {
    "--text-color1": "rgb(255, 255, 255)",
    "--text-color2": "rgb(255, 214, 31)",
    "--text-color3": "rgb(189, 189, 189)",
    "--background-color1": "rgb(37, 37, 41)",
    "--background-color2": "rgb(51, 51, 56)",
    "--background-color3": "rgb(255, 214, 31)",
    "--background-color4": "rgb(86, 86, 95)",
  },
  greyscale: {
    "--text-color1": "black",
    "--text-color2": "#707070",
    "--text-color3": "#949494",
    "--background-color1": "#c7c5c5",
    "--background-color2": "#dbd8e3",
    "--background-color3": "#d3d6db",
    "--background-color4": "#d3d6db",
  },
  dark: {
    "--text-color1": "#FFFFFF",
    "--text-color2": "#FF0A0A",
    "--text-color3": "#B6B6B6",
    "--background-color1": "#000000",
    "--background-color2": "#252525",
    "--background-color3": "#FF0A0A",
    "--background-color4": "#474747",
  },
};

export function changeColorPalette(palette) {
  let newPalette;
  if (!(palette in colorPalettes)) {
    console.log(`PALETTE NOT FOUND`);
    return;
  }
  newPalette = colorPalettes[palette];
  localStorage.setItem("keyboardHeroColorPalette", JSON.stringify(newPalette));
  applyColorPalette();
}

function applyColorPalette() {
  let colorPalette = JSON.parse(
    localStorage.getItem("keyboardHeroColorPalette")
  );
  if (colorPalette === null) {
    console.log(`NO COLOR PALETTE FOUND`);
    return;
  }
  console.log(`COLOR PALETTE FOUND`);
  let r = document.querySelector(":root");
  for (const [key, value] of Object.entries(colorPalette)) {
    r.style.setProperty(key, value);
  }
}

function loadUsername() {
  let u = localStorage.getItem("keyboardHeroUsername");
  if (u === null) {
    console.log('NO USERNAME FOUND. SETTING TO "Guest".');
    localStorage.setItem("keyboardHeroUsername", "Guest");
    u = "Guest";
  }
  username = u;
}

export function getUsername() {
  return username;
}

export function setUsername(u) {
  u = u.trim();
  if (u.length === 0) throw `ERROR: u must be a non-empty string`;
  username = u;
  localStorage.setItem("keyboardHeroUsername", username);
}

function setupsAndListeners() {
  loadUsername();
  applyColorPalette();
}

document.addEventListener("DOMContentLoaded", setupsAndListeners);
