var express = require("express");
var router = express.Router();

// GET /api/games[?name=svart]
router.get("/", async (req, res) => {
  const { title } = req.query;

  const db = req.app.locals.db;

  const games = title ? await searchGame(title, db) : await getGames(db);

  res.json(games);
});

//GET /api/games/:urlSlug
router.get("/:urlSlug", async (req, res) => {
  const { urlSlug } = req.params;

  const db = req.app.locals.db;

  const game = await getGame(urlSlug, db);

  if (!game) {
    res.status(404).send();
    return;
  }

  res.json(game);
});

//GET /api/games/{urlSlug}/highscores
router.get("/:urlSlug/highscores", async (req, res) => {
  const { urlSlug } = req.params;

  const db = req.app.locals.db;

  const scores = await getGameScores(urlSlug, db);

  if (!scores) {
    res.status(404).send();
    return;
  }
  res.json(scores);
});

// POST /api/games
router.post("/", async (req, res) => {
  const { title, genre, description, launchDate, imageUrl } = req.body;

  const game = {
    title,
    genre,
    description,
    launchDate,
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
        TO_CHAR (game.launch_date, 'YYYY') AS launch_date,
        image_url,
        url_slug
    FROM game
    WHERE title ILIKE '%' || $1 || '%'
  `;

  const result = await db.query(sql, [title]);

  return result.rows;
}

async function getGame(urlSlug, db) {
  const sql = `
    SELECT id,
    title,
    genre,
    description,
    TO_CHAR (game.launch_date, 'YYYY-MM-DD') AS launch_date,
    image_url,
    url_slug
      FROM game
     WHERE url_slug = $1
  `;

  const result = await db.query(sql, [urlSlug]);

  const game = result.rows.length > 0 ? result.rows[0] : undefined;

  return game;
}

async function getGames(db) {
  const sql = `
        SELECT 
          id,
          title,
          genre,
          description,
          TO_CHAR (game.launch_date, 'YYYY') AS launch_date,
          image_url,
          url_slug
        FROM game
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
          TO_CHAR (game.launch_date, 'YYYY-MM-DD') AS launch_date,
          image_url,
          url_slug
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
  `;

  const result = await db.query(sql, [
    game.title,
    game.genre,
    game.description,
    game.launchDate,
    game.imageUrl,
    game.urlSlug,
  ]);

  return result.rows[0].id;
}

async function getGameScores(urlSlug, db) {
  const sql = `
      SELECT 
             game.title,
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
         `;

  const result = await db.query(sql, [urlSlug]);

  return result.rows;
}

const generateURLSlug = (title) =>
  title.replace("-", "").replace(" ", "-").toLowerCase();

const capitalizeInitial = (string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

module.exports = router;
