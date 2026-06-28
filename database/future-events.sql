-- Remove all past events and insert upcoming 2026 events
DELETE FROM events WHERE date < '2026-01-01';

INSERT INTO events (id, title, date, time, end_time, location, category, description, is_online, registration_open, max_attendees) VALUES
  ('e1', 'Sunday Service', '2026-07-05', '09:00', '12:30', '824 Simunye Street, Mountainview Zone 02, KwaMhlanga', 'Service', 'Join us for powerful worship, prayer, and the Word of God.', false, true, null),
  ('e2', 'Youth Night Live', '2026-07-18', '18:30', '20:30', '824 Simunye Street, Mountainview Zone 02, KwaMhlanga', 'Youth', 'A dynamic night of worship and relevant teaching for young people.', false, true, 100),
  ('e3', 'Regional Conference', '2026-08-01', '09:00', '17:00', '824 Simunye Street, Mountainview Zone 02, KwaMhlanga', 'Conference', 'Annual regional gathering of believers for teaching, prayer, and fellowship.', false, true, 300),
  ('e4', 'Sunday Service', '2026-08-14', '09:00', '12:30', '824 Simunye Street, Mountainview Zone 02, KwaMhlanga', 'Service', 'Morning service with powerful ministry and worship.', false, true, null),
  ('e5', 'Women''s Fellowship', '2026-08-22', '10:00', '13:00', '824 Simunye Street, Mountainview Zone 02, KwaMhlanga', 'Fellowship', 'Empowering women through the Word of God and community.', false, true, 80),
  ('e6', 'Men''s Fellowship Breakfast', '2026-09-05', '08:00', '11:00', '824 Simunye Street, Mountainview Zone 02, KwaMhlanga', 'Fellowship', 'Men gathering for breakfast, the Word, and brotherhood.', false, true, 80),
  ('e7', 'Sunday Service', '2026-09-13', '09:00', '12:30', '824 Simunye Street, Mountainview Zone 02, KwaMhlanga', 'Service', 'Come ready to receive from God.', false, true, null),
  ('e8', 'Community Outreach Day', '2026-10-03', '09:00', '15:00', 'KwaMhlanga Community Centre', 'Outreach', 'Serving our community with practical love and the Gospel.', false, true, 150)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  date = EXCLUDED.date,
  time = EXCLUDED.time,
  location = EXCLUDED.location,
  category = EXCLUDED.category,
  description = EXCLUDED.description;
