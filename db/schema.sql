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

-- Paid course purchases, one row per Stripe Checkout session.
CREATE TABLE IF NOT EXISTS purchases (
  session_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  course TEXT NOT NULL,
  amount_pence INTEGER NOT NULL,
  currency TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS purchases_email ON purchases (email);

-- People who tried to buy before card payments were switched on.
CREATE TABLE IF NOT EXISTS interest (
  email TEXT NOT NULL,
  course TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (email, course)
);
