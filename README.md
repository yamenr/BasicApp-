# Android + Firebase tutorial

A tutorial for high-school CS students: build a basic Android app in Java with Firebase.

| Folder / file | What it is |
| --- | --- |
| [`android-app/`](android-app) | The complete Android Studio project (Java, minSdk 24): the reference code for students |
| [`video/`](video) | The tutorial video, made with Remotion (React + TypeScript) |
| [`script.md`](script.md) | The narration, scene by scene, with timings |

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
npx remotion render     # render (pick "Tutorial"), or: npm run render
```

The first draft has no voice: scenes are timed from the script.
To add your voice, record `video/public/audio/scene01.mp3` … `scene11.mp3`, or generate them with ElevenLabs (`npm run voice`).
See [`video/README.md`](video/README.md).
