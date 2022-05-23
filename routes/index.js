var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  const db = req.app.locals.db;

  const sql = `
 SELECT DISTINCT ON (game.title) 
                   game.title,
                   game.url_slug,
                   score.player,
                   score.highscore,
           TO_CHAR (score.score_date, 'YYYY-MM-DD') AS score_date
              FROM game
        INNER JOIN score
                ON score.game_id = game.id
          ORDER BY game.title
  `;
  const result = await db.query(sql);

  res.render("index", {
    title: "Highscore",
    highscores: result.rows,
  });
});

module.exports = router;
