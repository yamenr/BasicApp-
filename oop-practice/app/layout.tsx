import type { Metadata, Viewport } from "next";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "تدريب البرمجة الكائنية",
  description: "تمارين تفاعلية في الوراثة وتعدّد الأشكال بلغة C#",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {user && (
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <nav className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-2">
              <Link href="/" className="me-auto flex items-center gap-2 font-bold text-indigo-700">
                <span dir="ltr" className="rounded-md bg-indigo-600 px-1.5 py-0.5 font-mono text-xs text-white">
                  C#
                </span>
                <span className="hidden sm:inline">تدريب البرمجة الكائنية</span>
              </Link>
              <Link href="/" className="rounded-lg px-3 py-1.5 text-sm hover:bg-slate-100">
                التمارين
              </Link>
              {user.isAdmin && (
                <Link href="/teacher" className="rounded-lg px-3 py-1.5 text-sm hover:bg-slate-100">
                  لوحة المعلّم
                </Link>
              )}
              <SignOutButton />
            </nav>
          </header>
        )}
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
