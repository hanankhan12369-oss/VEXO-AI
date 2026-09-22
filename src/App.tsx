import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, ChatSession } from "./types";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ChatMessageItem } from "./components/ChatMessageItem";
import { ChatInput } from "./components/ChatInput";
import { Sparkles, Terminal, Code2, Calculator, BookOpen, MessageSquare, Bot } from "lucide-react";

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vexo_ai_sessions");
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to read localStorage:", e);
    }

    // Default first session if none exists
    const initialSession: ChatSession = {
      id: `sess-${Date.now()}`,
      title: "New VEXO Session",
      createdAt: Date.now(),
      messages: [
        {
          id: "welcome-msg",
          role: "model",
          text: "Welcome to **VEXO AI**. I am an omniscient intelligent chatbot primed to answer **every question** you have with speed, depth, and clarity.\n\nAsk me about **Coding, Science, Math, Business, Creative Writing**, or speak to me in **Roman Urdu** (*'kuch bhi poochein, main jawab doon ga'*). How can I assist you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setSessions([initialSession]);
    setActiveSessionId(initialSession.id);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem("vexo_ai_sessions", JSON.stringify(sessions));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }
    }
  }, [sessions]);

  // Current active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Create new session
  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `sess-${Date.now()}`,
      title: "New Conversation",
      createdAt: Date.now(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: "model",
          text: "Systems active. **VEXO AI** is ready. What would you like to explore or solve?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  // Delete session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    if (updated.length === 0) {
      handleNewSession();
    } else {
      setSessions(updated);
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
      }
    }
  };

  // Clear current messages
  const handleClearChat = () => {
    if (!activeSessionId) return;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [],
          };
        }
        return s;
      })
    );
  };

  // Export current chat
  const handleExportChat = () => {
    if (!activeSession) return;
    const exportText = activeSession.messages
      .map((m) => `### ${m.role === "user" ? "USER" : "VEXO AI"} (${m.timestamp})\n\n${m.text}\n`)
      .join("\n---\n\n");

    const blob = new Blob([exportText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vexo-ai-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : input).trim();
    if (!query || isLoading || !activeSessionId) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update active session with user message
    const updatedMessages = [...messages, userMessage];
    const isFirstUserMessage = messages.filter((m) => m.role === "user").length === 0;

    // Generate title from first message
    const updatedTitle = isFirstUserMessage
      ? query.slice(0, 30) + (query.length > 30 ? "..." : "")
      : activeSession.title;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: updatedTitle,
            messages: updatedMessages,
          };
        }
        return s;
      })
    );

    setInput("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || data.fallbackReply || "VEXO AI has processed your query.";

      const modelMessage: ChatMessage = {
        id: `vexo-${Date.now()}`,
        role: "model",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, modelMessage],
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      console.error("VEXO AI Request Error:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "I encountered a momentary connection disturbance. Please retry your query or check your connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, errorMsg],
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-zinc-100 font-sans matrix-grid overflow-hidden">
      {/* Sidebar for Sessions */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Header */}
        <Header
          onNewChat={handleNewSession}
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          messageCount={messages.length}
        />

        {/* Chat Stream Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-emerald-500/60 glow-green-md flex items-center justify-center text-emerald-400 font-space font-extrabold text-2xl mb-4">
                  V
                </div>
                <h2 className="font-space font-bold text-xl sm:text-2xl text-emerald-400 glow-green-text mb-2">
                  VEXO AI CHATBOT
                </h2>
                <p className="text-zinc-400 text-sm max-w-md leading-relaxed mb-6">
                  Ready to answer any question across coding, mathematics, science, everyday topics, or Roman Urdu.
                </p>

                {/* Capability Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left">
                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-emerald-950 hover:border-emerald-800/60 transition-all">
                    <Code2 className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-space font-semibold text-xs text-zinc-200">Full Code Synthesis</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Python, TS, SQL, Web</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-emerald-950 hover:border-emerald-800/60 transition-all">
                    <MessageSquare className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-space font-semibold text-xs text-zinc-200">Roman Urdu Fluent</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Asan Urdu Me Jawab</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-emerald-950 hover:border-emerald-800/60 transition-all">
                    <Calculator className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-space font-semibold text-xs text-zinc-200">Complex Math</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Step-by-step logic</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-emerald-950 hover:border-emerald-800/60 transition-all">
                    <BookOpen className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-space font-semibold text-xs text-zinc-200">Universal Q&A</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Science, history & more</div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))
            )}

            {/* Loading / Thinking indicator */}
            {isLoading && (
              <div className="flex gap-3 sm:gap-4 p-4 rounded-2xl bg-zinc-950/80 border border-emerald-500/40 glow-green-sm w-full animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-black border border-emerald-500 flex items-center justify-center text-emerald-400 font-space font-bold text-xs animate-pulse">
                  V
                </div>
                <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>VEXO AI is computing the answer...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <ChatInput
          input={input}
          onChange={setInput}
          onSend={handleSendMessage}
          isLoading={isLoading}
          showSuggestions={messages.length <= 1}
        />
      </div>
    </div>
  );
}
