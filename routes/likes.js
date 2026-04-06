const express = require("express");
const router = express.Router();
const pool = require("../database/db");

/// LIKE SONG
router.post("/:songId", async (req, res) => {

  const { songId } = req.params;
  const { userId } = req.body;

  try {

    // Prevent duplicate likes
    const existing = await pool.query(
      "SELECT * FROM liked_songs WHERE user_id=$1 AND song_id=$2",
      [userId, songId]
    );

    if (existing.rows.length > 0) {
      return res.json({ message: "Song already liked" });
    }

    await pool.query(
      "INSERT INTO liked_songs (user_id, song_id) VALUES ($1,$2)",
      [userId, songId]
    );

    res.json({ message: "Song liked" });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to like song"
    });

  }

});


/// GET LIKED SONGS
router.get("/:userId", async (req, res) => {

  const { userId } = req.params;

  try {

    const result = await pool.query(
      `SELECT songs.*
       FROM liked_songs
       JOIN songs ON songs.id = liked_songs.song_id
       WHERE liked_songs.user_id=$1`,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to load liked songs"
    });

  }

});


/// UNLIKE SONG
router.delete("/:songId/:userId", async (req, res) => {

  const { songId, userId } = req.params;

  try {

    await pool.query(
      "DELETE FROM liked_songs WHERE song_id=$1 AND user_id=$2",
      [songId, userId]
    );

    res.json({ message: "Song removed from likes" });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to remove like"
    });

  }

});

module.exports = router;