import { createClient } from '@supabase/supabase-js';

const url  = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const key  = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// ── Shared types ──────────────────────────────────────────────────────────────

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string | null;
  category: string;
  description: string | null;
  notes: string | null;
  platform: string;
  audio_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string | null;
  end_time: string | null;
  location: string;
  category: string;
  description: string | null;
  image_url: string | null;
  is_online: boolean;
  registration_open: boolean;
  max_attendees: number | null;
  created_at: string;
}

export interface PodcastAppearance {
  id: string;
  podcast_name: string;
  episode_title: string;
  date: string | null;
  platform: string | null;
  url: string;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
}
