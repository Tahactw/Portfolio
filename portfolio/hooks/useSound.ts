'use client';

import { useCallback, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { useLocalStorage } from './useLocalStorage';
import { SoundName, SOUND_URLS } from '@/lib/sounds';

type SoundOptions = { 
  loop?: boolean; 
  volume?: number; 
};

const soundCache: Partial<Record<SoundName, Howl>> = {};

export function useSound() {
  const [isMuted, setIsMuted] = useLocalStorage('soundMuted', false);
  const activeSounds = useRef<Howl[]>([]);

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);
  
  useEffect(() => {
    return () => {
        activeSounds.current.forEach(sound => sound.stop());
        activeSounds.current = [];
    }
  }, []);

  const playSound = useCallback((soundName: SoundName, options?: SoundOptions): Howl | undefined => {
    if (!soundCache[soundName]) {
      soundCache[soundName] = new Howl({
        src: [SOUND_URLS[soundName]],
        html5: true,
      });
    }

    const sound = soundCache[soundName];
    if (sound) {
      sound.loop(options?.loop || false);
      sound.volume(options?.volume ?? 1);
      sound.play();
      
      if(options?.loop) {
          activeSounds.current.push(sound);
      }
    }
    return sound;
  }, []);

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), [setIsMuted]);

  return { isMuted, toggleMute, playSound };
}