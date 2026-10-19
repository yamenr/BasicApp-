/**
 * Writes ../script.md from src/script.ts, with the timing of every scene and beat.
 * Scenes with an audio file in public/audio use its real length; the others use an estimate.
 *
 *   npm run script               → ../script.md
 *   npm run script -- --lang ar  → ../script.ar.md (Arabic)
 */
import {existsSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {parseMedia} from '@remotion/media-parser';
import {nodeReader} from '@remotion/media-parser/node';
import {Lang, scriptFor} from '../src/lang';
import {audioFileFor, buildTimeline, countWords, WORDS_PER_SECOND} from '../src/timeline';
import {VIDEO} from '../src/config';

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const lang: Lang = process.argv.includes('--lang') && process.argv[process.argv.indexOf('--lang') + 1] === 'ar' ? 'ar' : 'en';
const scenes = scriptFor(lang);
const OUT = path.join(__dirname, '..', '..', lang === 'en' ? 'script.md' : `script.${lang}.md`);

const time = (frames: number) => {
  const seconds = Math.round(frames / VIDEO.fps);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

const main = async () => {
  const audioSeconds = await Promise.all(
    scenes.map(async (_, index) => {
      const file = path.join(PUBLIC_DIR, audioFileFor(index, lang));
      if (!existsSync(file)) return null;
      const {durationInSeconds} = await parseMedia({src: file, reader: nodeReader, fields: {durationInSeconds: true}});
      return durationInSeconds ?? null;
    }),
  );
  const timeline = buildTimeline(audioSeconds, lang);
  const total = timeline.reduce((sum, t) => sum + t.durationInFrames, 0);
  const words = scenes.reduce((sum, s) => sum + s.beats.reduce((n, b) => n + countWords(b.say), 0), 0);
  const recorded = audioSeconds.filter((s) => s !== null).length;

  const lines: string[] = [
    lang === 'en'
      ? '# Narration script: Build an Android app with Java and Firebase'
      : '# Narration script (Arabic): Build an Android app with Java and Firebase',
    '',
    `<!-- This file is made by \`npm run script\` (in /video) from video/src/${lang === 'en' ? 'script.ts' : 'script.ar.ts'}. Edit that file, not this one. -->`,
    '',
    `Total length: **${time(total)}** · ${scenes.length} scenes · ${words} words`,
    '',
    recorded === scenes.length
      ? `All timings come from the audio files in \`video/public/${audioFileFor(0, lang).replace(/scene01\.mp3$/, '')}\`.`
      : `Timings are estimates (${WORDS_PER_SECOND[lang]} words per second) for scenes without an audio file yet` +
        (recorded > 0 ? `; ${recorded} scene(s) use real audio lengths.` : '.') +
        ' They update when you add audio and run `npm run script` again.',
    '',
    '**Recording tips:** record one file per scene (`scene01.mp3`, `scene02.mp3`, ...) and read the lines in order (the *On screen* captions are not read). ' +
      'Speak slowly and clearly. Leave a short pause between lines. The video stretches each scene to fit your recording.',
    '',
    '## Scenes',
    '',
    '| # | Scene | Starts | Length | Audio file |',
    '| --- | --- | --- | --- | --- |',
  ];

  let start = 0;
  const starts = timeline.map((t) => {
    const s = start;
    start += t.durationInFrames;
    return s;
  });
  timeline.forEach((t, i) => {
    lines.push(`| ${i + 1} | ${scenes[i].title} | ${time(starts[i])} | ${time(t.durationInFrames)} | \`${audioFileFor(i, lang).replace('audio/', '')}\`${t.audio ? '' : ' (not yet)'} |`);
  });

  timeline.forEach((t, i) => {
    const scene = scenes[i];
    lines.push('', `## Scene ${i + 1}: ${scene.title}`, '');
    lines.push(`Starts at ${time(starts[i])} · length ${time(t.durationInFrames)} · file \`${audioFileFor(i, lang).replace('audio/', '')}\``, '');
    scene.beats.forEach((beat, b) => {
      lines.push(`**[${time(starts[i] + t.beatStarts[b])}]** ${beat.say}`, '');
      lines.push(`> On screen: *${beat.caption}*`, '');
    });
  });

  writeFileSync(OUT, lines.join('\n'));
  console.log(`Wrote ${path.relative(process.cwd(), OUT)} (${time(total)})`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
