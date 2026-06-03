import { useQuery } from '@tanstack/react-query';
import { supabase, type Sermon, type Event, type PodcastAppearance } from './supabase';

// ── Sermons ───────────────────────────────────────────────────────────────────

async function fetchSermons(): Promise<Sermon[]> {
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

async function fetchSermonById(id: string): Promise<Sermon | null> {
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export function useSermons() {
  return useQuery({
    queryKey: ['sermons'],
    queryFn: fetchSermons,
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}

export function useSermon(id: string) {
  return useQuery({
    queryKey: ['sermons', id],
    queryFn: () => fetchSermonById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// ── Events ────────────────────────────────────────────────────────────────────

async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function fetchEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => fetchEventById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

// ── Podcast Appearances ───────────────────────────────────────────────────────

async function fetchPodcasts(): Promise<PodcastAppearance[]> {
  const { data, error } = await supabase
    .from('podcast_appearances')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function usePodcasts() {
  return useQuery({
    queryKey: ['podcasts'],
    queryFn: fetchPodcasts,
    staleTime: 5 * 60 * 1000,
  });
}
