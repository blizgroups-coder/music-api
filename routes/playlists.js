const express = require("express");
const router = express.Router();
const pool = require("../db");

// Create playlist
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      "INSERT INTO playlists (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
});

// Get all playlists
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM playlists ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// Add song to playlist
router.post("/:playlistId/song/:songId", async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const result = await pool.query(
      "INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1,$2) RETURNING *",
      [playlistId, songId]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add song to playlist" });
  }
});

// Get songs from playlist
router.get("/:id/songs", async (req, res) => {
  try {
    const playlistId = req.params.id;

    const result = await pool.query(
      `SELECT songs.* FROM playlist_songs
       JOIN songs ON songs.id = playlist_songs.song_id
       WHERE playlist_songs.playlist_id = $1`,
      [playlistId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch playlist songs" });
  }
});

module.exports = router;