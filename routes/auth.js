const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/db");

const SECRET = "music_app_secret";


// ============================
// ARTIST REGISTER
// ============================

router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO artists (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email",
      [name, email, hashedPassword]
    );

    res.json({
      message: "Artist registered successfully",
      artist: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Artist registration failed"
    });

  }
});


// ============================
// ARTIST LOGIN
// ============================

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM artists WHERE email=$1",
      [email]
    );

    const artist = result.rows[0];

    if (!artist) {
      return res.status(400).json({
        error: "Artist not found"
      });
    }

    const valid = await bcrypt.compare(password, artist.password);

    if (!valid) {
      return res.status(401).json({
        error: "Invalid password"
      });
    }

    const token = jwt.sign(
      { artistId: artist.id },
      SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Artist login successful",
      token: token,
      artist: {
        id: artist.id,
        name: artist.name,
        email: artist.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Artist login failed"
    });

  }
});


// ============================
// USER REGISTER
// ============================

router.post("/user/register", async (req, res) => {
  try {

    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING id,email",
      [email, hashedPassword]
    );

    res.json({
      message: "User registered successfully",
      user: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(400).json({
      error: "User already exists"
    });

  }
});


// ============================
// USER LOGIN
// ============================

router.post("/user/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        error: "Invalid password"
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "User login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Login failed"
    });

  }
});

module.exports = router;