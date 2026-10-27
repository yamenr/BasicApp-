# CLAUDE.md

Teaching materials and apps for Yamen's high-school computer science classes.

| Folder | What it is |
| --- | --- |
| `android-app/` | Android + Firebase reference app (Java) |
| `video/` | Remotion tutorial video, English and Arabic narration |
| `oop-practice/` | C# OOP practice web app (Next.js, Arabic RTL) — see its README |

## How we work

- Develop and test in the cloud session. Never develop directly on the Hetzner server: it also runs the live **director** app.
- Work on a branch and open a pull request. Yamen reviews and merges. Never push to `main`.
- Merging to `main` is the approval step. Deploys run from `main` only.
- Before any change on the server, run a read-only check first and show Yamen what will change.
- On the server, keep every app separate: its own Docker Compose project and database. Never stop, restart or edit the director app.
- Back up the database before a deploy that changes data.

## Secrets and privacy

- Never put secrets (keys, passwords, OAuth client secrets) in code, commits or chat. They go in GitHub Actions secrets or the server's `.env` only.
- `.env` files are gitignored. `.env.example` files hold placeholders only.
- Don't commit real email addresses (Yamen's or students'). Use placeholders.

## Manual steps: keep them few

Yamen does only: creating Google OAuth clients, adding secrets in GitHub, reviewing and merging pull requests, and reviewing exercise content. The agent does everything else.
When a manual step is needed, give short numbered steps in simple English, with the exact values to paste.

## Talking to Yamen

- Simple English. Recommend one option instead of listing many.
- Ask before anything that is hard to undo or that touches the server.

## oop-practice

- Interface in Arabic (RTL). C# code always shows left-to-right; in exercise text, wrap code in backticks.
- Exercises live in `oop-practice/data/exercises.json`, in Bagrut style (braces on their own lines, `class Program` with `Main`).
- After editing exercises, run `npm run verify` in `oop-practice/`. It compiles and runs every "output" exercise. Needs the .NET SDK (in the cloud: `apt-get install -y dotnet-sdk-8.0`).
- Before pushing code: `npx tsc --noEmit`, `npm run lint` and `npm run build` in `oop-practice/`.
- This is Next.js 16. Read `oop-practice/node_modules/next/dist/docs/` before using an unfamiliar API (see `oop-practice/AGENTS.md`).
- Answers are checked on the server only. Never send an answer or explanation to the browser before the student answers.
- Run on a PC: `docker compose -f docker-compose.local.yml up --build` → http://localhost:3000.

## Cloud session notes

- Docker Hub may answer "429 Too Many Requests". Pull from `mirror.gcr.io/library/<image>` and retag it.
- Containers do not get the session's network proxy, so `npm ci` fails inside `docker build`. Build with the proxy CA as described in `/root/.ccr/README.md`, using a scratch copy of the Dockerfile. Don't commit those changes.

## Server plan (not set up yet)

- Wildcard DNS `*.yamenrock.com` → the server, so new apps need no DNS step.
- One shared Caddy for all apps (including the director app). Each app adds a few lines.
- One deploy user and deploy key, and a GitHub Actions workflow that deploys on merge to `main`.
