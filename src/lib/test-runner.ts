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
const REF_SENTINEL = "__CORTEX_REF__";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Looks for `function`-style declarations. Used when the AI's entryFunction hint
// isn't usable. Prefer the LAST top-level declaration so helper-first layouts
// (tokenize → parse → solve) grade correctly instead of blindly picking the first.
export function findEntryFunction(code: string, language: SupportedLanguage): string | null {
  if (language === "javascript") {
    const tops = [...code.matchAll(/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm)];
    if (tops.length > 1) return tops[tops.length - 1]![1]!;
    if (tops.length === 1) return tops[0]![1]!;
    // const fn = (...) => / function (...) / async (...) => / x => / function ...
    const expr = code.match(
      /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/,
    );
    return expr?.[1] ?? null;
  }
  if (language === "python") {
    const tops = [...code.matchAll(/^[ \t]*def\s+([A-Za-z_][\w]*)\s*\(/gm)];
    if (tops.length > 1) return tops[tops.length - 1]![1]!;
    if (tops.length === 1) return tops[0]![1]!;
    return null;
  }
  if (language === "rust") {
    const tops = [...code.matchAll(/^[ \t]*(?:pub\([^)]*\)\s+|pub\s+)?fn\s+([A-Za-z_][\w]*)\s*\(/gm)];
    if (tops.length > 1) return tops[tops.length - 1]![1]!;
    if (tops.length === 1) return tops[0]![1]!;
    return null;
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
  //  2. When input parses to an array:
  //       - length === 1: try BOTH spread fn(...a) and single fn(a) so [[1,2,3]] vs [1,2,3]
  //         style cases both work.
  //       - length !== 1: ONLY spread. Calling fn(args) would pass one value (e.g. fn(["",""]))
  //         and leave later params undefined — wrong and surfaces as str2.length errors.
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
      "        if (__args.length === 1) {",
      `          __strategies.push(function () { return ${entry}(__args); });`,
      "        }",
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
    "                if len(__args) == 1:",
    "                    __strategies.append(('single', lambda a=__args: __fn(a)))",
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

// Mirrors buildJsHarness but instead of *checking* outputs, it captures whatever
// the reference solution returns for each input. Used at task-generation time so
// the AI doesn't have to compute outputs itself (which it gets wrong constantly).
function buildJsReferenceHarness(
  referenceSolution: string,
  entry: string,
  inputs: string[],
): string {
  const inputsJson = JSON.stringify(inputs);
  return [
    '"use strict";',
    referenceSolution,
    ";(function () {",
    `  var __inputs = ${inputsJson};`,
    `  if (typeof ${entry} !== 'function') {`,
    "    for (var __k = 0; __k < __inputs.length; __k++) {",
    `      console.log('${REF_SENTINEL}' + JSON.stringify({ i: __k, ok: false, error: '${entry} is not defined' }));`,
    "    }",
    "    return;",
    "  }",
    "  function __parse(s) { try { return JSON.parse(s); } catch (e) { return s; } }",
    "  for (var __i = 0; __i < __inputs.length; __i++) {",
    "    try {",
    "      var __args = __parse(__inputs[__i]);",
    "      var __got;",
    "      if (Array.isArray(__args)) {",
    "        if (__args.length === 1) {",
    "          try {",
    `            __got = ${entry}.apply(null, __args);`,
    "          } catch (eSpread) {",
    `            __got = ${entry}(__args);`,
    "          }",
    "        } else {",
    `          __got = ${entry}.apply(null, __args);`,
    "        }",
    "      } else {",
    `        __got = ${entry}(__args);`,
    "      }",
    "      var __serialized = JSON.stringify(__got);",
    "      if (typeof __serialized !== 'string') {",
    `        console.log('${REF_SENTINEL}' + JSON.stringify({ i: __i, ok: false, error: 'reference returned a non-serializable value (likely undefined)' }));`,
    "      } else {",
    `        console.log('${REF_SENTINEL}' + JSON.stringify({ i: __i, ok: true, serialized: __serialized }));`,
    "      }",
    "    } catch (e) {",
    `      console.log('${REF_SENTINEL}' + JSON.stringify({ i: __i, ok: false, error: String(e && e.message || e) }));`,
    "    }",
    "  }",
    "})();",
  ].join("\n");
}

function buildPythonReferenceHarness(
  referenceSolution: string,
  entry: string,
  inputs: string[],
): string {
  const inputsLiteral = JSON.stringify(inputs);
  return [
    "import json",
    "",
    referenceSolution,
    "",
    `__inputs = ${inputsLiteral}`,
    "",
    "def __parse(s):",
    "    try:",
    "        return json.loads(s)",
    "    except Exception:",
    "        return s",
    "",
    `__fn = globals().get('${entry}')`,
    "if not callable(__fn):",
    "    for __k in range(len(__inputs)):",
    `        print('${REF_SENTINEL}' + json.dumps({'i': __k, 'ok': False, 'error': '${entry} is not defined'}))`,
    "else:",
    "    for __i, __raw in enumerate(__inputs):",
    "        try:",
    "            __args = __parse(__raw)",
    "            if isinstance(__args, list):",
    "                if len(__args) == 1:",
    "                    try:",
    "                        __got = __fn(*__args)",
    "                    except TypeError:",
    "                        __got = __fn(__args)",
    "                else:",
    "                    __got = __fn(*__args)",
    "            else:",
    "                __got = __fn(__args)",
    "            try:",
    "                __serialized = json.dumps(__got)",
    `                print('${REF_SENTINEL}' + json.dumps({'i': __i, 'ok': True, 'serialized': __serialized}))`,
    "            except Exception as __se:",
    `                print('${REF_SENTINEL}' + json.dumps({'i': __i, 'ok': False, 'error': 'reference returned non-JSON value: ' + str(__se)}))`,
    "        except Exception as __e:",
    `            print('${REF_SENTINEL}' + json.dumps({'i': __i, 'ok': False, 'error': str(__e)}))`,
  ].join("\n");
}

export type DerivedOutput =
  | { ok: true; output: string }
  | { ok: false; error: string };

// Executes `referenceSolution` against each input and returns whatever it
// computes, JSON-encoded as a string. This is the trusted source of expected
// outputs — much more reliable than asking the LLM to do arithmetic in its
// head. Rust isn't supported (same reason grading isn't) — caller should
// handle that case.
export async function deriveExpectedOutputs(
  referenceSolution: string,
  language: SupportedLanguage,
  entry: string,
  inputs: string[],
): Promise<DerivedOutput[]> {
  if (inputs.length === 0) return [];
  if (language === "rust") {
    return inputs.map(() => ({
      ok: false as const,
      error: "Rust reference execution is not supported yet.",
    }));
  }

  const harness =
    language === "javascript"
      ? buildJsReferenceHarness(referenceSolution, entry, inputs)
      : buildPythonReferenceHarness(referenceSolution, entry, inputs);

  const raw = await executeCode(harness, language);

  const out: (DerivedOutput | undefined)[] = new Array(inputs.length).fill(undefined);
  for (const line of raw.split("\n")) {
    const idx = line.indexOf(REF_SENTINEL);
    if (idx === -1) continue;
    const payload = line.slice(idx + REF_SENTINEL.length).trim();
    try {
      const parsed = JSON.parse(payload) as
        | { i: number; ok: true; serialized: string }
        | { i: number; ok: false; error: string };
      if (typeof parsed.i !== "number" || parsed.i < 0 || parsed.i >= inputs.length) continue;
      if (parsed.ok) {
        out[parsed.i] = { ok: true, output: parsed.serialized };
      } else {
        out[parsed.i] = { ok: false, error: String(parsed.error ?? "unknown error") };
      }
    } catch {
      // ignore malformed lines
    }
  }

  return out.map(
    (r) => r ?? { ok: false as const, error: "No output emitted (reference may have crashed)." },
  );
}

export async function runTestCases(
  userCode: string,
  language: SupportedLanguage,
  entry: string | null,
  cases: TestCase[],
): Promise<TestResult[]> {
  if (cases.length === 0) return [];
  if (!entry) {
    return cases.map((_, i) => ({ i, status: "error", message: "No function detected." }));
  }

  // 1. Build a strict, safe wrapper for the user's code
  let harness = "";

  if (language === "javascript") {
    const caseLogs = cases.map((c, i) => {
        return `
        try {
            let args = JSON.parse('${c.input.replace(/'/g, "\\'")}');
            let res;
            // SMART CHECK: If it's an array AND the function expects multiple arguments, spread it.
            // Otherwise, pass it directly as a single array.
            if (Array.isArray(args) && ${entry}.length > 1) {
                res = ${entry}(...args);
            } else {
                res = ${entry}(args);
            }
            console.log('${SENTINEL}${i}___' + JSON.stringify(res));
        } catch(e) {
            console.log('${SENTINEL}${i}___ERROR___' + e.message);
        }`;
    }).join("\n");
    harness = `${userCode}\n\n${caseLogs}`;
  } 
  else if (language === "python") {
     const caseLogs = cases.map((c, i) => {
        return `
try:
    import json
    args = json.loads('${c.input.replace(/'/g, "\\'")}')
    
    if isinstance(args, list):
        try:
            # Attempt 1: Try unpacking as multiple arguments
            res = ${entry}(*args)
        except TypeError as e:
            # Attempt 2: If Python complains about positional arguments, pass as a single list
            if "positional argument" in str(e):
                res = ${entry}(args)
            else:
                raise e
    else:
        res = ${entry}(args)
        
    print(f'${SENTINEL}${i}___{json.dumps(res)}')
except Exception as e:
    print(f'${SENTINEL}${i}___ERROR___{str(e)}')`;
    }).join("\n");
    harness = `${userCode}\n\n${caseLogs}`;
  }
  else if (language === "rust") {
     return cases.map((_, i) => ({ i, status: "skipped", message: "Rust auto-grading is complex. Manual testing required." }));
  }

  // 2. Execute the user's code + harness
  const rawOutput = await executeCode(harness, language);

  // 3. Parse the results
  const results: TestResult[] = [];
  const lines = rawOutput.split("\n");

  const normalizeOutput = (str: string) => {
    try {
        // If it's valid JSON, parsing and stringifying perfectly synchronizes spacing
        return JSON.stringify(JSON.parse(str));
    } catch {
        // Fallback: Strip ALL whitespace and swap single quotes for double quotes
        return str.replace(/\s+/g, '').replace(/'/g, '"');
    }
  };

  for (const line of lines) {
    if (!line.includes(SENTINEL)) continue;
    
    const cleanLine = line.substring(line.indexOf(SENTINEL) + SENTINEL.length);
    const [indexStr, ...rest] = cleanLine.split("___");
    const i = parseInt(indexStr);
    const actualRaw = rest.join("___").trim();

    if (isNaN(i) || i < 0 || i >= cases.length) continue;

    if (actualRaw.startsWith("ERROR___")) {
        results.push({ i, status: "error", message: actualRaw.replace("ERROR___", "") });
        continue;
    }

    const expectedRaw = cases[i].output;
    
    // ✨ NEW: Compare the normalized versions, not the raw strings!
    if (normalizeOutput(actualRaw) === normalizeOutput(expectedRaw)) {
        results.push({ i, status: "pass", actual: actualRaw, expected: expectedRaw });
    } else {
        results.push({ i, status: "fail", actual: actualRaw, expected: expectedRaw });
    }
}

  // Fill in any missing cases (crashes)
  const processedIndices = new Set(results.map(r => r.i));
  for (let i = 0; i < cases.length; i++) {
      if (!processedIndices.has(i)) {
           results.push({ i, status: "error", message: "Execution stopped before this test." });
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
