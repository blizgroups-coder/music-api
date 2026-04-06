const { Pool } = require("pg");

let pool;

/// Detect Render environment
if (process.env.DATABASE_URL) {

  // 🌐 Render PostgreSQL connection
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log("Using Render PostgreSQL");

} else {

  // 💻 Local PostgreSQL connection
  pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "music_app",
    password: "music123",
    port: 5432
  });

  console.log("Using Local PostgreSQL");

}

/// Test connection
pool.connect()
  .then(client => {
    console.log("✅ Database connected successfully");
    client.release();
  })
  .catch(err => {
    console.error("❌ Database connection error:", err.message);
  });

module.exports = pool;