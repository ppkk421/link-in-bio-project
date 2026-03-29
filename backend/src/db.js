import path from "node:path";
import sqlite3 from "sqlite3";

sqlite3.verbose();

const DB_PATH = path.resolve(process.cwd(), "database.sqlite");

export function openDb() {
  return new sqlite3.Database(DB_PATH);
}

export function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function initDb(db) {
  await run(
    db,
    `
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      bio TEXT NOT NULL,
      avatarUrl TEXT NOT NULL
    );
  `
  );

  await run(
    db,
    `
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      iconName TEXT NOT NULL
    );
  `
  );

  const existingProfile = await get(db, "SELECT id FROM profile LIMIT 1");
  if (!existingProfile) {
    await run(
      db,
      "INSERT INTO profile (id, name, bio, avatarUrl) VALUES (1, ?, ?, ?)",
      [
        "Your Name",
        "Passionate about tech & innovation. Always learning, building, and sharing.",
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=256&h=256&q=70",
      ]
    );
  }

  const existingLinks = await get(db, "SELECT id FROM links LIMIT 1");
  if (!existingLinks) {
    const seed = [
      ["YouTube Channel", "https://youtube.com/", "youtube"],
      ["Instagram", "https://instagram.com/", "instagram"],
      ["My Portfolio / Website", "https://example.com", "globe"],
      ["CV / Resume", "https://example.com/resume.pdf", "file"],
      ["Contact Me (Email)", "mailto:you@example.com", "mail"],
    ];
    for (const [title, url, iconName] of seed) {
      await run(db, "INSERT INTO links (title, url, iconName) VALUES (?, ?, ?)", [
        title,
        url,
        iconName,
      ]);
    }
  }
}

