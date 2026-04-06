const express = require("express");
const router = express.Router();
const multer = require("multer");
const pool = require("../database/db");

// Storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "song") {
      cb(null, "uploads/music");
    } else if (file.fieldname === "cover") {
      cb(null, "uploads/covers");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload song route
router.post(
  "/",
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files.song || !req.files.cover) {
        return res.status(400).json({
          error: "Song file and cover image are required",
        });
      }

      const songFile = req.files.song[0].filename;
      const coverFile = req.files.cover[0].filename;

      const { title, artist, album, duration } = req.body;

      const result = await pool.query(
        `INSERT INTO songs 
        (title, artist, album, duration, file_url, cover_url) 
        VALUES ($1,$2,$3,$4,$5,$6) 
        RETURNING *`,
        [
          title,
          artist,
          album,
          duration,
          "/music/" + songFile,
          "/covers/" + coverFile,
        ]
      );

      res.json({
        message: "Song uploaded successfully",
        song: result.rows[0],
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Upload failed",
      });
    }
  }
);

module.exports = router;