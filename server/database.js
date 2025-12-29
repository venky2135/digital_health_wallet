const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'health_wallet.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database ' + dbPath + ': ' + err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )`);

    // Reports Table
    db.run(`CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      original_name TEXT,
      type TEXT,
      date DATE,
      vitals TEXT, -- JSON string for associated vitals
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Vitals Table (for tracking trends independent of reports)
    db.run(`CREATE TABLE IF NOT EXISTS vitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT, -- e.g., 'BP', 'Sugar', 'HeartRate'
      value TEXT,
      date DATE,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Shares Table
    db.run(`CREATE TABLE IF NOT EXISTS shares (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id INTEGER,
      owner_id INTEGER,
      shared_with_email TEXT,
      permission TEXT DEFAULT 'view',
      FOREIGN KEY(report_id) REFERENCES reports(id),
      FOREIGN KEY(owner_id) REFERENCES users(id)
    )`);
  });
}

module.exports = db;
