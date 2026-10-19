# Android + Firebase tutorial

A tutorial for high-school CS students: build a basic Android app in Java with Firebase.

| Folder / file | What it is |
| --- | --- |
| [`android-app/`](android-app) | The complete Android Studio project (Java, minSdk 24): the reference code for students |
| [`video/`](video) | The tutorial video, made with Remotion (React + TypeScript) |
| [`script.md`](script.md) | The narration, scene by scene, with timings |
| [`script.ar.md`](script.ar.md) | The Arabic narration (simple Modern Standard Arabic) |

## The app

A restaurant admin app:

- **MainActivity**: the admin page, with **Add** and **Show** buttons and a container for fragments
- **Fragments**: AdminFragment (home), AddRestaurantFragment, ShowRestaurantsFragment
- **Dialogs**: EditRestaurantDialog (update) and a delete confirmation AlertDialog
- **Restaurant**: the model class
- **FirebaseServices**: a lazy singleton for Auth, Firestore and Storage

Firebase setup steps are in [`android-app/README.md`](android-app/README.md).

## The video

```bash
cd video
npm install
npx remotion studio     # preview
npx remotion render     # render (pick "Tutorial" or "Tutorial-Arabic")
npm run render          # English → out/tutorial.mp4
npm run render:ar       # Arabic  → out/tutorial-ar.mp4
```

Both versions are narrated in Yamen's cloned voice (ElevenLabs). The audio is in `video/public/audio` (English) and `video/public/audio/ar` (Arabic).
To replace it, record new `scene01.mp3` … `scene11.mp3` files, or generate them with `npm run voice` (add `-- --lang ar` for Arabic).
See [`video/README.md`](video/README.md).
