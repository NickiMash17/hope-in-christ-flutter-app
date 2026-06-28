-- Prayer requests table (run once to create if not exists)
CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  request TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  prayer_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read prayer requests
CREATE POLICY "Anyone can read prayer requests"
  ON prayer_requests FOR SELECT USING (true);

-- Allow anyone to insert prayer requests
CREATE POLICY "Anyone can submit prayer requests"
  ON prayer_requests FOR INSERT WITH CHECK (true);

-- Allow anyone to increment prayer count
CREATE POLICY "Anyone can pray"
  ON prayer_requests FOR UPDATE USING (true) WITH CHECK (true);
