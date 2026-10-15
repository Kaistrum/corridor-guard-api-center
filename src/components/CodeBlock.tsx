import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn, useTheme } from "@kaistrum/stratum-ui";
import { CheckIcon, CopyIcon } from "./icons";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);

// Code displays render in Consolas, falling back to other monospaces.
const CODE_FONT = 'Consolas, "Cascadia Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

interface CodeBlockProps {
  code: string;
  /** Display label; also selects the highlighter grammar when it maps to one. */
  language?: string;
  className?: string;
}

// Map a human label to a registered Prism grammar (fall back to plain text).
const GRAMMAR: Record<string, string> = {
  python: "python",
  bash: "bash",
  shell: "bash",
  json: "json",
};

function grammarFor(label?: string): string {
  if (!label) return "text";
  return GRAMMAR[label.toLowerCase()] ?? "text";
}

/** Monospace code panel: header label, copy button, syntax highlighting. */
export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={cn(
        "code-display overflow-hidden rounded-radius-lg border border-border bg-bg-surface",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {language ?? "code"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-radius-md px-2 py-1 text-xs text-text-dim transition-colors hover:bg-bg-card hover:text-text"
        >
          {copied ? (
            <>
              <CheckIcon width={14} height={14} className="text-success" />
              Copied
            </>
          ) : (
            <>
              <CopyIcon width={14} height={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={grammarFor(language)}
        style={theme === "light" ? oneLight : oneDark}
        customStyle={{
          margin: 0,
          padding: "14px 16px",
          background: "transparent",
          fontSize: "0.8125rem",
          lineHeight: 1.6,
          overflowX: "auto",
          fontFamily: CODE_FONT,
        }}
        codeTagProps={{
          style: {
            fontFamily: CODE_FONT,
            background: "transparent",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
