"use client";

import { useActionState } from "react";
import { addStudents, type AddState } from "./actions";

export default function AddStudentsForm() {
  const [state, action, pending] = useActionState<AddState, FormData>(addStudents, null);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-bold">إضافة طلاب</h2>
      <p className="text-sm text-slate-600">
        سطر لكل طالب: <span dir="ltr" className="inline-code">email, name, class</span>. يمكن لصق الأعمدة مباشرة من Excel. إذا
        كان البريد موجودًا، يُحدَّث الاسم والصف.
      </p>
      <textarea
        name="lines"
        dir="ltr"
        rows={6}
        required
        placeholder={"rami@gmail.com, Rami Khoury, 11M\nsara@gmail.com, Sara Haddad, 11M"}
        className="w-full rounded-lg border border-slate-300 p-3 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-slate-600">الصف لكل من لم يُكتب صفّه (اختياري)</span>
          <input
            name="className"
            placeholder="مثلًا: الجليل 11 م"
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        <button
          disabled={pending}
          className="rounded-xl bg-indigo-600 px-5 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "..." : "إضافة"}
        </button>
      </div>
      {state && (
        <div className="text-sm">
          <p className="text-green-700">✓ أُضيف أو حُدِّث {state.added} طالب.</p>
          {state.invalid.length > 0 && (
            <div className="mt-1 text-red-700">
              أسطر غير صالحة (لم تُضف):
              <ul dir="ltr" className="mt-1 list-inside list-disc font-mono text-xs">
                {state.invalid.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
