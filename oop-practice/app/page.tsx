import Link from "next/link";
import RichText from "@/components/RichText";
import { requireUser } from "@/lib/auth";
import { EXERCISES, TOPICS, maxPoints } from "@/lib/exercises";
import { TYPE_LABELS } from "@/lib/labels";
import { getScores, summarize, type ExerciseScore } from "@/lib/scores";

function Status({ score }: { score?: ExerciseScore }) {
  if (score?.solved)
    return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">✓ محلول</span>;
  if (score?.revealed)
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">عُرض الحل</span>;
  if (score?.attempts)
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">حاول مرة أخرى</span>;
  return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">جديد</span>;
}

export default async function HomePage() {
  const user = await requireUser();
  const scores = await getScores(user.email);
  const { total, solved } = summarize(scores);
  const max = EXERCISES.reduce((sum, ex) => sum + maxPoints(ex), 0);
  const pct = Math.round((solved / EXERCISES.length) * 100);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-l from-indigo-600 to-violet-600 p-5 text-white shadow sm:p-6">
        <p className="text-sm opacity-90">مرحبًا {user.name} 👋</p>
        <div className="mt-3 flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <div className="text-3xl font-bold">
              {total} <span className="text-base font-normal opacity-80">/ {max} نقطة</span>
            </div>
          </div>
          <div className="min-w-48 flex-1">
            <div className="mb-1 flex justify-between text-sm opacity-90">
              <span>
                حللت {solved} من {EXERCISES.length} تمارين
              </span>
              <span>{pct}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </section>

      {Object.entries(TOPICS).map(([topic, label]) => {
        const list = EXERCISES.filter((ex) => ex.topic === topic);
        if (list.length === 0) return null;
        const done = list.filter((ex) => scores.get(ex.id)?.solved).length;
        return (
          <section key={topic}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-lg font-bold">{label}</h2>
              <span className="text-sm text-slate-500">
                {done} / {list.length}
              </span>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {list.map((ex) => {
                const s = scores.get(ex.id);
                return (
                  <li key={ex.id}>
                    <Link
                      href={`/exercise/${ex.id}`}
                      className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold">
                          <RichText text={ex.title} />
                        </span>
                        <Status score={s} />
                      </div>
                      <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                        <span className="rounded bg-indigo-50 px-2 py-0.5 text-indigo-700">{TYPE_LABELS[ex.type]}</span>
                        <span>
                          {s ? `${s.best_points} / ` : ""}
                          {maxPoints(ex)} نقطة
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
