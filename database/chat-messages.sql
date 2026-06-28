-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('prayer', 'general')),
  nickname TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast channel queries
CREATE INDEX IF NOT EXISTS chat_messages_channel_created_at
  ON chat_messages (channel, created_at ASC);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Anyone can read chat messages"
  ON chat_messages FOR SELECT USING (true);

-- Allow anyone to post messages
CREATE POLICY "Anyone can post chat messages"
  ON chat_messages FOR INSERT WITH CHECK (true);

-- Enable Realtime for this table (run in Supabase dashboard → Database → Replication)
-- ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
