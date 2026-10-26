const KEYWORDS = new Set([
  "abstract", "as", "base", "bool", "break", "case", "catch", "char", "class", "const", "continue",
  "default", "do", "double", "else", "false", "for", "foreach", "if", "in", "int", "interface", "is",
  "new", "null", "object", "override", "private", "protected", "public", "return", "sealed", "static",
  "string", "switch", "this", "throw", "true", "try", "var", "virtual", "void", "while",
]);

const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g;

function highlight(line: string) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) parts.push(line.slice(last, i));
    const [text, comment, str, chr, num, word] = m;
    let cls = "";
    if (comment) cls = "text-slate-500 italic";
    else if (str || chr) cls = "text-amber-300";
    else if (num) cls = "text-orange-300";
    else if (word && KEYWORDS.has(word)) cls = "text-sky-400";
    else if (word && /^[A-Z]/.test(word)) cls = "text-emerald-300";
    parts.push(cls ? <span key={i} className={cls}>{text}</span> : text);
    last = i + text.length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

export default function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div dir="ltr" className="overflow-x-auto rounded-xl bg-slate-900 py-3 text-left text-[13px] leading-6 shadow-inner sm:text-sm">
      <pre className="font-mono text-slate-100">
        {lines.map((line, n) => (
          <div key={n} className="flex">
            <span className="w-10 shrink-0 select-none pe-3 text-right text-slate-500">{n + 1}</span>
            <code className="whitespace-pre pe-4">{highlight(line)}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}
