const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

let db;

/**
 * DB file can be overridden by env var DB_PATH.
 * Default: ./data/app.db
 */
function getDbPath() {
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  return process.env.DB_PATH || path.join(dataDir, "app.db");
}

function openDb() {
  if (db) return db;
  db = new sqlite3.Database(getDbPath());
  // Enable FK constraints
  db.exec("PRAGMA foreign_keys = ON;");
  return db;
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    openDb().run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    openDb().get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    openDb().all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function initDb() {
  openDb();
  await run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )`
  );

  await run(
    `CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      videoId TEXT NOT NULL,
      title TEXT NOT NULL,
      channelTitle TEXT,
      thumbnailUrl TEXT,
      createdAt TEXT NOT NULL,
      UNIQUE(userId, videoId),
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )`
  );
}

module.exports = { run, get, all, initDb };
