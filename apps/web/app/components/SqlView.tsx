import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css"; // fallback

// or any other theme
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import { useContext, useEffect, useRef } from "react";

import { ThemeContext } from "@/app/contexts/Theme";

hljs.registerLanguage("sql", sql);

type Props = {
  code: string;
};

const HighlightedSQL = ({ code }: Props) => {
  const codeRef = useRef<HTMLElement>(null);
  const { mode } = useContext(ThemeContext);

  useEffect(() => {
    if (codeRef.current) {
      // Remove existing Highlight.js classes
      codeRef.current.className = "sql";
      hljs.highlightElement(codeRef.current);
    }
  }, [code, mode]); // Re-run when theme changes

  return (
    <pre
      style={{
        backgroundColor: "transparent", // match GitHub themes
        color: mode === "dark" ? "#c9d1d9" : "#24292f",
      }}
    >
      <code ref={codeRef} className="sql">
        {code}
      </code>
    </pre>
  );
};

export default HighlightedSQL;
