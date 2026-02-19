// src/lib/code-executor.ts
export async function executeCode(code: string, language: string): Promise<string> {
  if (language === "javascript") {
    try {
      // Create a virtual console to capture logs
      let output = "";
      const customConsole = {
        log: (...args: any[]) => {
          output += args.join(" ") + "\n";
        },
      };

      // Execute the code as a normal script.
      // Output only comes from console.log(...) (like a real runtime).
      // eslint-disable-next-line no-new-func
      const run = new Function("console", `"use strict";\n${code}\n`);
      run(customConsole);
      return output || "Executed successfully (no output).";
    } catch (err: any) {
      return `Error: ${err?.message ?? String(err)}`;
    }
  }

  // For Python/Rust/etc, use an external API (Piston)
  let response: Response;
  try {
    response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: "*",
        files: [{ content: code }],
      }),
    });
  } catch (err: any) {
    return `Error: Failed to reach executor API (${err?.message ?? String(err)})`;
  }

  // Piston sometimes returns non-standard shapes for errors; never assume data.run exists.
  let data: any = null;
  try {
    data = await response.json();
  } catch {
    const text = await response.text().catch(() => "");
    return response.ok
      ? `Error: Invalid JSON from executor API${text ? `: ${text}` : ""}`
      : `Error: Executor API request failed (${response.status})${text ? `: ${text}` : ""}`;
  }

  if (!response.ok) {
    const msg =
      data?.message ??
      data?.error ??
      (typeof data === "string" ? data : null) ??
      `Executor API request failed (${response.status})`;
    return `Error: ${msg}`;
  }

  const output =
    data?.run?.output ??
    data?.run?.stdout ??
    data?.run?.stderr ??
    data?.compile?.output ??
    data?.compile?.stdout ??
    data?.compile?.stderr ??
    null;

  return (typeof output === "string" && output.length > 0) ? output : "No output.";
}