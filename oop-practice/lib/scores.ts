import "server-only";
import { query, transaction } from "@/lib/db";
import { EXERCISES, FIRST_TRY_BONUS, isCorrect, type Exercise } from "@/lib/exercises";

export type ExerciseScore = {
  exercise_id: string;
  attempts: number;
  solved: boolean;
  revealed: boolean;
  first_points: number;
  best_points: number;
};

export type AttemptResult = {
  correct: boolean;
  earned: number;
  firstTry: boolean;
  solved: boolean;
  revealed: boolean;
  bestPoints: number;
};

// Points: correct on the first try = points + bonus; correct later = points;
// after "show solution" = 0. first_points keeps the first attempt, best_points the best.
export async function recordAttempt(email: string, ex: Exercise, answer: string): Promise<AttemptResult> {
  return transaction(async (db) => {
    await db.query(
      "INSERT INTO exercise_scores (email, exercise_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [email, ex.id],
    );
    const { rows } = await db.query<ExerciseScore>(
      "SELECT * FROM exercise_scores WHERE email = $1 AND exercise_id = $2 FOR UPDATE",
      [email, ex.id],
    );
    const row = rows[0];
    const firstTry = row.attempts === 0;
    const correct = isCorrect(ex, answer);
    const earned = !correct || row.revealed ? 0 : ex.points + (firstTry ? FIRST_TRY_BONUS : 0);

    await db.query(
      "INSERT INTO attempts (email, exercise_id, answer, correct, points) VALUES ($1, $2, $3, $4, $5)",
      [email, ex.id, answer.slice(0, 2000), correct, earned],
    );
    const updated = await db.query<ExerciseScore>(
      `UPDATE exercise_scores
          SET attempts = attempts + 1,
              solved = solved OR ($3 AND NOT revealed),
              first_points = CASE WHEN attempts = 0 THEN $4 ELSE first_points END,
              best_points = GREATEST(best_points, $4),
              updated_at = now()
        WHERE email = $1 AND exercise_id = $2
        RETURNING *`,
      [email, ex.id, correct, earned],
    );
    const s = updated.rows[0];
    return { correct, earned, firstTry, solved: s.solved, revealed: s.revealed, bestPoints: s.best_points };
  });
}

// Showing the solution of an unsolved exercise ends earning points (and "solved") for it.
// If it happens before any attempt, the first attempt is recorded as 0.
export async function revealSolution(email: string, exerciseId: string) {
  await query(
    `INSERT INTO exercise_scores (email, exercise_id, revealed) VALUES ($1, $2, true)
     ON CONFLICT (email, exercise_id) DO UPDATE
       SET revealed = exercise_scores.revealed OR NOT exercise_scores.solved, updated_at = now()`,
    [email, exerciseId],
  );
}

export async function getScores(email: string) {
  const rows = await query<ExerciseScore>(
    "SELECT exercise_id, attempts, solved, revealed, first_points, best_points FROM exercise_scores WHERE email = $1",
    [email],
  );
  return new Map(rows.map((r) => [r.exercise_id, r]));
}

export type StudentRow = {
  email: string;
  name: string;
  class_name: string;
  google_name: string | null;
  last_login: Date | null;
  last_activity: Date | null;
  scores: Map<string, ExerciseScore>;
};

export async function getDashboard(): Promise<StudentRow[]> {
  const [students, scores] = await Promise.all([
    query<Omit<StudentRow, "scores" | "last_activity">>(
      "SELECT email, name, class_name, google_name, last_login FROM students ORDER BY class_name, name, email",
    ),
    query<ExerciseScore & { email: string; updated_at: Date }>("SELECT * FROM exercise_scores"),
  ]);
  const byEmail = new Map<string, StudentRow>(
    students.map((s) => [s.email, { ...s, last_activity: null, scores: new Map() }]),
  );
  for (const sc of scores) {
    const st = byEmail.get(sc.email);
    if (!st) continue;
    st.scores.set(sc.exercise_id, sc);
    if (!st.last_activity || sc.updated_at > st.last_activity) st.last_activity = sc.updated_at;
  }
  return [...byEmail.values()];
}

export function summarize(scores: Map<string, ExerciseScore>) {
  let total = 0;
  let first = 0;
  let solved = 0;
  let firstTryCorrect = 0;
  for (const ex of EXERCISES) {
    const s = scores.get(ex.id);
    if (!s) continue;
    total += s.best_points;
    first += s.first_points;
    if (s.solved) solved++;
    if (s.first_points > 0) firstTryCorrect++;
  }
  return { total, first, solved, firstTryCorrect };
}
