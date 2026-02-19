import { openai } from "@/src/lib/ai-client";

type InsightFeedbackKind = "issue" | "improvement" | "praise";

type InsightAnalysisResponse = {
  scores: { codeQuality: number; performance: number; bestPractices: number };
  summaries: { codeQuality: string; performance: string; bestPractices: string };
  feedback: { id: string; title: string; text: string; kind: InsightFeedbackKind }[];
  overallSuggestion: string;
  analyzedAt: string;
};

function clampScore(n: unknown, fallback: number) {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : fallback;
  return Math.max(0, Math.min(100, v));
}

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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    const code = asString(body?.code).trim();
    const language = asString(body?.language).trim() || "javascript";
    const challenge = asString(body?.challenge).trim();
    const requirements = Array.isArray(body?.requirements) ? body.requirements : [];

    if (!code) {
      return Response.json({ error: "Missing code" }, { status: 400 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            'You are a senior software engineer doing concise code review. Return ONLY valid JSON (no markdown, no backticks). Keep text short and actionable.',
        },
        {
          role: "user",
          content: [
            `Language: ${language}`,
            challenge ? `Task: ${challenge}` : "",
            requirements?.length ? `Requirements: ${requirements.join(" | ")}` : "",
            "",
            "Analyze the user's code and return JSON in this shape:",
            '{ "scores": { "codeQuality": 0-100, "performance": 0-100, "bestPractices": 0-100 },',
            '  "summaries": { "codeQuality": string, "performance": string, "bestPractices": string },',
            '  "feedback": [ { "id": string, "title": string, "text": string, "kind": "issue"|"improvement"|"praise" } ],',
            '  "overallSuggestion": string }',
            "",
            "Rules:",
            "- feedback: 3 to 6 items, each title <= 5 words, text <= 240 chars",
            "- Be specific to the given code",
            "- If code is incomplete, focus on next steps and edge cases",
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
    const parsed = safeJsonParse(raw) ?? {};

    const scores = (parsed as any)?.scores ?? {};
    const summaries = (parsed as any)?.summaries ?? {};
    const feedbackRaw = Array.isArray((parsed as any)?.feedback) ? (parsed as any).feedback : [];

    const normalized: InsightAnalysisResponse = {
      scores: {
        codeQuality: clampScore(scores?.codeQuality, 60),
        performance: clampScore(scores?.performance, 60),
        bestPractices: clampScore(scores?.bestPractices, 60),
      },
      summaries: {
        codeQuality: asString(summaries?.codeQuality, "No summary."),
        performance: asString(summaries?.performance, "No summary."),
        bestPractices: asString(summaries?.bestPractices, "No summary."),
      },
      feedback: feedbackRaw
        .map((f: any, idx: number) => {
          const kind: InsightFeedbackKind =
            f?.kind === "issue" || f?.kind === "improvement" || f?.kind === "praise" ? f.kind : "improvement";
          const title = asString(f?.title, "").trim();
          const text = asString(f?.text, "").trim();
          return {
            id: asString(f?.id, `f_${idx}`),
            title: title || "Feedback",
            text: text || "No details.",
            kind,
          };
        })
        .filter((f: any) => Boolean(f?.title) && Boolean(f?.text))
        .slice(0, 6),
      overallSuggestion: asString((parsed as any)?.overallSuggestion, "No suggestion.").trim() || "No suggestion.",
      analyzedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: "Failed to analyze code", message: err?.message || String(err) },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}

