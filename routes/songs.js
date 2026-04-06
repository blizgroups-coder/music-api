const express = require("express");
const router = express.Router();
const pool = require("../db");


// GET all songs
router.get("/", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM songs ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to fetch songs" });

  }

});


// SEARCH songs
router.get("/search", async (req, res) => {

  try {

    const q = req.query.q;

    // PREVENT EMPTY SEARCH
    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const result = await pool.query(
      `SELECT * FROM songs
       WHERE title ILIKE $1
       OR artist ILIKE $1`,
      [`%${q}%`]
    );

    res.json(result.rows);

  } catch (error) {

    console.error("SEARCH ERROR:", error);
    res.status(500).json({ error: "Search failed" });

  }

});


// TRENDING songs
router.get("/trending", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM songs ORDER BY plays DESC LIMIT 20"
    );

    res.json(result.rows);

  } catch (error) {

    console.error("TRENDING ERROR:", error);

    res.status(500).json({
      error: "Failed to load trending songs"
    });

  }

});


// ⭐ TOP CHARTS (NEW)
router.get("/top", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM songs ORDER BY plays DESC LIMIT 50"
    );

    res.json(result.rows);

  } catch (error) {

    console.error("TOP CHARTS ERROR:", error);

    res.status(500).json({
      error: "Failed to load top charts"
    });

  }

});


// GET single song
router.get("/:id", async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "Invalid song id" });
    }

    const result = await pool.query(
      "SELECT * FROM songs WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error("SONG FETCH ERROR:", error);
    res.status(500).json({ error: "Failed to fetch song" });

  }

});


// PLAY COUNT + UPDATE RECENTLY PLAYED
router.post("/play/:id", async (req, res) => {

  try {

    const id = req.params.id;

    await pool.query(
      `UPDATE songs
       SET plays = plays + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );

    res.json({ message: "Play count updated" });

  } catch (error) {

    console.error("PLAY COUNT ERROR:", error);
    res.status(500).json({ error: "Play update failed" });

  }

});


// RECENTLY PLAYED
router.get("/recent", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM songs ORDER BY updated_at DESC LIMIT 20"
    );

    res.json(result.rows);

  } catch (error) {

    console.error("RECENT ERROR:", error);
    res.status(500).json({ error: "Failed to fetch recent songs" });

  }

});


module.exports = router;