import { EFFECT_VOLUME, MUSIC_VOLUME } from "@/config/env";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface AudioContextValue {
  soundEnabled: boolean;
  isMuted: boolean;
  startSound: (sources: string[], shouldLoop?: boolean) => void;
  toggleMute: () => void;
  playMusic: (sources: string[], shouldLoop?: boolean) => void;
  stopMusic: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  setMusicVolume: (volume: number) => void;
  playEffect: (src: string) => void;
  setEffectVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export function AudioProvider({
  children,
}: AudioProviderProps): React.ReactElement {
  const [soundEnabled, setSoundEnabledState] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const musicVolumeRef = useRef(MUSIC_VOLUME);
  const effectVolumeRef = useRef(EFFECT_VOLUME);
  const playlistRef = useRef<string[]>([]);
  const playlistIndexRef = useRef(0);
  const shouldLoopRef = useRef(true);

  // Sync muted state when soundEnabled changes
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);

  const setMusicVolume = useCallback((volume: number) => {
    musicVolumeRef.current = Math.max(0, Math.min(1, volume));
    if (musicRef.current) {
      musicRef.current.volume = musicVolumeRef.current;
    }
  }, []);

  const setEffectVolume = useCallback((volume: number) => {
    effectVolumeRef.current = Math.max(0, Math.min(1, volume));
  }, []);

  const muteSound = useCallback(() => {
    setIsMuted(true);
    setMusicVolume(0);
    setEffectVolume(0);
  }, [setMusicVolume, setEffectVolume]);

  const unmuteSound = useCallback(() => {
    setIsMuted(false);
    setMusicVolume(MUSIC_VOLUME);
    setEffectVolume(EFFECT_VOLUME);
  }, [setMusicVolume, setEffectVolume]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      unmuteSound();
    } else {
      muteSound();
    }
  }, [isMuted, muteSound, unmuteSound]);

  const playTrack = useCallback(
    (index: number) => {
      if (!musicRef.current || playlistRef.current.length === 0) {
        return;
      }
      playlistIndexRef.current = index;
      musicRef.current.src = playlistRef.current[index];
      musicRef.current.volume = musicVolumeRef.current;
      musicRef.current.muted = !soundEnabled;
      musicRef.current.play().catch(() => {
        // Autoplay blocked - will play on next user interaction
      });
    },
    [soundEnabled]
  );

  const handleTrackEnded = useCallback(() => {
    const nextIndex = playlistIndexRef.current + 1;
    if (nextIndex < playlistRef.current.length) {
      playTrack(nextIndex);
    } else if (shouldLoopRef.current) {
      playTrack(0);
    }
  }, [playTrack]);

  // Set up ended event listener
  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) {
      return;
    }
    audio.addEventListener("ended", handleTrackEnded);
    return () => {
      audio.removeEventListener("ended", handleTrackEnded);
    };
  }, [handleTrackEnded]);

  const playMusic = useCallback(
    (sources: string[], shouldLoop = true) => {
      if (!musicRef.current || sources.length === 0) {
        return;
      }
      playlistRef.current = sources;
      shouldLoopRef.current = shouldLoop;
      const trackNumber = Math.floor(Math.random() * sources.length);
      playTrack(trackNumber);
    },
    [playTrack]
  );

  const startSound = useCallback(
    (sources: string[], shouldLoop = true) => {
      setSoundEnabledState(true);
      setIsMuted(false);
      setMusicVolume(MUSIC_VOLUME);
      setEffectVolume(EFFECT_VOLUME);
      playMusic(sources, shouldLoop);
    },
    [setMusicVolume, setEffectVolume, playMusic]
  );

  const stopMusic = useCallback(() => {
    if (!musicRef.current) {
      return;
    }
    playlistRef.current = [];
    playlistIndexRef.current = 0;
    musicRef.current.pause();
    musicRef.current.currentTime = 0;
  }, []);

  const pauseMusic = useCallback(() => {
    if (!musicRef.current) {
      return;
    }
    musicRef.current.pause();
  }, []);

  const resumeMusic = useCallback(() => {
    if (!musicRef.current) {
      return;
    }
    musicRef.current.play().catch(() => {});
  }, []);

  const playEffect = useCallback(
    (src: string) => {
      if (!soundEnabled) {
        return;
      }

      // Create a new audio element for each effect to allow overlapping
      const effect = new Audio(src);
      effect.volume = effectVolumeRef.current;
      effect.play().catch(() => {});

      // Clean up after playback
      effect.addEventListener("ended", () => {
        effect.remove();
      });
    },
    [soundEnabled]
  );

  const value: AudioContextValue = {
    soundEnabled,
    isMuted,
    startSound,
    toggleMute,
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    setMusicVolume,
    playEffect,
    setEffectVolume,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio ref={musicRef} style={{ display: "none" }} />
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
