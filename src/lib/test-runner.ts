// src/lib/test-runner.ts
import { executeCode } from "@/src/lib/code-executor";

export type TestStatus = "pass" | "fail" | "error" | "skipped";

export type TestResult =
  | { i: number; status: "pass"; actual: unknown; expected: unknown }
  | { i: number; status: "fail"; actual: unknown; expected: unknown }
  | { i: number; status: "error"; message: string }
  | { i: number; status: "skipped"; message: string };

export type TestCase = { input: string; output: string };

export type SupportedLanguage = "javascript" | "python" | "rust";

const SENTINEL = "__CORTEX_TEST__";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Looks for *any* function definition in the user's code. Used as a fallback
// when the AI's entryFunction hint isn't actually defined.
export function findEntryFunction(code: string, language: SupportedLanguage): string | null {
  if (language === "javascript") {
    const fnDecl = code.match(/function\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (fnDecl?.[1]) return fnDecl[1];
    // const fn = (...) => / function (...) / async (...) => / x => / function ...
    const expr = code.match(
      /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/,
    );
    return expr?.[1] ?? null;
  }
  if (language === "python") {
    const m = code.match(/def\s+([A-Za-z_][\w]*)\s*\(/);
    return m?.[1] ?? null;
  }
  if (language === "rust") {
    const m = code.match(/fn\s+([A-Za-z_][\w]*)\s*\(/);
    return m?.[1] ?? null;
  }
  return null;
}

// Returns true if the user's code actually defines a callable with the given name.
function codeDefinesFunction(
  code: string,
  name: string,
  language: SupportedLanguage,
): boolean {
  const n = escapeRegex(name);
  if (language === "javascript") {
    return new RegExp(`\\b(?:function\\s+${n}\\b|(?:const|let|var)\\s+${n}\\s*=)`).test(code);
  }
  if (language === "python") {
    return new RegExp(`\\bdef\\s+${n}\\s*\\(`).test(code);
  }
  if (language === "rust") {
    return new RegExp(`\\bfn\\s+${n}\\s*\\(`).test(code);
  }
  return false;
}

// Use the AI's suggested name only if the user's code actually defines it;
// otherwise fall back to whatever function is defined in the code. This makes
// the grader survive "Apply Fix" rewrites and user renames.
export function resolveEntry(
  code: string,
  language: SupportedLanguage,
  aiName?: string | null,
): string | null {
  if (aiName && codeDefinesFunction(code, aiName, language)) return aiName;
  return findEntryFunction(code, language);
}

function buildJsHarness(userCode: string, entry: string, cases: TestCase[]): string {
  const casesJson = JSON.stringify(cases);
  // The harness:
  //  1. Re-parses input/output, falling back to the raw string if not JSON.
  //  2. Tries BOTH calling conventions when input is an array:
  //       - spread: fn(...args)  -- AI followed the "[[1,2,3]]" spec
  //       - single: fn(args)     -- AI returned the array directly
  //     Whichever produces a value equal to `expected` wins.
  //  3. Only marks `error` when the function literally cannot be invoked.
  return [
    '"use strict";',
    userCode,
    ";(function () {",
    `  var __cases = ${casesJson};`,
    `  if (typeof ${entry} !== 'function') {`,
    "    for (var __k = 0; __k < __cases.length; __k++) {",
    `      console.log('${SENTINEL}' + JSON.stringify({ i: __k, status: 'error', message: '${entry} is not defined as a function' }));`,
    "    }",
    "    return;",
    "  }",
    "  function __parse(s) { try { return JSON.parse(s); } catch (e) { return s; } }",
    "  function __eq(a, b) { try { return JSON.stringify(a) === JSON.stringify(b); } catch (e) { return false; } }",
    "  for (var __i = 0; __i < __cases.length; __i++) {",
    "    var __tc = __cases[__i];",
    "    try {",
    "      var __args = __parse(__tc.input);",
    "      var __expected = __parse(__tc.output);",
    "      var __strategies = [];",
    "      if (Array.isArray(__args)) {",
    `        __strategies.push(function () { return ${entry}.apply(null, __args); });`,
    `        __strategies.push(function () { return ${entry}(__args); });`,
    "      } else {",
    `        __strategies.push(function () { return ${entry}(__args); });`,
    "      }",
    "      var __firstActual = undefined;",
    "      var __pass = false;",
    "      var __lastErr = null;",
    "      var __anyRan = false;",
    "      for (var __s = 0; __s < __strategies.length; __s++) {",
    "        try {",
    "          var __got = __strategies[__s]();",
    "          __anyRan = true;",
    "          if (__firstActual === undefined) __firstActual = __got;",
    "          if (__eq(__got, __expected)) { __firstActual = __got; __pass = true; break; }",
    "        } catch (e) { __lastErr = e; }",
    "      }",
    "      if (__pass) {",
    `        console.log('${SENTINEL}' + JSON.stringify({ i: __i, status: 'pass', actual: __firstActual, expected: __expected }));`,
    "      } else if (!__anyRan && __lastErr) {",
    `        console.log('${SENTINEL}' + JSON.stringify({ i: __i, status: 'error', message: String(__lastErr && __lastErr.message || __lastErr) }));`,
    "      } else {",
    `        console.log('${SENTINEL}' + JSON.stringify({ i: __i, status: 'fail', actual: __firstActual === undefined ? null : __firstActual, expected: __expected }));`,
    "      }",
    "    } catch (e) {",
    `      console.log('${SENTINEL}' + JSON.stringify({ i: __i, status: 'error', message: String(e && e.message || e) }));`,
    "    }",
    "  }",
    "})();",
  ].join("\n");
}

function buildPythonHarness(userCode: string, entry: string, cases: TestCase[]): string {
  // JSON is a valid Python literal for our test-case shape (strings only at top level).
  const casesLiteral = JSON.stringify(cases);
  return [
    "import json",
    "",
    userCode,
    "",
    `__cases = ${casesLiteral}`,
    "",
    "def __parse(s):",
    "    try:",
    "        return json.loads(s)",
    "    except Exception:",
    "        return s",
    "",
    "def __eq(a, b):",
    "    try:",
    "        return a == b",
    "    except Exception:",
    "        return False",
    "",
    `__fn = globals().get('${entry}')`,
    "if not callable(__fn):",
    "    for __k in range(len(__cases)):",
    `        print('${SENTINEL}' + json.dumps({'i': __k, 'status': 'error', 'message': '${entry} is not defined as a function'}))`,
    "else:",
    "    for __i, __tc in enumerate(__cases):",
    "        try:",
    "            __args = __parse(__tc['input'])",
    "            __expected = __parse(__tc['output'])",
    "            __strategies = []",
    "            if isinstance(__args, list):",
    "                __strategies.append(('spread', lambda a=__args: __fn(*a)))",
    "                __strategies.append(('single', lambda a=__args: __fn(a)))",
    "            else:",
    "                __strategies.append(('single', lambda a=__args: __fn(a)))",
    "            __first_actual = None",
    "            __pass = False",
    "            __any_ran = False",
    "            __last_err = None",
    "            for __label, __call in __strategies:",
    "                try:",
    "                    __got = __call()",
    "                    __any_ran = True",
    "                    if __first_actual is None:",
    "                        __first_actual = __got",
    "                    if __eq(__got, __expected):",
    "                        __first_actual = __got",
    "                        __pass = True",
    "                        break",
    "                except Exception as __e:",
    "                    __last_err = __e",
    "            if __pass:",
    `                print('${SENTINEL}' + json.dumps({'i': __i, 'status': 'pass', 'actual': __first_actual, 'expected': __expected}, default=str))`,
    "            elif not __any_ran and __last_err is not None:",
    `                print('${SENTINEL}' + json.dumps({'i': __i, 'status': 'error', 'message': str(__last_err)}))`,
    "            else:",
    `                print('${SENTINEL}' + json.dumps({'i': __i, 'status': 'fail', 'actual': __first_actual, 'expected': __expected}, default=str))`,
    "        except Exception as __e:",
    `            print('${SENTINEL}' + json.dumps({'i': __i, 'status': 'error', 'message': str(__e)}))`,
  ].join("\n");
}

export async function runTestCases(
  userCode: string,
  language: SupportedLanguage,
  entry: string | null,
  cases: TestCase[],
): Promise<TestResult[]> {
  if (cases.length === 0) return [];

  if (!entry) {
    return cases.map((_, i) => ({
      i,
      status: "error" as const,
      message: "Could not detect a function to test. Make sure you have a named function in your code.",
    }));
  }

  // Rust grading requires a much more involved harness (serde, parsing arguments,
  // typed return values). For now we surface a clear "skipped" status per case.
  if (language === "rust") {
    return cases.map((_, i) => ({
      i,
      status: "skipped" as const,
      message: "Rust grading is not supported yet.",
    }));
  }

  const wrapped =
    language === "javascript"
      ? buildJsHarness(userCode, entry, cases)
      : buildPythonHarness(userCode, entry, cases);

  const raw = await executeCode(wrapped, language);

  const results: TestResult[] = [];
  const seen = new Set<number>();

  for (const line of raw.split("\n")) {
    const idx = line.indexOf(SENTINEL);
    if (idx === -1) continue;
    const payload = line.slice(idx + SENTINEL.length).trim();
    try {
      const parsed = JSON.parse(payload) as TestResult;
      if (parsed && typeof parsed.i === "number" && !seen.has(parsed.i)) {
        seen.add(parsed.i);
        results.push(parsed);
      }
    } catch {
      // Ignore non-JSON sentinel lines.
    }
  }

  // Any case that never reported a result (e.g. runtime crash before reaching it)
  // is reported as an error so the UI never shows blanks.
  for (let i = 0; i < cases.length; i++) {
    if (!seen.has(i)) {
      results.push({
        i,
        status: "error",
        message: "No result reported (possible runtime error before this case ran).",
      });
    }
  }

  return results.sort((a, b) => a.i - b.i);
}

export function summarizeResults(results: TestResult[] | undefined): {
  passed: number;
  total: number;
  failed: number;
  errored: number;
  skipped: number;
} {
  if (!results || results.length === 0) {
    return { passed: 0, total: 0, failed: 0, errored: 0, skipped: 0 };
  }
  let passed = 0;
  let failed = 0;
  let errored = 0;
  let skipped = 0;
  for (const r of results) {
    if (r.status === "pass") passed++;
    else if (r.status === "fail") failed++;
    else if (r.status === "error") errored++;
    else if (r.status === "skipped") skipped++;
  }
  return { passed, total: results.length, failed, errored, skipped };
}
