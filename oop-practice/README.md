# OOP Practice (C#) — Phase 1

An interactive practice app for 11th grade OOP: inheritance and polymorphism in C#, Bagrut style.
Arabic (RTL) interface, works on phones and desktops.

- **Students** sign in with Google, solve exercises, and get green/red feedback with a short explanation.
- **Teacher** (admin) sees a table of all students and their scores, and manages who may sign in.

Stack: Next.js 16 + Tailwind 4, NextAuth (Google), PostgreSQL, Docker Compose + Caddy (automatic HTTPS).

## Exercise types and scoring

| Type | What the student does |
| --- | --- |
| `output` — "ماذا يطبع؟" | Types the exact output of the program (compared line by line, ignoring trailing spaces) |
| `mcq` — "اختيار من متعدّد" | Picks one of the options |

- Correct on the **first try**: `points` + bonus (`firstTryBonus`, 5 by default)
- Correct after a wrong try: `points`
- After a wrong try the student sees a **hint**. They can retry, or press **"show solution"**; after that, the exercise gives 0 points.
- The **explanation** is shown only after a correct answer or "show solution". Answers are checked on the server and are never sent to the browser in advance.
- Both the **first-attempt** score and the **best** score are saved for every exercise. Every attempt is saved too, in the `attempts` table.

## Exercises

All exercises are in [`data/exercises.json`](data/exercises.json). Code and expected output are arrays of lines, so they are easy to edit:

```json
{
  "id": "poly-01",
  "type": "output",
  "topic": "polymorphism",
  "title": "مصفوفة من نوع الأب",
  "question": "ماذا يطبع البرنامج التالي؟",
  "code": ["class Animal", "{", "..."],
  "expectedOutput": ["0: Woof", "1: ...", "2: Meow"],
  "hint": "...",
  "explanation": "...",
  "points": 10
}
```

For `mcq`, use `"options": [...]` and `"correctIndex": 0` (counting from 0) instead of `expectedOutput`.
In `title`, `question`, `options`, `hint` and `explanation`, wrap C# code in backticks, for example `` `virtual` ``, so it shows left-to-right inside Arabic text.
Keep an exercise's `id` the same after students have answered it, because scores are stored by `id`.

**Check the exercises** after editing them (needs the [.NET SDK](https://dotnet.microsoft.com/download)):

```bash
npm run verify              # checks the JSON, then compiles and runs every "output" exercise and compares the output
npm run verify -- --no-run  # JSON checks only
```

All 10 sample exercises pass. The 4 multiple-choice answers were also checked with the C# compiler: the compile error in `cast-01`, the `InvalidCastException` in `cast-02`, and the one compiling line in `cast-03`.

After editing the JSON on the server, rebuild: `docker compose up -d --build`.

## Deploy on the Hetzner server

### 1. Google OAuth client (once)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services**.
2. **OAuth consent screen**: user type **External**, app name, your email. Publish the app ("In production") so any Gmail account can sign in. The app asks only for the basic `email` and `profile` scopes, so no Google review is needed.
3. **Credentials** → **Create credentials** → **OAuth client ID** → **Web application**:
   - Authorized JavaScript origins: `https://oop.yamenrock.com`
   - Authorized redirect URIs: `https://oop.yamenrock.com/api/auth/callback/google`
4. Copy the **Client ID** and **Client secret**.

### 2. DNS

Add an `A` record: `oop` → the server's IPv4 address (and `AAAA` for IPv6, if you use it).
Ports 80 and 443 must be open on the server (Hetzner Cloud firewall / `ufw`), because Caddy uses them to get the certificate.

### 3. Start it

On the server (Docker with the Compose plugin installed):

```bash
git clone <this repo> && cd <repo>/oop-practice
cp .env.example .env
nano .env        # fill in DOMAIN, ADMIN_EMAILS, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
                 # NEXTAUTH_SECRET and POSTGRES_PASSWORD (openssl rand -base64 32 for each)
docker compose up -d --build
```

Open `https://oop.yamenrock.com` and sign in with an email from `ADMIN_EMAILS`. You will see **لوحة المعلّم**.
The database tables are created automatically on the first request.

### 4. Add students

**لوحة المعلّم → إدارة قائمة الطلاب**: paste one line per student, `email, name, class`. Columns copied from Excel (tab-separated) work too.
Only emails in this list (and the admins) can sign in. Removing a student blocks their sign-in at once; their scores stay saved.

### Everyday commands

```bash
docker compose logs -f app                 # app logs
git pull && docker compose up -d --build   # update to a new version
docker compose exec db pg_dump -U oop oop > backup-$(date +%F).sql   # backup
docker compose exec -T db psql -U oop oop < backup-2026-11-01.sql    # restore into an empty database
```

If another web server (Nginx) already uses ports 80/443, remove the `caddy` service from `docker-compose.yml`, add `ports: ["127.0.0.1:3000:3000"]` to `app`, and proxy your domain to `http://127.0.0.1:3000`.

## Local development

```bash
docker run -d --name oop-db -e POSTGRES_USER=oop -e POSTGRES_PASSWORD=oop -e POSTGRES_DB=oop -p 5432:5432 postgres:16-alpine
cp .env.example .env.local   # set DATABASE_URL and NEXTAUTH_URL (the commented lines), and the Google keys
npm install
npm run dev                  # http://localhost:3000
```

For local sign-in, add `http://localhost:3000/api/auth/callback/google` as another redirect URI in the Google OAuth client.

## Project layout

| Path | What it is |
| --- | --- |
| `data/exercises.json` | The exercises |
| `app/page.tsx` | Student home: total points, progress, exercises by topic |
| `app/exercise/[id]/` | Exercise page and the interactive answer component |
| `app/api/attempts/route.ts` | Checks answers and saves scores |
| `app/teacher/` | Teacher dashboard and the student list |
| `lib/auth.ts` | Google sign-in, allow list, admin check |
| `lib/scores.ts` | Scoring rules and dashboard queries |
| `lib/db.ts` | PostgreSQL connection and table definitions |
| `scripts/verify-exercises.mjs` | Exercise checker (`npm run verify`) |
| `Dockerfile`, `docker-compose.yml`, `Caddyfile` | Deployment |
