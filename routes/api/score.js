var express = require("express");
var router = express.Router();

// GET /api/scores
router.get("/", async (req, res) => {
  const { title } = req.query;

  const db = req.app.locals.db;

  const games = title
    ? await searchGame(title, db)
    : await getGlobalHighscores(db);

  res.json(games);
});

// GET /api/scores/highscores
router.get("/highscores", async (req, res) => {
  const db = req.app.locals.db;

  const highscores = await getHighscores(db);

  if (!highscores) {
    res.status(404).send([]);
    return;
  }

  res.json(highscores);
});

// POST /api/games
router.post("/", async (req, res) => {
  const { title, genre, description, launchYear, imageUrl, urlSlug } = req.body;

  const game = {
    title,
    genre,
    description,
    launchYear,
    imageUrl,
    urlSlug: generateURLSlug(title),
  };

  // TODO implementera validering (400 Bad Request)

  const db = req.app.locals.db;

  game.id = await saveGame(game, db);

  // Sätt Location-headern till "/api/games/svart-tshirt" (t.ex.)
  res.location(`/api/games/${game.urlSlug}`);

  // Returnera 201 Created; vi skickar tillbaka en representation
  // av produkten
  res.status(201).send(game);
});

// DELETE /api/games/{id}
router.delete("/:id", async (req, res) => {
  const gameId = req.params.id;

  const db = req.app.locals.db;

  // TODO kapsla in i klass
  await deleteGame(gameId, db);

  // 204 No Content
  res.status(204).send();
});

async function deleteGame(id, db) {
  const sql = `
    DELETE FROM game
          WHERE id = $1
  `;

  await db.query(sql, [id]);
}

async function searchGame(title, db) {
  const sql = `
    SELECT 
    id,
    title,
    genre,
    description,
    launch_year,
    image_url,
    url_slug
      FROM game
    WHERE title ILIKE '%' || $1 || '%'
  `;

  const result = await db.query(sql, [title]);

  return result.rows;
}

async function getGlobalHighscores(db) {
  const sql = `
        SELECT DISTINCT ON (game.title) 
                   game.title,
                   game.url_slug,
                   score.player,
                   score.highscore,
           TO_CHAR (score.score_date, 'YYYY-MM-DD') AS score_date
              FROM game
        LEFT JOIN score
                ON score.game_id = game.id
          ORDER BY game.title
    `;

  const result = await db.query(sql);

  return result.rows;
}

async function saveGame(game, db) {
  const sql = `
      INSERT INTO game (
          title,
    genre,
    description,
    launch_year,
    image_url,
    url_slug
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
  `;

  const result = await db.query(sql, [
    game.title,
    game.genre,
    game.description,
    game.launchYear,
    game.imageUrl,
    game.urlSlug,
  ]);

  return result.rows[0].id;
}

const generateURLSlug = (title) =>
  title.replace("-", "").replace(" ", "-").toLowerCase();

module.exports = router;
