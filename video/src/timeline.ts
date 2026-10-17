import {createContext, useContext} from 'react';
import {getStaticFiles, staticFile, useCurrentFrame} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {scenes} from './script';
import {VIDEO} from './config';

// Frames of silence before the narration starts, and after it ends, in every scene
export const LEAD_IN_FRAMES = 12;
export const TAIL_FRAMES = 30;
// Speaking speed used when a scene has no audio file yet (about 155 words per minute)
export const WORDS_PER_SECOND = 2.6;

export type SceneTiming = {
  index: number;
  id: string;
  durationInFrames: number;
  // Path inside /public, or null when the scene has no audio yet
  audio: string | null;
  // Frame (inside the scene) where each beat starts
  beatStarts: number[];
};

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const audioFileFor = (index: number) =>
  `audio/scene${String(index + 1).padStart(2, '0')}.mp3`;

export const estimateSeconds = (index: number) =>
  scenes[index].beats.reduce((sum, beat) => sum + countWords(beat.say), 0) / WORDS_PER_SECOND;

// Builds every scene's length and beat times from the audio lengths (null = no audio)
export const buildTimeline = (audioSeconds: (number | null)[]): SceneTiming[] =>
  scenes.map((scene, index) => {
    const seconds = audioSeconds[index] ?? estimateSeconds(index);
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
      index,
      id: scene.id,
      durationInFrames: LEAD_IN_FRAMES + narrationFrames + TAIL_FRAMES,
      audio: audioSeconds[index] === null ? null : audioFileFor(index),
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

export const loadTimeline = async () => {
  const seconds = await Promise.all(scenes.map((_, index) => readAudioSeconds(audioFileFor(index))));
  return buildTimeline(seconds);
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
