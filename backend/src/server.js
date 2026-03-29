import express from "express";
import cors from "cors";

import { openDb, initDb, all, get, run } from "./db.js";
import { MOCK_TOKEN, requireAuth } from "./auth.js";

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const db = openDb();
await initDb(db);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/login", (req, res) => {
  const password = String(req.body?.password || "");
  if (password !== "admin123") {
    return res.status(401).json({ error: "Invalid password" });
  }
  res.json({ token: MOCK_TOKEN });
});

app.get("/api/profile", async (_req, res) => {
  const row = await get(db, "SELECT id, name, bio, avatarUrl FROM profile WHERE id = 1");
  res.json(row);
});

app.get("/api/links", async (_req, res) => {
  const rows = await all(db, "SELECT id, title, url, iconName FROM links ORDER BY id DESC");
  res.json(rows);
});

app.put("/api/profile", requireAuth, async (req, res) => {
  const name = String(req.body?.name ?? "").slice(0, 80);
  const bio = String(req.body?.bio ?? "").slice(0, 220);
  const avatarUrl = String(req.body?.avatarUrl ?? "").slice(0, 2048);

  if (!name.trim()) return res.status(400).json({ error: "name is required" });
  if (!bio.trim()) return res.status(400).json({ error: "bio is required" });
  if (!avatarUrl.trim()) return res.status(400).json({ error: "avatarUrl is required" });

  await run(
    db,
    "UPDATE profile SET name = ?, bio = ?, avatarUrl = ? WHERE id = 1",
    [name.trim(), bio.trim(), avatarUrl.trim()]
  );

  const row = await get(db, "SELECT id, name, bio, avatarUrl FROM profile WHERE id = 1");
  res.json(row);
});

app.post("/api/links", requireAuth, async (req, res) => {
  const title = String(req.body?.title ?? "").slice(0, 80).trim();
  const url = String(req.body?.url ?? "").slice(0, 2048).trim();
  const iconName = String(req.body?.iconName ?? "globe").slice(0, 32).trim() || "globe";

  if (!title) return res.status(400).json({ error: "title is required" });
  if (!url) return res.status(400).json({ error: "url is required" });

  const result = await run(
    db,
    "INSERT INTO links (title, url, iconName) VALUES (?, ?, ?)",
    [title, url, iconName]
  );

  const row = await get(db, "SELECT id, title, url, iconName FROM links WHERE id = ?", [
    result.lastID,
  ]);
  res.status(201).json(row);
});

app.put("/api/links/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "invalid id" });

  const title = String(req.body?.title ?? "").slice(0, 80).trim();
  const url = String(req.body?.url ?? "").slice(0, 2048).trim();
  const iconName = String(req.body?.iconName ?? "globe").slice(0, 32).trim() || "globe";

  if (!title) return res.status(400).json({ error: "title is required" });
  if (!url) return res.status(400).json({ error: "url is required" });

  const existing = await get(db, "SELECT id FROM links WHERE id = ?", [id]);
  if (!existing) return res.status(404).json({ error: "not found" });

  await run(db, "UPDATE links SET title = ?, url = ?, iconName = ? WHERE id = ?", [
    title,
    url,
    iconName,
    id,
  ]);

  const row = await get(db, "SELECT id, title, url, iconName FROM links WHERE id = ?", [
    id,
  ]);
  res.json(row);
});

app.delete("/api/links/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "invalid id" });

  const existing = await get(db, "SELECT id FROM links WHERE id = ?", [id]);
  if (!existing) return res.status(404).json({ error: "not found" });

  await run(db, "DELETE FROM links WHERE id = ?", [id]);
  res.json({ ok: true });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

