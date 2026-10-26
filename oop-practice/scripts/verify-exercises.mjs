// Checks data/exercises.json:
//  - structure (ids, topics, options, points)
//  - every "output" exercise compiles and prints exactly expectedOutput
//    (needs the .NET SDK: https://dotnet.microsoft.com/download)
//
// Usage: npm run verify            (structure + C# run)
//        npm run verify -- --no-run (structure only)

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const file = path.join(import.meta.dirname, "..", "data", "exercises.json");
const data = JSON.parse(readFileSync(file, "utf8"));
const runCode = !process.argv.includes("--no-run");

let failures = 0;
const fail = (id, msg) => {
  failures++;
  console.error(`✗ ${id}: ${msg}`);
};

const ids = new Set();
for (const ex of data.exercises) {
  if (ids.has(ex.id)) fail(ex.id, "duplicate id");
  ids.add(ex.id);
  if (!data.topics[ex.topic]) fail(ex.id, `unknown topic "${ex.topic}"`);
  if (!Array.isArray(ex.code)) fail(ex.id, "code must be an array of lines");
  if (!(ex.points > 0)) fail(ex.id, "points must be positive");
  for (const key of ["title", "question", "hint", "explanation"]) {
    if (!ex[key]) fail(ex.id, `missing ${key}`);
  }
  if (ex.type === "output") {
    if (!Array.isArray(ex.expectedOutput) || ex.expectedOutput.length === 0) {
      fail(ex.id, "expectedOutput must be a non-empty array of lines");
    }
  } else if (ex.type === "mcq") {
    if (!Array.isArray(ex.options) || ex.options.length < 2) fail(ex.id, "needs at least 2 options");
    if (!(ex.correctIndex >= 0 && ex.correctIndex < ex.options.length)) fail(ex.id, "correctIndex out of range");
  } else {
    fail(ex.id, `unknown type "${ex.type}"`);
  }
}

if (runCode) {
  const dir = mkdtempSync(path.join(tmpdir(), "oop-verify-"));
  try {
    execFileSync("dotnet", ["new", "console", "--force", "-o", dir], { stdio: "ignore" });
    execFileSync("dotnet", ["build", dir, "-v", "q"], { stdio: "ignore" });
    for (const ex of data.exercises.filter((e) => e.type === "output")) {
      writeFileSync(path.join(dir, "Program.cs"), ex.code.join("\n"));
      let out;
      try {
        out = execFileSync("dotnet", ["run", "--project", dir], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
      } catch (e) {
        fail(ex.id, `did not compile/run:\n${e.stdout}${e.stderr}`);
        continue;
      }
      const actual = out.replace(/\r/g, "").trimEnd().split("\n");
      if (actual.join("\n") !== ex.expectedOutput.join("\n")) {
        fail(ex.id, `expected:\n${ex.expectedOutput.join("\n")}\nactual:\n${actual.join("\n")}`);
      } else {
        console.log(`✓ ${ex.id}`);
      }
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

console.log(failures ? `\n${failures} problem(s) found` : `\nAll ${data.exercises.length} exercises OK`);
process.exit(failures ? 1 : 0);
