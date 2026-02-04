const mysql = require('mysql2/promise');  // <-- use /promise here
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(() => console.log('✅ Connected to MySQL Database'))
  .catch(err => console.error('DB Connection Error:', err.message));

module.exports = pool;
