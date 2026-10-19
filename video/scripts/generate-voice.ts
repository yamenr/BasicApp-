/**
 * Makes one narration file per scene with ElevenLabs:
 *   public/audio/scene01.mp3, scene02.mp3, ...
 *
 * Setup: copy .env.example to .env and set ELEVENLABS_API_KEY (and VOICE_ID for your cloned voice).
 * In a Claude Code cloud session, the key can instead be a network secret that adds the
 * xi-api-key header for api.elevenlabs.io; then leave ELEVENLABS_API_KEY empty.
 *
 *   npm run voice                 make the files that do not exist yet
 *   npm run voice -- --force      make all files again (overwrites!)
 *   npm run voice -- --scene 4    make (or remake) only scene 4
 *
 * Files you recorded yourself are never touched unless you use --force or --scene.
 */
import 'dotenv/config';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {scenes} from '../src/script';

// A standard ElevenLabs voice, used until you set VOICE_ID to your own cloned voice
const PLACEHOLDER_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
const MODEL_ID = 'eleven_multilingual_v2';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio');

const args = process.argv.slice(2);
const force = args.includes('--force');
const sceneArg = args.indexOf('--scene');
const onlyScene = sceneArg === -1 ? null : Number(args[sceneArg + 1]);

const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
const voiceId = process.env.VOICE_ID?.trim() || PLACEHOLDER_VOICE_ID;

const main = async () => {
  if (onlyScene !== null && (!Number.isInteger(onlyScene) || onlyScene < 1 || onlyScene > scenes.length)) {
    throw new Error(`--scene must be a number from 1 to ${scenes.length}`);
  }

  mkdirSync(AUDIO_DIR, {recursive: true});
  console.log(voiceId === PLACEHOLDER_VOICE_ID ? 'Using the placeholder voice.' : `Using your voice ${voiceId}.`);

  for (const [index, scene] of scenes.entries()) {
    const number = index + 1;
    if (onlyScene !== null && number !== onlyScene) continue;

    const file = path.join(AUDIO_DIR, `scene${String(number).padStart(2, '0')}.mp3`);
    if (existsSync(file) && !force && onlyScene === null) {
      console.log(`Scene ${number}: ${path.basename(file)} already exists, skipping`);
      continue;
    }

    const text = scene.beats.map((beat) => beat.say).join(' ');
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        // Without a key here, the request relies on a network secret adding the header
        headers: {...(apiKey ? {'xi-api-key': apiKey} : {}), 'Content-Type': 'application/json', Accept: 'audio/mpeg'},
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {stability: 0.5, similarity_boost: 0.8, style: 0, use_speaker_boost: true},
        }),
      },
    );
    if (!response.ok && !apiKey && (response.status === 400 || response.status === 401)) {
      console.log('No working ELEVENLABS_API_KEY, so no audio was made.');
      console.log(`ElevenLabs said: ${await response.text()}`);
      console.log('That is OK: the video still works, with silent timing based on the script.');
      console.log('To add a voice, copy .env.example to .env and fill it in, or record');
      console.log('scene01.mp3, scene02.mp3, ... yourself into public/audio.');
      return;
    }
    if (!response.ok) {
      throw new Error(`Scene ${number}: ElevenLabs said ${response.status} ${await response.text()}`);
    }
    writeFileSync(file, Buffer.from(await response.arrayBuffer()));
    console.log(`Scene ${number}: saved ${path.basename(file)}`);
  }
  console.log('Done. Open the studio (npm run dev): scene lengths now follow the audio.');
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
