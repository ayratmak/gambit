-- D1 database hayek-ig. Apply once: npx wrangler@3 d1 execute hayek-ig --remote --file=schema.sql (safe to re-run).
-- One row per answered comment; (media_id, from_id) unique so each person gets one DM per post.
-- Facebook rows carry an "fb:" prefix on comment_id, media_id and from_id.
CREATE TABLE IF NOT EXISTS ig_dms (
  comment_id TEXT PRIMARY KEY, media_id TEXT NOT NULL, from_id TEXT NOT NULL, username TEXT, comment_text TEXT,
  ref TEXT NOT NULL UNIQUE, status TEXT NOT NULL, created_at TEXT NOT NULL, sent_at TEXT, public_reply INTEGER DEFAULT 0,
  UNIQUE (media_id, from_id)
);
-- Last seen comment count per post, so the poll only fetches comments when something changed.
CREATE TABLE IF NOT EXISTS ig_poll (media_id TEXT PRIMARY KEY, comments_count INTEGER NOT NULL, checked_at TEXT NOT NULL);
-- Scheduled Reels (publish.js, fb.js): one row per post and platform, moved along by the cron.
-- platform is 'ig' or 'fb'; cover_set is 1 once a Facebook reel's cover has been accepted as its thumbnail.
CREATE TABLE IF NOT EXISTS ig_queue (
  id TEXT PRIMARY KEY, video_key TEXT NOT NULL, cover_key TEXT, caption TEXT, first_comment TEXT, publish_at TEXT NOT NULL,
  status TEXT NOT NULL, container_id TEXT, media_id TEXT, comment_posted INTEGER DEFAULT 0, attempts INTEGER DEFAULT 0, error TEXT,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL, platform TEXT NOT NULL DEFAULT 'ig', cover_set INTEGER DEFAULT 0
);
