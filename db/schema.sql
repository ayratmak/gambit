-- Gambit sign-ups. One row per email address.
CREATE TABLE IF NOT EXISTS signups (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  marketing_consent INTEGER NOT NULL DEFAULT 0,
  consent_at TEXT,
  origin TEXT,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 1
);
