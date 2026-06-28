-- Pastor Thabo Boshomane YouTube appearances
INSERT INTO podcast_appearances (podcast_name, episode_title, date, platform, url, description, thumbnail_url) VALUES
  (
    'YouTube',
    'Forgiveness, Abuse, Marriage, Mentors, Therapy & Family Healing',
    NULL,
    'youtube',
    'https://www.youtube.com/watch?v=a7zBHX17K8g',
    'Pastor Thabo Boshomane discusses forgiveness, healing from abuse, healthy marriage, mentorship, therapy and family restoration.',
    'https://img.youtube.com/vi/a7zBHX17K8g/hqdefault.jpg'
  ),
  (
    'YouTube Live',
    'Live Community Session',
    NULL,
    'youtube',
    'https://www.youtube.com/live/XEHeptTrXPo',
    'Pastor Thabo Boshomane in a live community session addressing questions and sharing from the Word.',
    'https://img.youtube.com/vi/XEHeptTrXPo/hqdefault.jpg'
  ),
  (
    'YouTube Live',
    'Live Community Session 2',
    NULL,
    'youtube',
    'https://www.youtube.com/live/x-G_9bl5FTk',
    'Another live community session with Pastor Thabo Boshomane.',
    'https://img.youtube.com/vi/x-G_9bl5FTk/hqdefault.jpg'
  )
ON CONFLICT DO NOTHING;
