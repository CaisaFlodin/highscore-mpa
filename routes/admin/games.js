var express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {
  const db = req.app.locals.db;

  const games = await getGames(db);

  res.render("admin/games/index", {
    title: "Administation",
    games,
  });
});

router.get("/new", async (req, res) => {
  res.render("admin/games/new", {
    title: "Administration",
  });
});

router.post("/new", async (req, res) => {
  const { title, description, imageUrl, genre, launchYear } = req.body;

  const newGame = {
    title,
    description,
    imageUrl,
    genre: capitalizeInitial(genre),
    launchYear,
    urlSlug: generateUrlSlug(title),
  };

  const db = req.app.locals.db;

  await saveGame(newGame, db);

  res.redirect("/admin/games");
});

const generateUrlSlug = (title) =>
  title.replace("-", "").replace(" ", "-").toLowerCase();

const capitalizeInitial = (string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

async function saveGame(game, db) {
  const sql = `
    INSERT INTO game (
      title,
      description,
      image_url,
      genre,
      launch_year,
      url_slug
    ) VALUES ($1, $2, $3, $4, $5, $6)`;

  await db.query(sql, [
    game.title,
    game.description,
    game.imageUrl,
    game.genre,
    game.launchYear,
    game.urlSlug,
  ]);
}

async function getGames(db) {
  const sql = `
    SELECT id,
           title,
           description,
           image_url,
           genre,
           launch_year,
           url_slug
    FROM game
  `;

  const result = await db.query(sql);

  return result.rows;
}

module.exports = router;
