let time = 15;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

onmessage = async function (e) {
  if ("gameStarted" in e.data && e.data["gameStarted"] == true) {
    await sleep(100);
    time = Math.trunc((time - 0.1) * 10) / 10;
    postMessage({ time: time });
  }
  if ("gameStarted" in e.data && e.data["gameStarted"] == false) {
    time = 15;
  }
};
