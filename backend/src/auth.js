export const MOCK_TOKEN = "mock-admin-token";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (token !== MOCK_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

