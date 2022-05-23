var express = require("express");
var router = express.Router();

router.get("/new", async (req, res) => {
  const db = req.app.locals.db;

  const sql = `
      SELECT id, 
             title
        FROM game
  `;

  const result = await db.query(sql);

  const games = result.rows;

  res.render("admin/score/new", {
    title: "Administration",
    games,
  });
});

router.post("/new", async (req, res) => {
  const { player, scoreDate, highscore, title } = req.body;
  const db = req.app.locals.db;
  const gameId = await getGameId(title, db);

  const newScore = {
    player,
    scoreDate,
    highscore,
    gameId: gameId.id,
  };

  await saveHighscore(newScore, db);

  res.redirect("/admin/games");
});

async function getGameId(title, db) {
  const sql = `
  SELECT id
  FROM game
  WHERE title = $1
  `;

  const result = await db.query(sql, [title]);
  return result.rows[0];
}

async function saveHighscore(highscore, db) {
  const sql = `
        INSERT INTO score(
          player,
          score_date,
          highscore,
          game_id
        ) VALUES ($1,$2,$3,$4)
    `;

  await db.query(sql, [
    highscore.player,
    highscore.scoreDate,
    highscore.highscore,
    highscore.gameId,
  ]);
}

module.exports = router;
