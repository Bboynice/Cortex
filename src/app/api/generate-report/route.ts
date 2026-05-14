import { openai } from "@/src/lib/ai-client";

// Match this shape on the client (or import from a shared types file later).
export type StructuralIntegrityReport = {
  headline: string;
  verdict: string;
  overview: string;
  flow: { phase: string; detail: string }[];
  loopAndComplexityNotes: string | null;
  caution: string | null;
  generatedAt: string;
};

type GenerateReportRequest = {
  code?: string;
  language?: string;
  challenge?: string;
  requirements?: string[];
};

function asString(x: unknown, fallback = "") {
  return typeof x === "string" ? x : fallback;
}

function safeJsonParse(raw: string): unknown | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeFlow(raw: unknown): StructuralIntegrityReport["flow"] {
  if (!Array.isArray(raw)) return [];
  const out: StructuralIntegrityReport["flow"] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const phase = asString((item as { phase?: unknown }).phase).trim();
    const detail = asString((item as { detail?: unknown }).detail).trim();
    if (phase && detail) out.push({ phase, detail });
    if (out.length >= 10) break;
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateReportRequest;
    const code = asString(body?.code);
    const language = asString(body?.language).trim() || "javascript";
    const challenge = asString(body?.challenge).trim();
    const requirements = Array.isArray(body?.requirements) ? body.requirements : [];

    if (!code.trim()) {
      return Response.json({ error: "Missing code" }, { status: 400 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 2200,
      messages: [
        {
          role: "system",
          content: [
            'You are "The Architect" — a calm, precise senior engineer who writes a "Structural Integrity Report" on the user\'s solution.',
            "Return ONLY valid JSON (no markdown, no backticks).",
            "Base everything on the actual code and the stated challenge. Do not invent behavior, APIs, or test results you cannot see.",
            "Keep prose concise but substantive: this is a dossier, not a novel.",
            "flow: 3–8 objects, each describing a meaningful phase of how the program runs or is organized.",
            "loopAndComplexityNotes: null if nothing notable, otherwise 1–3 sentences on loops, recursion, or complexity.",
            "caution: null if no major caveats; otherwise honest edge-case or fragility warnings.",
            'JSON shape (strict keys): {"headline": string, "verdict": string, "overview": string, "flow": [{"phase": string, "detail": string}], "loopAndComplexityNotes": string | null, "caution": string | null}',
          ].join(" "),
        },
        {
          role: "user",
          content: [
            `Language: ${language}`,
            challenge ? `Task / challenge: ${challenge}` : "",
            requirements.length ? `Requirements: ${requirements.join(" | ")}` : "",
            "",
            "Write the Structural Integrity Report for the code below.",
            "",
            "Code:",
            code,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    });

    const raw = response.choices?.[0]?.message?.content ?? "";
    const parsed = (safeJsonParse(raw) ?? {}) as Record<string, unknown>;

    const report: StructuralIntegrityReport = {
      headline: asString(parsed.headline, "Structural Integrity Report").trim() || "Structural Integrity Report",
      verdict: asString(parsed.verdict, "Unable to produce verdict.").trim() || "Unable to produce verdict.",
      overview: asString(parsed.overview, "No overview provided.").trim() || "No overview provided.",
      flow: normalizeFlow(parsed.flow),
      loopAndComplexityNotes:
        parsed.loopAndComplexityNotes === null
          ? null
          : asString(parsed.loopAndComplexityNotes).trim() || null,
      caution: parsed.caution === null ? null : asString(parsed.caution).trim() || null,
      generatedAt: new Date().toISOString(),
    };

    if (report.flow.length === 0) {
      report.flow.push({
        phase: "Flow",
        detail:
          "The model returned no structured flow. Re-run the report or check that your code is present.",
      });
    }

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: "Failed to generate report", message },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}