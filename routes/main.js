import { Router } from "express";
const router = Router();
const gameScripts = `<script rel="javascript" type="module" src="/public/js/helpers.js"></script><script rel="javascript" type="module" src="/public/js/leaderboard.js"></script><script rel="javascript" type="module" src="/public/js/game.js"></script>`;
const leaderboardScripts = `<script rel="javascript" type="module" src="/public/js/leaderboard.js"></script><script rel="javascript" type="module" src="/public/js/leaderboardPage.js"></script>`;
const settingsScripts = `<script rel="javascript" type="module" src="/public/js/settings.js"></script>`;

router.route("/").get(async (req, res) => {
  return res.render("game", { scripts: gameScripts });
});

router.route("/leaderboard").get(async (req, res) => {
  return res.render("leaderboard", { scripts: leaderboardScripts });
});

router.route("/settings").get(async (req, res) => {
  return res.render("settings", { scripts: settingsScripts });
});

export default router;
