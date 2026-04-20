import { openai } from "@/src/lib/ai-client";

type ApplyFixRequest = {
  code?: string;
  language?: string;
  suggestion?: string;
  challenge?: string;
  requirements?: string[];
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ApplyFixRequest;
    const code = asString(body?.code);
    const language = asString(body?.language).trim() || "javascript";
    const suggestion = asString(body?.suggestion).trim();
    const challenge = asString(body?.challenge).trim();
    const requirements = Array.isArray(body?.requirements) ? body!.requirements! : [];

    if (!code.trim()) {
      return Response.json({ error: "Missing code" }, { status: 400 });
    }
    if (!suggestion) {
      return Response.json({ error: "Missing suggestion" }, { status: 400 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const response = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content:
            'You are a senior software engineer. You rewrite the user\'s code to apply ONE specific improvement suggestion — nothing more. Return ONLY valid JSON of the shape {"code": string}. Do not include markdown fences, comments about the change, or any prose. Prefer simple, idiomatic code. Do NOT add features, defensive checks, comments, type annotations, or abstractions that the suggestion did not ask for. Keep the same function/variable names and public signatures unless the suggestion explicitly requires changing them. If the suggestion does not actually apply, return the code unchanged.',
        },
        {
          role: "user",
          content: [
            `Language: ${language}`,
            challenge ? `Task: ${challenge}` : "",
            requirements.length ? `Requirements: ${requirements.join(" | ")}` : "",
            "",
            `Suggestion to apply: ${suggestion}`,
            "",
            "Rewrite the following code to apply ONLY the suggestion above. Keep everything else the same. Do not refactor unrelated parts. Return JSON: {\"code\": \"...\"}.",
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
