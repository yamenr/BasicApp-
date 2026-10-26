"use client";

import { removeStudent } from "./actions";

export default function RemoveButton({ email }: { email: string }) {
  return (
    <form
      action={removeStudent}
      onSubmit={(e) => {
        if (!confirm(`إزالة ${email} من القائمة؟ لن يتمكّن من الدخول بعد ذلك، لكن نتائجه تبقى محفوظة.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="email" value={email} />
      <button className="rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50">إزالة</button>
    </form>
  );
}
