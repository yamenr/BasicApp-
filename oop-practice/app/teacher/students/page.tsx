import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import AddStudentsForm from "./AddStudentsForm";
import RemoveButton from "./RemoveButton";

type Student = { email: string; name: string; class_name: string; last_login: Date | null };

export default async function StudentsPage() {
  await requireAdmin();
  const students = await query<Student>(
    "SELECT email, name, class_name, last_login FROM students ORDER BY class_name, name, email",
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">قائمة الطلاب</h1>
        <Link href="/teacher" className="text-sm text-indigo-700 hover:underline">
          → لوحة المعلّم
        </Link>
      </div>
      <p className="text-sm text-slate-600">
        فقط من في هذه القائمة يستطيع الدخول إلى التطبيق. المعلّم (المسؤول) معرّف في إعدادات الخادم{" "}
        <span dir="ltr" className="inline-code">ADMIN_EMAILS</span>.
      </p>

      <AddStudentsForm />

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-600">
            <tr>
              <th className="px-3 py-2 text-start">الاسم</th>
              <th className="px-3 py-2 text-start">البريد</th>
              <th className="px-3 py-2 text-start">الصف</th>
              <th className="px-3 py-2 text-start">دخل؟</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  القائمة فارغة.
                </td>
              </tr>
            )}
            {students.map((s) => (
              <tr key={s.email}>
                <td className="px-3 py-2">{s.name || "—"}</td>
                <td dir="ltr" className="px-3 py-2 text-end font-mono text-xs">
                  {s.email}
                </td>
                <td className="px-3 py-2">{s.class_name}</td>
                <td className="px-3 py-2">{s.last_login ? "✓" : "—"}</td>
                <td className="px-3 py-2 text-end">
                  <RemoveButton email={s.email} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">{students.length} طالب</p>
    </div>
  );
}
