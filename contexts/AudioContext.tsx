import React, { createContext, useContext, useState, useCallback } from "react";

interface AudioTrack {
  id: string;
  title: string;
  speaker: string;
  url: string;
}

interface AudioContextValue {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  play: (track: AudioTrack) => void;
  pause: () => void;
  stop: () => void;
}

const AudioContext = createContext<AudioContextValue>({
  currentTrack: null,
  isPlaying: false,
  play: () => {},
  pause: () => {},
  stop: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((track: AudioTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => setIsPlaying(false), []);

  const stop = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, play, pause, stop }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioContext);
}
