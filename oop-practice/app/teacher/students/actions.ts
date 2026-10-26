"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export type AddState = { added: number; invalid: string[] } | null;

const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

// Each line: email, name, class  (comma or tab separated, so a paste from Excel works).
// The class field can be left empty to use the "class for all" field.
export async function addStudents(_prev: AddState, form: FormData): Promise<AddState> {
  await requireAdmin();
  const defaultClass = String(form.get("className") ?? "").trim();
  const lines = String(form.get("lines") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const invalid: string[] = [];
  let added = 0;
  for (const line of lines) {
    const [email = "", name = "", className = ""] = line.split(/\t|,|;/).map((p) => p.trim());
    if (!EMAIL.test(email)) {
      invalid.push(line);
      continue;
    }
    await query(
      `INSERT INTO students (email, name, class_name) VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
         SET name = CASE WHEN EXCLUDED.name <> '' THEN EXCLUDED.name ELSE students.name END,
             class_name = CASE WHEN EXCLUDED.class_name <> '' THEN EXCLUDED.class_name ELSE students.class_name END`,
      [email.toLowerCase(), name, className || defaultClass],
    );
    added++;
  }
  revalidatePath("/teacher", "layout");
  return { added, invalid };
}

export async function removeStudent(form: FormData) {
  await requireAdmin();
  await query("DELETE FROM students WHERE email = $1", [String(form.get("email"))]);
  revalidatePath("/teacher", "layout");
}
