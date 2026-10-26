import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import SignInButton from "./SignInButton";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCurrentUser()) redirect("/");
  const { error } = await searchParams;

  return (
    <div className="mx-auto mt-10 max-w-sm sm:mt-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div dir="ltr" className="mx-auto mb-4 w-fit rounded-xl bg-indigo-600 px-3 py-2 font-mono text-lg font-bold text-white">
          C# OOP
        </div>
        <h1 className="mb-2 text-xl font-bold">تدريب البرمجة الكائنية</h1>
        <p className="mb-6 text-sm text-slate-600">تمارين في الوراثة وتعدّد الأشكال بأسلوب البجروت</p>
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error === "AccessDenied"
              ? "هذا البريد غير موجود في قائمة الطلاب. اطلب من المعلّم أن يضيفه، ثم حاول مرة أخرى."
              : "حدث خطأ أثناء الدخول. حاول مرة أخرى."}
          </p>
        )}
        <SignInButton />
      </div>
    </div>
  );
}
