import {createContext, useContext} from 'react';
import {getStaticFiles, staticFile, useCurrentFrame} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Lang, scriptFor} from './lang';
import {VIDEO} from './config';

// Frames of silence before the narration starts, and after it ends, in every scene
export const LEAD_IN_FRAMES = 12;
export const TAIL_FRAMES = 30;
// Speaking speed used when a scene has no audio file yet (English: about 155 words per minute)
export const WORDS_PER_SECOND: Record<Lang, number> = {en: 2.6, ar: 2.0};

export type SceneTiming = {
  lang: Lang;
  index: number;
  id: string;
  durationInFrames: number;
  // Path inside /public, or null when the scene has no audio yet
  audio: string | null;
  // Frame (inside the scene) where each beat starts
  beatStarts: number[];
};

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

// English audio is in public/audio, Arabic audio in public/audio/ar
export const audioFileFor = (index: number, lang: Lang = 'en') =>
  `audio/${lang === 'en' ? '' : `${lang}/`}scene${String(index + 1).padStart(2, '0')}.mp3`;

export const estimateSeconds = (index: number, lang: Lang = 'en') =>
  scriptFor(lang)[index].beats.reduce((sum, beat) => sum + countWords(beat.say), 0) / WORDS_PER_SECOND[lang];

// Builds every scene's length and beat times from the audio lengths (null = no audio)
export const buildTimeline = (audioSeconds: (number | null)[], lang: Lang = 'en'): SceneTiming[] =>
  scriptFor(lang).map((scene, index) => {
    const seconds = audioSeconds[index] ?? estimateSeconds(index, lang);
    const narrationFrames = Math.ceil(seconds * VIDEO.fps);
    const words = scene.beats.map((beat) => countWords(beat.say));
    const totalWords = words.reduce((a, b) => a + b, 0);

    let wordsBefore = 0;
    const beatStarts = words.map((count) => {
      const start = LEAD_IN_FRAMES + Math.round((narrationFrames * wordsBefore) / totalWords);
      wordsBefore += count;
      return start;
    });

    return {
      lang,
      index,
      id: scene.id,
      durationInFrames: LEAD_IN_FRAMES + narrationFrames + TAIL_FRAMES,
      audio: audioSeconds[index] === null ? null : audioFileFor(index, lang),
      beatStarts,
    };
  });

// Returns the audio length in seconds, or null if the file is not in /public
const readAudioSeconds = async (path: string): Promise<number | null> => {
  const exists = getStaticFiles().some((file) => file.name === path);
  if (!exists) {
    return null;
  }
  try {
    return await getAudioDurationInSeconds(staticFile(path));
  } catch {
    return null;
  }
};

export const loadTimeline = async (lang: Lang = 'en') => {
  const seconds = await Promise.all(
    scriptFor(lang).map((_, index) => readAudioSeconds(audioFileFor(index, lang))),
  );
  return buildTimeline(seconds, lang);
};

export const SceneTimingContext = createContext<SceneTiming | null>(null);

export const useSceneTiming = () => {
  const timing = useContext(SceneTimingContext);
  if (!timing) {
    throw new Error('useSceneTiming() must be used inside a scene');
  }
  return timing;
};

export const beatAt = (timing: SceneTiming, frame: number) => {
  let beat = 0;
  timing.beatStarts.forEach((start, i) => {
    if (frame >= start) beat = i;
  });
  return beat;
};

// The beat that is playing now, and how far into it we are
export const useBeat = () => {
  const timing = useSceneTiming();
  const frame = useCurrentFrame();
  const beat = beatAt(timing, frame);
  const start = timing.beatStarts[beat];
  const end = timing.beatStarts[beat + 1] ?? timing.durationInFrames;
  return {beat, frame, start, end, since: frame - start, length: end - start, timing};
};

// Picks the English or Arabic version of an on-screen text, for the scene's language
export const useT = () => {
  const {lang} = useSceneTiming();
  return <T,>(en: T, ar: T): T => (lang === 'ar' ? ar : en);
};
