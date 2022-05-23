var express = require("express");
var router = express.Router();

/*GET http://localhost:3000/games/urlSlug */
router.get("/:urlSlug", async function (req, res) {
  const urlSlug = req.params.urlSlug;

  const db = req.app.locals.db;

  const sql = `
      SELECT game.id,
             game.title,
             game.genre,
             game.description,
             game.launch_year,
             game.image_url,
             game.url_slug,
             score.score_date,
             score.player,
             score.highscore,
     TO_CHAR (score.score_date, 'YYYY-MM-DD') AS score_date
        FROM game
  LEFT JOIN score
          ON game.id = score.game_id
       WHERE game.url_slug = $1
       ORDER BY score.highscore DESC
       LIMIT 10;
  `;

  const result = await db.query(sql, [urlSlug]);

  const { title, genre, description, launch_year, image_url, url_slug } =
    result.rows[0];

  const game = {
    title: title,
    genre: genre,
    description: description,
    launch_year: launch_year,
    image_url: image_url,
    url_slug: url_slug,
  };

  const scores = result.rows.map((highscore) => ({
    player: highscore.player,
    highscore: highscore.highscore,
    score_date: highscore.score_date,
  }));

  res.render("games/details", {
    title: game.title,
    game,
    scores,
  });
});

module.exports = router;
