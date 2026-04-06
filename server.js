const express = require("express");
const cors = require("cors");

const songsRoutes = require("./routes/songs");
const uploadRoutes = require("./routes/upload");
const authRoutes = require("./routes/auth");
const streamRoutes = require("./routes/stream");
const playlistRoutes = require("./routes/playlists");
const likesRoutes = require("./routes/likes");   // ❤️ NEW ROUTE

const app = express();

/// Enable CORS for Flutter Web
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

/// Serve uploaded files
app.use("/music", express.static("uploads/music"));
app.use("/covers", express.static("uploads/covers"));

/// API routes
app.use("/api/songs", songsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/likes", likesRoutes);   // ❤️ CONNECT LIKES API

/// Main route
app.get("/", (req, res) => {
  res.send("Music API Running");
});

/// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "API running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});