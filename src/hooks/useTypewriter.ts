import { useEffect, useRef, useState } from "react";

export function useTypewriter(text: string, speedMs: number = 20) {
    const [out, setOut] = useState("");
  const outRef = useRef(out);

  useEffect(() => {
    outRef.current = out;
  }, [out]);

  useEffect(() => {
    if (!text) {
      setOut("");
      return;
    }

    const currentOut = outRef.current;
    const shouldContinue = currentOut.length > 0 && text.startsWith(currentOut);

    if (!shouldContinue && currentOut.length > 0) {
      setOut("");
      outRef.current = "";
    }

    let i = shouldContinue ? currentOut.length : 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speedMs);

    return () => window.clearInterval(id);
  }, [text, speedMs]);

  return out;
}
