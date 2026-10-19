import {scenes} from './script';
import {scenesAr} from './script.ar';

export type Lang = 'en' | 'ar';

// The scene files expect both languages to have the same scenes and beats
scenes.forEach((scene, i) => {
  const ar = scenesAr[i];
  if (!ar || ar.id !== scene.id || ar.beats.length !== scene.beats.length) {
    throw new Error(`script.ar.ts scene ${i + 1} must match script.ts (id "${scene.id}", ${scene.beats.length} beats)`);
  }
});

export const scriptFor = (lang: Lang) => (lang === 'ar' ? scenesAr : scenes);
