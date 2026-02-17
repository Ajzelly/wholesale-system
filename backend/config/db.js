const mysql = require('mysql2/promise');

const pool = mysql.createPool(process.env.DATABASE_URL);

pool.getConnection()
  .then(() => console.log('✅ Connected to MySQL Database'))
  .catch(err => console.error('DB Connection Error:', err.message));

module.exports = pool;
