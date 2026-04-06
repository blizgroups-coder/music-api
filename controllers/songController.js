const pool = require("../database/db");

// GET ALL SONGS
const getSongs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM songs ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// SEARCH SONGS
const searchSongs = async (req, res) => {
  try {
    const search = req.query.q;

    const result = await pool.query(
      "SELECT * FROM songs WHERE title ILIKE $1 OR artist ILIKE $1",
      [`%${search}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
};

// PLAY SONG
const playSong = async (req, res) => {
  try {
    const songId = req.params.id;

    const result = await pool.query(
      "UPDATE songs SET plays = plays + 1 WHERE id = $1 RETURNING *",
      [songId]
    );

    res.json({
      message: "Play count updated",
      song: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Play update failed" });
  }
};

// TRENDING SONGS
const getTrendingSongs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM songs ORDER BY plays DESC LIMIT 20"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Trending songs error" });
  }
};

module.exports = {
  getSongs,
  searchSongs,
  playSong,
  getTrendingSongs
};