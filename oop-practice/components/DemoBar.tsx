import { DEMO_LOGIN } from "@/lib/demo";

export default function DemoBar() {
  if (!DEMO_LOGIN) return null;
  return (
    <div className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      وضع تجريبي: ادخل كـ{" "}
      <a href="/api/demo-login?as=teacher" className="font-medium underline">
        معلّم
      </a>{" "}
      أو{" "}
      <a href="/api/demo-login?as=student" className="font-medium underline">
        طالب
      </a>
    </div>
  );
}
