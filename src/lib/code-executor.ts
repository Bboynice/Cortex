export async function executeCode(code: string, language: string): Promise<string> {
  // 1. Map your string languages to Judge0's strict integer IDs
  const languageIds: Record<string, number> = {
    javascript: 93, // Node.js 18
    python: 71,     // Python 3
    rust: 73,       // Rust
  };

  const langId = languageIds[language];
  if (!langId) {
    return `Error: Unsupported language '${language}'`;
  }

  // 2. Prepare the Judge0 API request
  // ?wait=true forces the API to return the result in one single network request
  // ?base64_encoded=false keeps the payload readable and easy to parse
  const url = "https://judge0-ce.p.rapidapi.com/submissions?wait=true&base64_encoded=false";
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "", 
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        language_id: langId,
        source_code: code,
        // SECURITY LIMITS: Protects against infinite loops crashing the sandbox
        cpu_time_limit: 3.0, // 3 seconds max runtime
        memory_limit: 128000 // 128MB max RAM
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return `Error: Judge0 API request failed (${response.status}): ${errorText}`;
    }

    const data = await response.json();

    // 3. Parse the Judge0 Output structure

    // Status 6 = Compilation Error (Highly relevant for Rust)
    if (data.status?.id === 6) {
      return `Compilation Error:\n${data.compile_output || data.message}`;
    }

    // Status 5 = Time Limit Exceeded (Infinite loop caught!)
    if (data.status?.id === 5) {
      return "Error: Time Limit Exceeded. Check for infinite loops in your code.";
    }

    // Standard Error = Code compiled, but crashed while running (e.g., Python syntax error)
    if (data.stderr) {
      return `Error:\n${data.stderr}`;
    }

    // Standard Output = Success!
    const output = data.stdout?.trim();
    return output && output.length > 0 ? output : "Executed successfully (no output).";

  } catch (err: any) {
    return `Error: Failed to reach Executor API (${err?.message ?? String(err)})`;
  }
}