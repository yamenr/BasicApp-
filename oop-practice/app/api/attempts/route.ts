import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { correctAnswerText, getExercise } from "@/lib/exercises";
import { recordAttempt, revealSolution } from "@/lib/scores";

type Body = { exerciseId?: string; answer?: string; reveal?: boolean };

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Body;
  const ex = body.exerciseId ? getExercise(body.exerciseId) : undefined;
  if (!ex) return NextResponse.json({ error: "unknown exercise" }, { status: 404 });

  if (body.reveal) {
    await revealSolution(user.email, ex.id);
    return NextResponse.json({
      revealed: true,
      explanation: ex.explanation,
      correctAnswer: correctAnswerText(ex),
      correctIndex: ex.type === "mcq" ? ex.correctIndex : undefined,
    });
  }

  if (typeof body.answer !== "string" || body.answer.trim() === "") {
    return NextResponse.json({ error: "empty answer" }, { status: 400 });
  }

  const result = await recordAttempt(user.email, ex, body.answer);
  return NextResponse.json({
    ...result,
    // The explanation (which gives the answer away) comes only with a correct answer.
    hint: result.correct ? undefined : ex.hint,
    explanation: result.correct ? ex.explanation : undefined,
  });
}
