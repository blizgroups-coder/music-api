const pool = require('../db');

exports.unlikeSong = async (req, res) => {
  const userId = req.user.id;
  const songId = req.params.songId;

  try {

    await pool.query(
      'DELETE FROM likes WHERE user_id = $1 AND song_id = $2',
      [userId, songId]
    );

    res.json({
      message: "Song unliked"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};