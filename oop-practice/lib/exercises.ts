import "server-only";
import data from "@/data/exercises.json";

type BaseExercise = {
  id: string;
  topic: string;
  title: string;
  question: string;
  code: string[];
  hint: string;
  explanation: string;
  points: number;
};

export type OutputExercise = BaseExercise & { type: "output"; expectedOutput: string[] };
export type McqExercise = BaseExercise & { type: "mcq"; options: string[]; correctIndex: number };
export type Exercise = OutputExercise | McqExercise;

// What the browser gets before answering: no answer, hint or explanation.
export type PublicExercise = {
  id: string;
  type: Exercise["type"];
  topic: string;
  topicLabel: string;
  title: string;
  question: string;
  code: string;
  options?: string[];
  points: number;
  maxPoints: number;
};

export const FIRST_TRY_BONUS: number = data.firstTryBonus;
export const TOPICS: Record<string, string> = data.topics;
export const EXERCISES = data.exercises as Exercise[];

export function getExercise(id: string) {
  return EXERCISES.find((e) => e.id === id);
}

export function maxPoints(ex: Exercise) {
  return ex.points + FIRST_TRY_BONUS;
}

export function toPublic(ex: Exercise): PublicExercise {
  return {
    id: ex.id,
    type: ex.type,
    topic: ex.topic,
    topicLabel: TOPICS[ex.topic] ?? ex.topic,
    title: ex.title,
    question: ex.question,
    code: ex.code.join("\n"),
    options: ex.type === "mcq" ? ex.options : undefined,
    points: ex.points,
    maxPoints: maxPoints(ex),
  };
}

// Output is compared line by line, ignoring spaces at line ends and blank lines
// at the start/end. Letters and inner spaces must match exactly, as in the exam.
export function normalizeOutput(text: string) {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

export function isCorrect(ex: Exercise, answer: string) {
  if (ex.type === "mcq") return Number(answer) === ex.correctIndex;
  return normalizeOutput(answer) === normalizeOutput(ex.expectedOutput.join("\n"));
}

export function correctAnswerText(ex: Exercise) {
  return ex.type === "mcq" ? ex.options[ex.correctIndex] : ex.expectedOutput.join("\n");
}
