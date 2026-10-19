# Tutorial video (Remotion)

A 1920×1080, 30 fps video, about 9–10 minutes long, that teaches how to build the app in `../android-app`.
It comes in two languages: **English** (`Tutorial`) and **Arabic** (`Tutorial-Arabic`). Both use the same scenes and code; only the narration and on-screen text change.
It is made with [Remotion](https://www.remotion.dev): every scene is a React component, so you change the video by changing code.

## Preview and render

You need Node.js 18 or newer.

```bash
cd video
npm install

npx remotion studio          # preview in the browser (same as: npm run dev)
npx remotion render          # render; Remotion asks which composition (pick "Tutorial")
npm run render               # render Tutorial straight to out/tutorial.mp4
npm run render:ar            # render Tutorial-Arabic to out/tutorial-ar.mp4
```

In the studio you can play the whole video (**Tutorial** or **Tutorial-Arabic**) or one scene at a time (the **Scenes** and **Scenes-Arabic** folders).

## The voice

Each scene has one audio file: `public/audio/scene01.mp3` to `scene11.mp3` for English, and `public/audio/ar/scene01.mp3` to `scene11.mp3` for Arabic.
Add `--lang ar` to `npm run voice` or `npm run script` for the Arabic version (`../script.ar.md`).
**The length of each scene follows its audio file.** If a scene has no audio yet, the video uses an estimate from the number of words, with no sound. That is how the first draft works.

### Option 1: record it yourself

1. Run `npm run script` and open `../script.md`. It has every line, scene by scene, with timings.
2. Record one file per scene and save them as `public/audio/scene01.mp3`, `scene02.mp3`, ...
3. Refresh the studio. Each scene now lasts as long as your recording.

### Option 2: your cloned voice (ElevenLabs)

1. Copy `.env.example` to `.env`.
2. Set `ELEVENLABS_API_KEY`, and set `VOICE_ID` to your cloned voice's ID.
   Leave `VOICE_ID` empty to use a standard ElevenLabs placeholder voice.
3. Run `npm run voice`. It saves the same `sceneNN.mp3` files.
   - Files that already exist are skipped, so your own recordings are safe.
   - `npm run voice -- --force` remakes every file; `npm run voice -- --scene 4` remakes one scene.

After adding audio, run `npm run script` again to update the timings in `script.md`.

## Changing the video

| I want to change… | Edit |
| --- | --- |
| What is said, or the captions | `src/script.ts` (English) or `src/script.ar.ts` (Arabic), then `npm run script` and `npm run voice` (add `-- --lang ar` for Arabic) |
| Other on-screen text | the scene file: each text is written as `t('English', 'عربي')` |
| The picture in a scene | `src/scenes/SceneNN….tsx` |
| Colours and fonts | `src/theme.ts` |
| The code shown on screen | the real files in `../android-app` (see below) |

**Beats.** Each scene in `src/script.ts` is split into *beats*: one or two sentences, plus a caption.
The scene file changes the picture at the start of each beat: it reveals code, moves the highlight, or taps the phone.
Beat times are spread over the scene's audio by word count, so the picture follows the voice.
If you add or remove a beat, update the matching scene file too.

**Code comes from the real app.** `src/code/sources.ts` imports the `.java`, `.xml` and `.gradle` files from `../android-app` as text.
Code panels find lines by their text (for example `'public static FirebaseServices getInstance()'`), not by line numbers.
If you change the Android code and a line can't be found, the studio shows an error naming the missing text.

## Files

```
video/
├── src/
│   ├── script.ts         narration + captions (the one place to change the words)
│   ├── timeline.ts       scene lengths and beat times (from audio, or estimated)
│   ├── Root.tsx          the compositions: Tutorial + one per scene
│   ├── Tutorial.tsx      plays the scenes in order, with their audio
│   ├── theme.ts          colours and fonts
│   ├── code/             loads the Android files, finds lines, colours the code
│   ├── components/       code panel, phone mockup, diagrams, scene frame
│   └── scenes/           one file per scene
├── scripts/
│   ├── generate-voice.ts ElevenLabs → public/audio/sceneNN.mp3
│   └── write-script-md.ts → ../script.md
└── public/audio/         your narration files
```
