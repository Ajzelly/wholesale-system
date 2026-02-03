const db = require('../config/db');

class User {
  static create(userData) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO users SET ?', userData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
}

module.exports = User;
