import React from "react";
import { ChatSession } from "../types";
import { Plus, MessageSquare, Trash2, X, Terminal, Code, Cpu, Globe, HelpCircle } from "lucide-react";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-50 w-72 bg-zinc-950/95 border-r border-emerald-950/80 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-emerald-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-space font-bold text-xs uppercase tracking-wider text-emerald-400">
              VEXO CONVERSATIONS
            </span>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-space text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>New VEXO Session</span>
          </button>
        </div>

        {/* Saved Sessions list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono-code text-zinc-500 uppercase tracking-wider">
            Recent Sessions ({sessions.length})
          </div>

          {sessions.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-zinc-500 font-mono-code">
              No previous chat history.
            </div>
          ) : (
            sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              return (
                <div
                  key={sess.id}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                      : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-transparent"
                  }`}
                  onClick={() => {
                    onSelectSession(sess.id);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate flex-1 mr-2">
                    <MessageSquare
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isActive ? "text-emerald-400" : "text-zinc-600"
                      }`}
                    />
                    <span className="truncate">{sess.title || "Untitled Session"}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(sess.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition-opacity"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Capabilities Information */}
        <div className="p-3.5 border-t border-emerald-950/80 bg-black/60 space-y-2 text-[11px]">
          <div className="font-space font-semibold text-emerald-400/90 text-xs flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>VEXO CAPABILITIES</span>
          </div>

          <div className="space-y-1.5 text-zinc-400 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Answers every single question</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Fluent in Roman Urdu & English</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Coding, Math & Debugging Expert</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
