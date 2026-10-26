import Link from "next/link";
import { notFound } from "next/navigation";
import CodeBlock from "@/components/CodeBlock";
import RichText from "@/components/RichText";
import { requireUser } from "@/lib/auth";
import { EXERCISES, getExercise, toPublic } from "@/lib/exercises";
import { TYPE_LABELS } from "@/lib/labels";
import { getScores } from "@/lib/scores";
import ExercisePlayer from "./ExercisePlayer";

export default async function ExercisePage({ params }: PageProps<"/exercise/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const ex = getExercise(id);
  if (!ex) notFound();

  const score = (await getScores(user.email)).get(ex.id);
  const pub = toPublic(ex);
  const index = EXERCISES.indexOf(ex);
  const prev = EXERCISES[index - 1];
  const next = EXERCISES[index + 1];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm">
        <Link href="/" className="text-indigo-700 hover:underline">
          → كل التمارين
        </Link>
        <span className="text-slate-500">
          تمرين {index + 1} من {EXERCISES.length}
        </span>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-indigo-50 px-2 py-0.5 text-indigo-700">{TYPE_LABELS[ex.type]}</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">{pub.topicLabel}</span>
          <span className="rounded bg-amber-50 px-2 py-0.5 text-amber-700">
            {ex.points} نقطة + {pub.maxPoints - ex.points} مكافأة للمحاولة الأولى
          </span>
        </div>
        <h1 className="text-xl font-bold sm:text-2xl">
          <RichText text={ex.title} />
        </h1>
        <p className="mt-2 text-slate-700">
          <RichText text={ex.question} />
        </p>
      </div>

      <CodeBlock code={pub.code} />

      <ExercisePlayer
        key={ex.id}
        exercise={pub}
        nextId={next?.id}
        initial={
          score && { attempts: score.attempts, solved: score.solved, revealed: score.revealed, bestPoints: score.best_points }
        }
      />

      <div className="flex justify-between border-t border-slate-200 pt-4 text-sm">
        {prev ? (
          <Link href={`/exercise/${prev.id}`} className="text-indigo-700 hover:underline">
            → السابق
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/exercise/${next.id}`} className="text-indigo-700 hover:underline">
            التالي ←
          </Link>
        )}
      </div>
    </div>
  );
}
