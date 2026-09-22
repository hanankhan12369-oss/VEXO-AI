import React from "react";
import { Bot, Plus, Trash2, Download, Terminal, Sparkles, Menu } from "lucide-react";

interface HeaderProps {
  onNewChat: () => void;
  onClearChat: () => void;
  onExportChat: () => void;
  onToggleSidebar: () => void;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewChat,
  onClearChat,
  onExportChat,
  onToggleSidebar,
  messageCount,
}) => {
  return (
    <header className="w-full bg-black/90 border-b border-emerald-950/80 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-lg bg-zinc-900 border border-emerald-900/40 text-emerald-400 hover:text-emerald-300"
          title="Toggle Chat History"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-950 border border-emerald-500/50 glow-green-sm group">
          <span className="font-space font-extrabold text-sm text-emerald-400 group-hover:scale-110 transition-transform">
            V
          </span>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-black animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-space font-bold text-base sm:text-lg tracking-wider text-emerald-400 glow-green-text">
              VEXO AI
            </h1>
            <span className="text-[10px] font-mono-code font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              CORE v3.5
            </span>
          </div>
          <p className="text-[10px] font-mono-code text-zinc-400 hidden sm:block">
            UNIVERSAL INTELLIGENCE &bull; ANSWERS EVERY QUESTION
          </p>
        </div>
      </div>

      {/* Center Status indicator */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-xs font-mono-code text-emerald-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>NEURAL STATUS: READY</span>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-space font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
          title="Start a new chat session"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {messageCount > 0 && (
          <>
            <button
              onClick={onExportChat}
              className="p-2 rounded-xl bg-zinc-900/90 border border-emerald-900/40 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400 transition-colors"
              title="Export conversation"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClearChat}
              className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-rose-900/60 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Clear current messages"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
