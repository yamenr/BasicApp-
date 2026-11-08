import { encode } from "next-auth/jwt";
import { query } from "@/lib/db";
import { DEMO_LOGIN, DEMO_USERS } from "@/lib/demo";

// GET /api/demo-login?as=teacher|student  (development only, see lib/demo.ts)
// The teacher is an admin only if teacher@demo.local is in ADMIN_EMAILS.
export async function GET(request: Request) {
  if (!DEMO_LOGIN) return new Response("Not found", { status: 404 });

  const as = new URL(request.url).searchParams.get("as") === "teacher" ? "teacher" : "student";
  const user = DEMO_USERS[as];
  if (as === "student") {
    await query(
      "INSERT INTO students (email, name, class_name) VALUES ($1, $2, 'تجريبي') ON CONFLICT (email) DO NOTHING",
      [user.email, user.name],
    );
  }
  const token = await encode({ token: { email: user.email, name: user.name }, secret: process.env.NEXTAUTH_SECRET ?? "" });
  // Relative redirect and SameSite=None, so it also works inside a preview frame on another host.
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/",
      "Set-Cookie": `next-auth.session-token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=86400`,
    },
  });
}
