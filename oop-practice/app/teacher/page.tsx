import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { EXERCISES, maxPoints } from "@/lib/exercises";
import { getDashboard, summarize, type ExerciseScore } from "@/lib/scores";

const dateFmt = new Intl.DateTimeFormat("ar", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jerusalem",
});

function Cell({ s, max }: { s?: ExerciseScore; max: number }) {
  if (!s) return <span className="text-slate-300">–</span>;
  const cls = s.solved
    ? s.best_points === max
      ? "bg-green-600 text-white"
      : "bg-green-100 text-green-800"
    : s.revealed
      ? "bg-amber-100 text-amber-800"
      : "bg-red-100 text-red-700";
  return (
    <span
      className={`inline-block min-w-8 rounded px-1 py-0.5 ${cls}`}
      title={`محاولات: ${s.attempts}${s.revealed ? " · عُرض الحل" : ""}`}
    >
      {s.best_points}
    </span>
  );
}

export default async function TeacherPage({ searchParams }: PageProps<"/teacher">) {
  await requireAdmin();
  const { class: classFilter } = await searchParams;
  const all = await getDashboard();
  const classes = [...new Set(all.map((s) => s.class_name).filter(Boolean))].sort();
  const students = classFilter ? all.filter((s) => s.class_name === classFilter) : all;
  const maxTotal = EXERCISES.reduce((sum, ex) => sum + maxPoints(ex), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">لوحة المعلّم</h1>
        <Link
          href="/teacher/students"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          إدارة قائمة الطلاب
        </Link>
      </div>

      {classes.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/teacher"
            className={`rounded-full px-3 py-1 ${!classFilter ? "bg-slate-800 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}
          >
            الكل ({all.length})
          </Link>
          {classes.map((c) => (
            <Link
              key={c}
              href={`/teacher?class=${encodeURIComponent(c)}`}
              className={`rounded-full px-3 py-1 ${classFilter === c ? "bg-slate-800 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}
            >
              {c} ({all.filter((s) => s.class_name === c).length})
            </Link>
          ))}
        </div>
      )}

      {students.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          لا يوجد طلاب بعد.{" "}
          <Link href="/teacher/students" className="text-indigo-700 underline">
            أضف طلابًا
          </Link>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600">
              <tr>
                <th className="sticky right-0 bg-slate-50 px-3 py-2 text-start">الطالب</th>
                <th className="px-3 py-2 text-start">الصف</th>
                <th className="px-3 py-2">النقاط</th>
                <th className="px-3 py-2" title="مجموع نقاط المحاولة الأولى في كل تمرين">
                  المحاولة الأولى
                </th>
                <th className="px-3 py-2">محلول</th>
                <th className="px-3 py-2 text-start">آخر نشاط</th>
                {EXERCISES.map((ex, i) => (
                  <th key={ex.id} className="px-1 py-2 font-mono" title={ex.title.replaceAll("`", "")}>
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => {
                const sum = summarize(s.scores);
                return (
                  <tr key={s.email} className="hover:bg-slate-50">
                    <td className="sticky right-0 bg-white px-3 py-2">
                      <div className="font-medium">{s.name || s.google_name || "—"}</div>
                      <div dir="ltr" className="text-end text-xs text-slate-500">
                        {s.email}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">{s.class_name}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-center font-bold">
                      {sum.total} <span className="text-xs font-normal text-slate-400">/ {maxTotal}</span>
                    </td>
                    <td className="px-3 py-2 text-center">{sum.first}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-center">
                      {sum.solved} / {EXERCISES.length}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-500">
                      {s.last_activity ? dateFmt.format(s.last_activity) : s.last_login ? "دخل ولم يحلّ بعد" : "لم يدخل بعد"}
                    </td>
                    {EXERCISES.map((ex) => (
                      <td key={ex.id} className="px-1 py-2 text-center font-mono text-xs">
                        <Cell s={s.scores.get(ex.id)} max={maxPoints(ex)} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
        <span>
          <span className="me-1 inline-block h-3 w-3 rounded bg-green-600 align-middle" />
          صحيح من المحاولة الأولى
        </span>
        <span>
          <span className="me-1 inline-block h-3 w-3 rounded bg-green-100 align-middle" />
          صحيح بعد عدّة محاولات
        </span>
        <span>
          <span className="me-1 inline-block h-3 w-3 rounded bg-red-100 align-middle" />
          لم يُحلّ بعد
        </span>
        <span>
          <span className="me-1 inline-block h-3 w-3 rounded bg-amber-100 align-middle" />
          عُرض الحل
        </span>
        <span>الرقم في الخلية = أفضل نتيجة. مرّر المؤشر فوق رقم التمرين لترى عنوانه.</span>
      </div>
    </div>
  );
}
