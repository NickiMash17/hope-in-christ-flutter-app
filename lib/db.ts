import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase, type Sermon, type Event, type PodcastAppearance, type ChatMessage, type PrayerRequest } from './supabase';

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
    staleTime: 5 * 60 * 1000,
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

// ── Chat Messages (real-time) ─────────────────────────────────────────────────

export function useChatMessages(channel: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['chat', channel],
    queryFn: async (): Promise<ChatMessage[]> => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel', channel)
        .order('created_at', { ascending: true })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 0,
  });

  useEffect(() => {
    const subscription = supabase
      .channel(`chat-${channel}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel=eq.${channel}`,
        },
        (payload) => {
          queryClient.setQueryData(['chat', channel], (old: ChatMessage[] | undefined) => {
            const existing = old ?? [];
            const newMsg = payload.new as ChatMessage;
            if (existing.some((m) => m.id === newMsg.id)) return existing;
            return [...existing, newMsg];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channel, queryClient]);

  return query;
}

export async function sendChatMessage(channel: string, nickname: string, text: string): Promise<void> {
  const { error } = await supabase
    .from('chat_messages')
    .insert({ channel, nickname, text });
  if (error) throw error;
}

// ── Prayer Requests ───────────────────────────────────────────────────────────

export function usePrayerRequests() {
  return useQuery({
    queryKey: ['prayer_requests'],
    queryFn: async (): Promise<PrayerRequest[]> => {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export async function submitPrayerRequest(
  name: string,
  request: string,
  isAnonymous: boolean,
): Promise<void> {
  const { error } = await supabase
    .from('prayer_requests')
    .insert({ name, request, is_anonymous: isAnonymous });
  if (error) throw new Error(error.message ?? JSON.stringify(error));
}

export async function incrementPrayerCount(id: string, currentCount: number): Promise<void> {
  const { error } = await supabase
    .from('prayer_requests')
    .update({ prayer_count: currentCount + 1 })
    .eq('id', id);
  if (error) throw error;
}

// ── Event Registration ────────────────────────────────────────────────────────

export async function submitEventRegistration(data: {
  event_id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  ticket_type: string;
  attendance_type: string;
}): Promise<void> {
  const { error } = await supabase.from('event_registrations').insert(data);
  if (error) throw new Error(error.message ?? JSON.stringify(error));
}
