// Demo login for trying the app without Google (for example in a preview).
// It works only in development (`npm run dev`) with DEMO_LOGIN=true;
// a production build can never turn it on.
export const DEMO_LOGIN = process.env.NODE_ENV !== "production" && process.env.DEMO_LOGIN === "true";

export const DEMO_USERS = {
  teacher: { email: "teacher@demo.local", name: "المعلّم (تجريبي)" },
  student: { email: "student@demo.local", name: "طالب تجريبي" },
} as const;
