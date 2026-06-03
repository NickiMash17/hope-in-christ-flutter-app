-- ============================================================
-- Seed: existing sermons & events migrated from the app
-- Run AFTER schema.sql in Supabase → SQL Editor
-- ============================================================

-- ── Sermons ──────────────────────────────────────────────────
INSERT INTO sermons (id, title, speaker, date, duration, category, description, platform, audio_url) VALUES
('1',  'Walking in Faith',                        'Pastor Thabo Boshomane', '2025-01-05', '45 min', 'Word',     'A powerful message about trusting God in every season of life.',       'x', 'https://x.com/HicfanMin'),
('2',  'The Power of Prayer',                     'Pastor Thabo Boshomane', '2024-12-29', '52 min', 'Prayer',   'Discover how prayer transforms your relationship with God.',            'x', 'https://x.com/HicfanMin'),
('3',  'Kingdom Principles',                      'Pastor Thabo Boshomane', '2024-12-22', '38 min', 'Teaching', 'Understanding the principles that govern God''s kingdom.',              'x', 'https://x.com/HicfanMin'),
('4',  'Grace and Truth',                         'Pastor Thabo Boshomane', '2024-12-15', '41 min', 'Word',     'Exploring the balance of grace and truth in Christian living.',         'x', 'https://x.com/HicfanMin'),
('5',  'Breaking Generational Chains',            'Pastor Thabo Boshomane', '2024-12-08', '55 min', 'Teaching', 'How to break free from generational bondages through Christ.',          'x', 'https://x.com/HicfanMin'),
('6',  'The Armor of God',                        'Pastor Thabo Boshomane', '2024-12-01', '49 min', 'Teaching', 'Understanding spiritual warfare and standing firm in faith.',            'x', 'https://x.com/HicfanMin'),
('7',  'Youth: Purpose and Destiny',              'Pastor Thabo Boshomane', '2024-11-24', '44 min', 'Word',     'A special message for youth about finding purpose in God.',             'x', 'https://x.com/HicfanMin'),
('8',  'Supernatural Provision',                  'Pastor Thabo Boshomane', '2024-11-17', '50 min', 'Word',     'God''s promise to provide for all your needs according to His riches.',  'x', 'https://x.com/HicfanMin'),
('9',  'Intercessory Prayer',                     'Pastor Thabo Boshomane', '2024-11-10', '47 min', 'Prayer',   'The ministry of intercession and standing in the gap for others.',      'x', 'https://x.com/HicfanMin'),
('10', 'The Great Commission',                    'Pastor Thabo Boshomane', '2024-11-03', '43 min', 'Teaching', 'Our mandate to go into all the world and preach the gospel.',           'x', 'https://x.com/HicfanMin'),
('11', 'Hope That Does Not Disappoint',           'Pastor Thabo Boshomane', '2024-10-27', '46 min', 'Word',     'Anchoring your soul in the hope found only in Jesus Christ.',           'x', 'https://x.com/HicfanMin')
ON CONFLICT (id) DO NOTHING;

-- ── Events ───────────────────────────────────────────────────
INSERT INTO events (id, title, date, time, end_time, location, category, description, is_online, registration_open, max_attendees) VALUES
('1', 'Sunday Power Hour',          '2025-06-08', '10:00', '12:30', '824 Simunye Street, KwaMhlanga', 'Service',    'Join us for a powerful Sunday service filled with worship and the Word.',  false, false, 500),
('2', 'Youth Ignite Conference',    '2025-06-21', '09:00', '17:00', '824 Simunye Street, KwaMhlanga', 'Youth',      'A full day conference for youth to be ignited and empowered by the Holy Spirit.', false, true, 200),
('3', 'Kingdom Builders Seminar',   '2025-07-05', '09:00', '16:00', '824 Simunye Street, KwaMhlanga', 'Conference', 'A transformative seminar for leaders and believers who want to build God''s kingdom.', false, true, 150),
('4', 'Night of Worship',           '2025-07-19', '18:00', '21:00', '824 Simunye Street, KwaMhlanga', 'Service',    'An evening dedicated entirely to worship, prayer and encountering God''s presence.', false, false, 300)
ON CONFLICT (id) DO NOTHING;

-- ── Example: Add a podcast appearance (fill in real details) ─
-- INSERT INTO podcast_appearances (podcast_name, episode_title, date, platform, url, description) VALUES
-- ('Podcast Name Here', 'Episode Title Here', '2025-03-15', 'spotify', 'https://...', 'Brief description of what was discussed.');
