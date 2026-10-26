"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RichText from "@/components/RichText";
import type { PublicExercise } from "@/lib/exercises";

type Initial = { attempts: number; solved: boolean; revealed: boolean; bestPoints: number } | undefined;

type Feedback =
  | { kind: "correct"; earned: number; firstTry: boolean; explanation: string }
  | { kind: "wrong"; hint: string }
  | { kind: "revealed"; correctAnswer: string; correctIndex?: number; explanation: string };

export default function ExercisePlayer({
  exercise,
  nextId,
  initial,
}: {
  exercise: PublicExercise;
  nextId?: string;
  initial: Initial;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(initial?.revealed ?? false);

  const isMcq = exercise.type === "mcq";
  const answer = isMcq ? (choice === null ? "" : String(choice)) : text;
  const locked = feedback?.kind === "correct" || feedback?.kind === "revealed";

  async function send(body: object) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId: exercise.id, ...body }),
      });
      if (res.status === 401) {
        router.push("/login");
        return null;
      }
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      setError("تعذّر الاتصال بالخادم. حاول مرة أخرى.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function check() {
    if (!answer.trim()) return;
    const data = await send({ answer });
    if (!data) return;
    setFeedback(
      data.correct
        ? { kind: "correct", earned: data.earned, firstTry: data.firstTry, explanation: data.explanation }
        : { kind: "wrong", hint: data.hint },
    );
    router.refresh();
  }

  async function reveal() {
    const data = await send({ reveal: true });
    if (!data) return;
    setRevealed(true);
    setFeedback({
      kind: "revealed",
      correctAnswer: data.correctAnswer,
      correctIndex: data.correctIndex,
      explanation: data.explanation,
    });
    router.refresh();
  }

  // Changing the answer after a wrong try clears the red state.
  function edit<T>(setter: (v: T) => void, v: T) {
    setter(v);
    if (feedback?.kind === "wrong") setFeedback(null);
  }

  const correctIndex =
    feedback?.kind === "revealed" ? feedback.correctIndex : feedback?.kind === "correct" ? choice : undefined;

  return (
    <div className="space-y-4">
      {initial?.solved && !feedback && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          حللت هذا التمرين من قبل ({initial.bestPoints} نقطة). يمكنك التدرّب عليه مرة أخرى.
        </p>
      )}
      {revealed && !initial?.solved && !feedback && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          عُرض حل هذا التمرين، لذلك لن تحصل على نقاط عليه. يمكنك التدرّب عليه مرة أخرى.
        </p>
      )}

      {isMcq ? (
        <div className="grid gap-2">
          {exercise.options!.map((opt, i) => {
            const selected = choice === i;
            let style = selected ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200" : "border-slate-200 bg-white hover:border-slate-300";
            if (correctIndex === i) style = "border-green-500 bg-green-50 ring-2 ring-green-200";
            else if (selected && feedback?.kind === "wrong") style = "border-red-500 bg-red-50 ring-2 ring-red-200";
            return (
              <button
                key={i}
                type="button"
                disabled={locked || busy}
                onClick={() => edit(setChoice, i)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-start transition ${style}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                  {i + 1}
                </span>
                <span>
                  <RichText text={opt} />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <label htmlFor="output" className="mb-1 block text-sm font-medium text-slate-700">
            اكتب ما يُطبع، كل سطر في سطر منفصل:
          </label>
          <textarea
            id="output"
            dir="ltr"
            rows={Math.max(3, exercise.code.split("WriteLine").length)}
            value={text}
            disabled={locked || busy}
            onChange={(e) => edit(setText, e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            className={`w-full rounded-xl border bg-white p-3 font-mono text-sm outline-none focus:ring-2 ${
              feedback?.kind === "wrong"
                ? "border-red-500 ring-2 ring-red-200"
                : feedback?.kind === "correct"
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
            }`}
            placeholder="Output..."
          />
          <p className="mt-1 text-xs text-slate-500">انتبه للأحرف الكبيرة والصغيرة والمسافات، تمامًا كما في الامتحان.</p>
        </div>
      )}

      {!locked && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={check}
            disabled={busy || !answer.trim() || feedback?.kind === "wrong"}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {busy ? "..." : "تحقّق"}
          </button>
          {feedback?.kind === "wrong" && (
            <button
              onClick={reveal}
              disabled={busy}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              اعرض الحل
            </button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {feedback?.kind === "wrong" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-bold text-red-700">✗ إجابة غير صحيحة</p>
          <p className="mt-1 text-sm text-red-900">
            <span className="font-medium">تلميح: </span>
            <RichText text={feedback.hint} />
          </p>
          <p className="mt-2 text-xs text-red-700">
            {isMcq ? "اختر إجابة أخرى وحاول مرة أخرى." : "عدّل إجابتك وحاول مرة أخرى."}
            {!initial?.solved && ` الإجابة الصحيحة الآن تعطيك ${revealed ? 0 : exercise.points} نقطة.`}
          </p>
        </div>
      )}

      {feedback?.kind === "correct" && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-bold text-green-700">
            ✓ إجابة صحيحة!{" "}
            {feedback.earned > 0 && (
              <span className="ms-1 rounded-full bg-green-600 px-2 py-0.5 text-sm text-white">+{feedback.earned} نقطة</span>
            )}
          </p>
          {feedback.firstTry && feedback.earned > 0 && (
            <p className="mt-1 text-sm text-green-700">ممتاز، من المحاولة الأولى! حصلت على مكافأة.</p>
          )}
          <p className="mt-2 text-sm leading-7 text-green-950">
            <RichText text={feedback.explanation} />
          </p>
        </div>
      )}

      {feedback?.kind === "revealed" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-bold text-amber-800">الحل</p>
          {!isMcq && (
            <pre dir="ltr" className="mt-2 rounded-lg bg-white p-3 text-left font-mono text-sm">
              {feedback.correctAnswer}
            </pre>
          )}
          <p className="mt-2 text-sm leading-7 text-amber-950">
            <RichText text={feedback.explanation} />
          </p>
        </div>
      )}

      {locked && (
        <div className="flex flex-wrap gap-2">
          {nextId ? (
            <Link
              href={`/exercise/${nextId}`}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              التمرين التالي ←
            </Link>
          ) : (
            <Link href="/" className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-indigo-700">
              العودة إلى قائمة التمارين
            </Link>
          )}
          <button
            onClick={() => {
              setFeedback(null);
              setText("");
              setChoice(null);
            }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            حلّ مرة أخرى
          </button>
        </div>
      )}
    </div>
  );
}
