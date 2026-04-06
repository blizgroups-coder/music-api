const express = require("express");
const router = express.Router();
const pool = require("../db");
const fs = require("fs");
const path = require("path");

router.get("/:id", async (req, res) => {
  try {
    const songId = req.params.id;

    // get song from database
    const result = await pool.query(
      "SELECT * FROM songs WHERE id = $1",
      [songId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    const song = result.rows[0];

    // 🔥 increase play count automatically
    await pool.query(
      "UPDATE songs SET plays = plays + 1 WHERE id = $1",
      [songId]
    );

    // path to music file
    const filePath = path.join(__dirname, "../uploads/music", song.file_name);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Music file not found" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      });

      fs.createReadStream(filePath).pipe(res);
    }

  } catch (error) {
    console.error("STREAM ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;