import { openai } from "@/src/lib/ai-client";
import { chargeCredits } from "@/src/lib/billing";

/** When present, these rows come from the playground grader (reference solution outputs). */
type ApplyFixTestFailure = {
  index: number;
  input: string;
  expected: string;
  status: "fail" | "error";
  actual?: string;
  message?: string;
};

type ApplyFixRequest = {
  code?: string;
  language?: string;
  suggestion?: string;
  challenge?: string;
  requirements?: string[];
  testFailures?: ApplyFixTestFailure[];
};

function asString(x: unknown, fallback = "") {
  return typeof x === "string" ? x : fallback;
}

function safeJsonParse(raw: string): any | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Strip accidental triple-backtick fences if the model ever returns them.
function stripFences(code: string): string {
  const fenced = code.match(/^\s*```[a-zA-Z0-9]*\n([\s\S]*?)\n```\s*$/);
  return fenced ? fenced[1] : code;
}

function normalizeTestFailures(raw: unknown): ApplyFixTestFailure[] {
  if (!Array.isArray(raw)) return [];
  const out: ApplyFixTestFailure[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const index = typeof o.index === "number" && Number.isFinite(o.index) ? o.index : -1;
    const input = asString(o.input);
    const expected = asString(o.expected);
    const status = o.status === "fail" || o.status === "error" ? o.status : null;
    if (index < 0 || !input || !expected || !status) continue;
    if (status === "fail") {
      out.push({
        index,
        input,
        expected,
        status: "fail",
        actual: o.actual !== undefined ? asString(o.actual) : "",
      });
    } else {
      out.push({
        index,
        input,
        expected,
        status: "error",
        message: asString(o.message),
      });
    }
  }
  return out;
}

function formatTestFailuresForPrompt(failures: ApplyFixTestFailure[]): string {
  return failures
    .map((f) => {
      if (f.status === "fail") {
        return `Case #${f.index}: status=FAIL | input=${f.input} | expected (reference)=${f.expected} | got=${f.actual ?? ""}`;
      }
      return `Case #${f.index}: status=ERROR | input=${f.input} | expected (reference)=${f.expected} | runtime: ${f.message || "(no message)"}`;
    })
    .join("\n");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ApplyFixRequest;
    const code = asString(body?.code);
    const language = asString(body?.language).trim() || "javascript";
    const suggestion = asString(body?.suggestion).trim();
    const challenge = asString(body?.challenge).trim();
    const requirements = Array.isArray(body?.requirements) ? body!.requirements! : [];
    const testFailures = normalizeTestFailures(body?.testFailures);

    const billing = await chargeCredits(5);
  
    if (!billing.success) {
      return Response.json({ error: billing.error }, { status: 402 });
    }

    if (!code.trim()) {
      return Response.json({ error: "Missing code" }, { status: 400 });
    }
    if (!suggestion) {
      return Response.json({ error: "Missing suggestion" }, { status: 400 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const failuresBlock =
      testFailures.length > 0
        ? [
            "",
            "Automated test failures below are from the playground grader; \"expected\" is the reference solution output. Align return values, edge cases, and conventions so these cases pass — including when that differs from textbook definitions.",
            "",
            formatTestFailuresForPrompt(testFailures),
          ].join("\n")
        : "";

    const response = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content:
            'You are a senior software engineer. Rewrite the user\'s code and return ONLY valid JSON: {"code": string}. No markdown fences or prose outside JSON. Prefer simple, idiomatic code.\n\nPriorities:\n1) If the user message includes an \"Automated test failures\" section, those expected values are authoritative for the grader. Fix logic so outputs match reference expectations for those rows (including types such as null vs number).\n2) Apply the improvement suggestion when it does not conflict with (1).\n3) Keep the same entry function name and overall structure unless (1) or the suggestion requires changes.\n4) Avoid unrelated refactors or extra features.\n\nHandling inputs or return shapes implied by failing tests is required behavior — not \"unnecessary defensive code\". Only skip extras that neither the task nor the failures imply.',
        },
        {
          role: "user",
          content: [
            `Language: ${language}`,
            challenge ? `Task: ${challenge}` : "",
            requirements.length ? `Requirements: ${requirements.join(" | ")}` : "",
            failuresBlock,
            "",
            `Improvement suggestion (from code review): ${suggestion}`,
            "",
            testFailures.length > 0
              ? "Rewrite the code so it satisfies the failing cases above (reference outputs) while addressing the suggestion where compatible. Return JSON: {\"code\": \"...full updated source...\"}."
              : "Rewrite the code to apply the suggestion only. Keep everything else the same where possible. Return JSON: {\"code\": \"...\"}.",
            "",
            "Current code:",
            code,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    });

    const raw = response.choices?.[0]?.message?.content ?? "";
    const parsed = safeJsonParse(raw) ?? {};
    const fixed = stripFences(asString((parsed as any)?.code, "")).replace(/\r\n/g, "\n");

    if (!fixed.trim()) {
      return Response.json(
        { error: "Empty fix", message: "Model did not return code." },
        { status: 502 }
      );
    }

    return new Response(JSON.stringify({ code: fixed }), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: "Failed to apply fix", message: err?.message || String(err) },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
