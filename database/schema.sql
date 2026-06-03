-- ============================================================
-- Hope In Christ for All Nations — Supabase Schema
-- Run this in your Supabase project: Dashboard → SQL Editor
-- ============================================================

-- ── Sermons ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sermons (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title         TEXT NOT NULL,
  speaker       TEXT NOT NULL DEFAULT 'Pastor Thabo Boshomane',
  date          DATE NOT NULL,
  duration      TEXT,
  category      TEXT NOT NULL DEFAULT 'Word',
  description   TEXT,
  notes         TEXT,
  platform      TEXT NOT NULL DEFAULT 'x', -- x, tiktok, facebook, podcast, youtube
  audio_url     TEXT,
  thumbnail_url TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Events ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title             TEXT NOT NULL,
  date              DATE NOT NULL,
  time              TEXT,
  end_time          TEXT,
  location          TEXT NOT NULL DEFAULT '824 Simunye Street, KwaMhlanga',
  category          TEXT NOT NULL DEFAULT 'Service',
  description       TEXT,
  image_url         TEXT,
  is_online         BOOLEAN DEFAULT FALSE,
  registration_open BOOLEAN DEFAULT FALSE,
  max_attendees     INTEGER,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Podcast Appearances ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS podcast_appearances (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  podcast_name  TEXT NOT NULL,
  episode_title TEXT NOT NULL,
  date          DATE,
  platform      TEXT, -- spotify, apple, youtube, google, other
  url           TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security (allow public reads) ────────────────────
ALTER TABLE sermons             ENABLE ROW LEVEL SECURITY;
ALTER TABLE events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_appearances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sermons"   ON sermons             FOR SELECT USING (true);
CREATE POLICY "Public read events"    ON events              FOR SELECT USING (true);
CREATE POLICY "Public read podcasts"  ON podcast_appearances FOR SELECT USING (true);
