import "server-only";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

export type CurrentUser = {
  email: string;
  name: string;
  image?: string | null;
  isAdmin: boolean;
};

const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email: string) => adminEmails().includes(email.toLowerCase());

async function findStudent(email: string) {
  const rows = await query<{ name: string }>("SELECT name FROM students WHERE email = $1", [email.toLowerCase()]);
  return rows[0];
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    // Only the admin(s) and emails the teacher added may sign in.
    async signIn({ profile }) {
      const p = profile as { email?: string; email_verified?: boolean; name?: string } | undefined;
      const email = p?.email?.toLowerCase();
      if (!email || p?.email_verified === false) return false;
      if (isAdminEmail(email)) return true;
      if (!(await findStudent(email))) return false;
      await query("UPDATE students SET google_name = $2, last_login = now() WHERE email = $1", [email, p?.name ?? null]);
      return true;
    },
  },
};

// Reads the session and re-checks the allow list, so removing a student takes effect at once.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;
  if (isAdminEmail(email)) {
    return { email, name: session?.user?.name ?? email, image: session?.user?.image, isAdmin: true };
  }
  const student = await findStudent(email);
  if (!student) return null;
  return { email, name: student.name || session?.user?.name || email, image: session?.user?.image, isAdmin: false };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/");
  return user;
}
