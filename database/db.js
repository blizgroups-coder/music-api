const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "music_app",
  password: "music123",
  port: 5432,
});

module.exports = pool;