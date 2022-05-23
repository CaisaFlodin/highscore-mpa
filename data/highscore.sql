CREATE DATABASE highscore 

CREATE TABLE game (
  id INTEGER GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(50) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  description VARCHAR(500) NOT NULL,
  launch_date DATE NOT NULL,
  image_url VARCHAR(250) NOT NULL,
  url_slug VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (url_slug)
);

CREATE TABLE score (
  id INTEGER GENERATED ALWAYS AS IDENTITY,
  player VARCHAR(50) NOT NULL,
  highscore INTEGER NOT NULL,
  score_date DATE NOT NULL,
  game_id INTEGER,
  FOREIGN KEY (game_id) 
  REFERENCES game (id),
  PRIMARY KEY (id)
);

INSERT INTO
  game (
    title,
    genre,
    description,
    launch_date,
    image_url,
    url_slug
  )
VALUES
  (
    'Tetris',
    'Puzzle',
    'Tetris is a puzzle game in which geometric shapes 
	  called "tetrominoes" fall down onto a playing field, 
	  and the player has to arrange them to form gapless lines.',
    '1984-06-06',
    'https://cdn.pixabay.com/photo/2017/01/31/19/34/building-blocks-2026721__480.png',
    'tetris'
  ),
  (
    'Pac-Man',
    'Arcade',
    'Pac-Man is an action maze chase video game; the player controls the eponymous character through an enclosed maze. 
	  The objective of the game is to eat all of the dots placed in the maze while
	  avoiding four colored ghosts — Blinky (red), Pinky (pink), Inky (cyan), and Clyde (orange) — that pursue him.',
    '1980-05-22',
    'https://cdn.pixabay.com/photo/2016/04/16/09/03/video-game-1332694_960_720.png',
    'pac-man'
  ),
  (
    'Asteroids',
    'Arcade',
    'Asteroids is a space-themed multidirectional shooter arcade game designed by Lyle Rains and Ed Logg released in November 1979 by Atari, Inc.
    The player controls a single spaceship in an asteroid field which is periodically traversed by flying saucers.',
    '1979-11-12',
    'https://www.pngkey.com/png/full/560-5600934_asteroid-asteroids-game.png',
    'asteroids'
  ),
  (
    'Donkey Kong',
    'Platform',
    'Donkey Kong is a video game series created by Shigeru Miyamoto. It follows the adventures of an ape named Donkey Kong and his clan of other apes and monkeys. The franchise primarily consists of platform games, originally single-screen action puzzle games and later side-scrolling platformers.',
    '1981-07-09',
    'https://cdn.pixabay.com/photo/2021/03/03/14/15/donkey-kong-6065405_960_720.png',
    'donkey-kong'
  ),
  (
    'Super Tetris',
    'Puzzle',
    'Super Tetris is a Tetris variant. It contains additional features such as different types of gameplay (two player cooperative and competitive) as well as new block types (lightning bolts that eliminate an entire row, and bombs that eliminate from 2 to 16 blocks).',
    '1991-12-30',
    'https://upload.wikimedia.org/wikipedia/en/5/54/Super_Tetris_cover.jpg',
    'super-tetris'
  );

INSERT INTO
  score (player, highscore, score_date, game_id)
VALUES
  ('Post Malone', 378672, '2021-12-10', 2),
  (
    'Tina Turner',
    1543004,
    '2019-02-09',
    4
  ),
  (
    'Chuck Berry',
    923403,
    '2022-01-27',
    1
  ),
  (
    'Barbra Streisand',
    2100482,
    '2018-07-03',
    3
  ),
  (
    'Nicki Minaj',
    654619,
    '2022-04-19',
    5
  );