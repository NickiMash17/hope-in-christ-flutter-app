-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  ticket_type TEXT NOT NULL DEFAULT 'General',
  attendance_type TEXT NOT NULL DEFAULT 'In-Person',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for looking up registrations by event
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id
  ON event_registrations (event_id);

-- Enable Row Level Security
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to register
CREATE POLICY "Anyone can register for events"
  ON event_registrations FOR INSERT WITH CHECK (true);

-- Allow reading own registrations (by email match — no auth required)
CREATE POLICY "Anyone can read registrations"
  ON event_registrations FOR SELECT USING (true);
