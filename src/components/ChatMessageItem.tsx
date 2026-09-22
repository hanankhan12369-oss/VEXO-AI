import React, { useState } from "react";
import { ChatMessage } from "../types";
import { Copy, Check, ThumbsUp, ThumbsDown, Bot, User, Code } from "lucide-react";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const isUser = message.role === "user";

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format text and detect code fences (```lang ... ```)
  const renderFormattedContent = (content: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: content.substring(lastIndex, match.index),
        });
      }

      // Code block
      parts.push({
        type: "code",
        lang: match[1] || "code",
        code: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: "text",
        content: content.substring(lastIndex),
      });
    }

    return (
      <div className="space-y-3">
        {parts.map((part, idx) => {
          if (part.type === "code") {
            return <CodeBlock key={idx} lang={part.lang!} code={part.code!} />;
          }

          // Render formatted text with paragraphs, bullet points, and inline bold
          return (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed text-zinc-200">
              {renderInlineMarkdown(part.content || "")}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex gap-3 sm:gap-4 p-4 rounded-2xl transition-all ${
        isUser
          ? "bg-zinc-900/60 border border-zinc-800 ml-auto max-w-[88%] sm:max-w-[78%]"
          : "bg-zinc-950/80 border border-emerald-900/40 glow-green-sm w-full"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-black border border-emerald-500/60 flex items-center justify-center text-emerald-400 font-space font-bold text-xs glow-green-sm">
            V
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-white/5 pb-1">
          <div className="flex items-center gap-2">
            <span
              className={`font-space font-bold text-xs tracking-wider uppercase ${
                isUser ? "text-zinc-400" : "text-emerald-400"
              }`}
            >
              {isUser ? "YOU" : "VEXO AI"}
            </span>
            {!isUser && (
              <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                AI ENGINE
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono-code text-zinc-500">
            {message.timestamp}
          </span>
        </div>

        {/* Content */}
        <div className="text-sm">
          {renderFormattedContent(message.text)}
        </div>

        {/* Action bar for model responses */}
        {!isUser && (
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-emerald-950/50 text-xs text-zinc-400">
            <span className="text-[10px] font-mono-code text-emerald-500/60">
              VEXO KNOWLEDGE MATRIX
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCopy(message.text)}
                title="Copy response"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setLiked(liked === true ? null : true)}
                title="Helpful response"
                className={`p-1.5 rounded-lg border transition-colors ${
                  liked === true
                    ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400"
                    : "bg-zinc-900 border-zinc-800 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400"
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
              </button>

              <button
                onClick={() => setLiked(liked === false ? null : false)}
                title="Not helpful"
                className={`p-1.5 rounded-lg border transition-colors ${
                  liked === false
                    ? "bg-rose-950/60 border-rose-500/60 text-rose-400"
                    : "bg-zinc-900 border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400"
                }`}
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponent for Code Block with Language & Copy Code button
const CodeBlock: React.FC<{ lang: string; code: string }> = ({ lang, code }) => {
  const [codeCopied, setCodeCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-emerald-900/60 bg-[#050806] shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      {/* Code header bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-black border-b border-emerald-950 text-xs font-mono-code">
        <div className="flex items-center gap-2 text-emerald-400">
          <Code className="w-3.5 h-3.5" />
          <span className="uppercase text-[11px] font-semibold tracking-wider">
            {lang || "CODE"}
          </span>
        </div>

        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-zinc-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-colors"
        >
          {codeCopied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono-code text-emerald-300/90 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Simple inline markdown parsing for bold, headings, inline code
function renderInlineMarkdown(text: string): React.ReactNode {
  // Check if string contains headers or bolding
  const lines = text.split("\n");
  return lines.map((line, lIdx) => {
    // Heading 3
    if (line.startsWith("### ")) {
      return (
        <h4 key={lIdx} className="font-space font-bold text-emerald-400 text-sm mt-3 mb-1">
          {line.replace("### ", "")}
        </h4>
      );
    }
    // Heading 2
    if (line.startsWith("## ")) {
      return (
        <h3 key={lIdx} className="font-space font-bold text-emerald-300 text-base mt-4 mb-2 border-b border-emerald-950 pb-1">
          {line.replace("## ", "")}
        </h3>
      );
    }
    // Bullet point
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      return (
        <div key={lIdx} className="flex items-start gap-2 my-1 pl-2">
          <span className="text-emerald-400 font-bold">&bull;</span>
          <span>{parseInlineStyles(line.trim().substring(2))}</span>
        </div>
      );
    }
    // Numbered list (e.g. "1. ")
    if (/^\d+\.\s/.test(line.trim())) {
      const match = line.trim().match(/^(\d+\.)\s(.*)/);
      if (match) {
        return (
          <div key={lIdx} className="flex items-start gap-2 my-1 pl-2">
            <span className="text-emerald-400 font-mono-code text-xs font-semibold">{match[1]}</span>
            <span>{parseInlineStyles(match[2])}</span>
          </div>
        );
      }
    }

    return (
      <div key={lIdx} className={line.trim() === "" ? "h-2" : "my-0.5"}>
        {parseInlineStyles(line)}
      </div>
    );
  });
}

function parseInlineStyles(str: string): React.ReactNode {
  // Parse inline bold **text** and inline code `code`
  const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-emerald-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-mono-code text-xs"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
