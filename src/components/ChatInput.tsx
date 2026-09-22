import React, { useRef, useEffect } from "react";
import { Send, Sparkles, Terminal } from "lucide-react";
import { QuickPrompt } from "../types";

interface ChatInputProps {
  input: string;
  onChange: (val: string) => void;
  onSend: (text?: string) => void;
  isLoading: boolean;
  showSuggestions: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onChange,
  onSend,
  isLoading,
  showSuggestions,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const samplePrompts: QuickPrompt[] = [
    {
      category: "Roman Urdu",
      label: "AI Guide in Urdu",
      query: "Muja Artificial Intelligence k baray mein aasan Roman Urdu mein samjhao",
    },
    {
      category: "Coding",
      label: "Build Fast API",
      query: "Write a complete Express and TypeScript REST API with error handling",
    },
    {
      category: "Science",
      label: "Black Holes Physics",
      query: "Explain what happens at the event horizon of a black hole in simple physics",
    },
    {
      category: "Logic",
      label: "Business Strategy",
      query: "How can I build and launch an AI-powered SaaS product from scratch?",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      {/* Suggestion Prompts */}
      {showSuggestions && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-zinc-500 mb-2">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>TRY ASKING VEXO AI:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onSend(p.query)}
                className="text-left p-2.5 rounded-xl bg-zinc-950/80 hover:bg-emerald-950/40 border border-zinc-800 hover:border-emerald-500/50 text-xs transition-all group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-space font-semibold text-emerald-400 group-hover:text-emerald-300">
                    {p.label}
                  </span>
                  <span className="text-[10px] font-mono-code text-zinc-500 group-hover:text-emerald-400">
                    [{p.category}]
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 truncate">
                  {p.query}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Box */}
      <div className="relative rounded-2xl bg-zinc-950 border border-emerald-900/60 focus-within:border-emerald-500/80 focus-within:glow-green-sm transition-all shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask VEXO AI anything... (English, Roman Urdu, coding, math, science, advice)"
          disabled={isLoading}
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm px-4 pt-3.5 pb-12 outline-none resize-none font-sans leading-relaxed"
        />

        {/* Bottom controls bar */}
        <div className="absolute bottom-2.5 left-4 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 text-[10px] font-mono-code text-zinc-500 pointer-events-auto">
            <span>SHIFT + ENTER FOR NEWLINE</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => onSend()}
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
              title="Send to VEXO AI"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-2 text-[11px] font-mono-code text-zinc-600">
        VEXO AI &bull; Quantum Cognitive Matrix &bull; Answers Every Question
      </div>
    </div>
  );
};
