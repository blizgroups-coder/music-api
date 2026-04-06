const express = require("express");
const router = express.Router();

const { getSongs, searchSongs } = require("../controllers/songController");

// GET all songs
router.get("/", getSongs);

// SEARCH songs
router.get("/search", searchSongs);

module.exports = router;