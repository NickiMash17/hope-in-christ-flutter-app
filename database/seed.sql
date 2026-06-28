-- ============================================================
-- Seed: existing sermons & events migrated from the app
-- Run AFTER schema.sql in Supabase → SQL Editor
-- ============================================================

-- ── Sermons ──────────────────────────────────────────────────
INSERT INTO sermons (id, title, speaker, date, duration, category, description, platform, audio_url) VALUES
('1',  'Walking in Faith',                        'Pastor Thabo Boshomane', '2026-06-22', '45 min', 'Word',     'A powerful message about trusting God in every season of life.',       'x', 'https://x.com/HicfanMin'),
('2',  'The Power of Prayer',                     'Pastor Thabo Boshomane', '2026-06-15', '52 min', 'Prayer',   'Discover how prayer transforms your relationship with God.',            'x', 'https://x.com/HicfanMin'),
('3',  'Kingdom Principles',                      'Pastor Thabo Boshomane', '2026-06-08', '38 min', 'Teaching', 'Understanding the principles that govern God''s kingdom.',              'x', 'https://x.com/HicfanMin'),
('4',  'Grace and Truth',                         'Pastor Thabo Boshomane', '2026-06-01', '41 min', 'Word',     'Exploring the balance of grace and truth in Christian living.',         'x', 'https://x.com/HicfanMin'),
('5',  'Breaking Generational Chains',            'Pastor Thabo Boshomane', '2026-05-25', '55 min', 'Teaching', 'How to break free from generational bondages through Christ.',          'x', 'https://x.com/HicfanMin'),
('6',  'The Armor of God',                        'Pastor Thabo Boshomane', '2026-05-18', '49 min', 'Teaching', 'Understanding spiritual warfare and standing firm in faith.',            'x', 'https://x.com/HicfanMin'),
('7',  'Youth: Purpose and Destiny',              'Pastor Thabo Boshomane', '2026-05-11', '44 min', 'Word',     'A special message for youth about finding purpose in God.',             'x', 'https://x.com/HicfanMin'),
('8',  'Supernatural Provision',                  'Pastor Thabo Boshomane', '2026-05-04', '50 min', 'Word',     'God''s promise to provide for all your needs according to His riches.',  'x', 'https://x.com/HicfanMin'),
('9',  'Intercessory Prayer',                     'Pastor Thabo Boshomane', '2026-04-27', '47 min', 'Prayer',   'The ministry of intercession and standing in the gap for others.',      'x', 'https://x.com/HicfanMin'),
('10', 'The Great Commission',                    'Pastor Thabo Boshomane', '2026-04-20', '43 min', 'Teaching', 'Our mandate to go into all the world and preach the gospel.',           'x', 'https://x.com/HicfanMin'),
('11', 'Hope That Does Not Disappoint',           'Pastor Thabo Boshomane', '2026-04-13', '46 min', 'Word',     'Anchoring your soul in the hope found only in Jesus Christ.',           'x', 'https://x.com/HicfanMin')
ON CONFLICT (id) DO UPDATE SET date = EXCLUDED.date;

-- ── Events ───────────────────────────────────────────────────
INSERT INTO events (id, title, date, time, end_time, location, category, description, is_online, registration_open, max_attendees) VALUES
('1', 'Sunday Power Hour',          '2026-07-05', '10:00', '12:30', '824 Simunye Street, KwaMhlanga', 'Service',    'Join us for a powerful Sunday service filled with worship and the Word.',  false, false, 500),
('2', 'Youth Ignite Conference',    '2026-07-25', '09:00', '17:00', '824 Simunye Street, KwaMhlanga', 'Youth',      'A full day conference for youth to be ignited and empowered by the Holy Spirit.', false, true, 200),
('3', 'Kingdom Builders Seminar',   '2026-08-08', '09:00', '16:00', '824 Simunye Street, KwaMhlanga', 'Conference', 'A transformative seminar for leaders and believers who want to build God''s kingdom.', false, true, 150),
('4', 'Night of Worship',           '2026-09-12', '18:00', '21:00', '824 Simunye Street, KwaMhlanga', 'Service',    'An evening dedicated entirely to worship, prayer and encountering God''s presence.', false, false, 300)
ON CONFLICT (id) DO UPDATE SET date = EXCLUDED.date;

-- ── Example: Add a podcast appearance (fill in real details) ─
-- INSERT INTO podcast_appearances (podcast_name, episode_title, date, platform, url, description) VALUES
-- ('Podcast Name Here', 'Episode Title Here', '2025-03-15', 'spotify', 'https://...', 'Brief description of what was discussed.');
