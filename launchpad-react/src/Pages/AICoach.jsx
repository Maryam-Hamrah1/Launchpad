import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../components/AuthContext";
import { GoalContext } from "../components/GoalContext";
import { supabase } from "../supabaseClient";

const WORKER_URL = "https://launchpad-worker.maryam-ai.workers.dev";

const SUGGESTED_PROMPTS = [
  "What should I focus on this week?",
  "Am I on track with my goals?",
  "Give me a study tip for today",
  "How do I stay consistent?",
];

function buildGoalsContext(goals) {
  const active = goals.filter((g) => g.status === "active");

  if (active.length === 0) return "";

  return active
    .map((g) => {
      const monthInfo = g.roadmap
        ? `currently on Month ${
            g.roadmap.months.find((m) => m.status === "current")?.index || "?"
          } of ${g.roadmap.months.length}`
        : "roadmap not generated yet";

      return `- "${g.title}" (${g.category}), ${g.timeline} timeline, ${
        g.progress || 0
      }% progress, ${monthInfo}`;
    })
    .join("\n");
}

function Avatar({ role, initial }) {
  const isUser = role === "user";
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
      style={{
        background: isUser
          ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"
          : "linear-gradient(135deg, var(--color-accent), var(--color-bg-elev2))",
        color: isUser ? "#111" : "var(--color-ink)",
      }}
    >
      {isUser ? initial : "🤖"}
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2">
      <Avatar role="assistant" />
      <div
        className="rounded-2xl rounded-bl-md px-4 py-3.5 flex gap-1.5 items-center"
        style={{ background: "var(--color-bg-elev2)", border: "1px solid var(--color-line)" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full typing-dot"
            style={{ background: "var(--color-ink-dim)", animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AICoach() {
  const { user } = useContext(AuthContext);
  const { goals } = useContext(GoalContext);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const initial = (user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase();

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function loadHistory() {
    setLoadingHistory(true);

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (!error) {
      setMessages(data);
    }

    setLoadingHistory(false);
  }

  async function sendMessage(text) {
    if (!text || sending) return;

    setInput("");
    setSending(true);

    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      content: text,
    });

    try {
      const res = await fetch(`${WORKER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          goalsContext: buildGoalsContext(goals),
        }),
      });

      const { reply } = await res.json();

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      await supabase.from("chat_messages").insert({
        user_id: user.id,
        role: "assistant",
        content: reply,
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Try again." },
      ]);
    }

    setSending(false);
  }

  function handleSend(e) {
    e.preventDefault();
    sendMessage(input.trim());
  }

  return (
    <div className="w-full space-y-6">
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: .5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        .typing-dot { animation: typingBounce 1.2s infinite; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-in { animation: fadeSlideUp .25s ease; }
      `}</style>

      {/* HERO */}
      <section
        className="rounded-2xl p-4 flex items-center gap-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,138,61,.12), rgba(110,168,254,.08), var(--color-bg-elev))",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
          }}
        >
          🤖
        </div>

        <div>
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs mb-1"
            style={{ background: "rgba(255,138,61,.12)", color: "var(--color-primary)" }}
          >
            AI COACH
          </span>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Your AI Guide For Every Step 🚀
          </h1>
        </div>
      </section>

      {/* CHAT BOX */}
      <div
        className="rounded-3xl p-4 flex flex-col gap-4 min-h-[460px] max-h-[640px]"
        style={{
          background: "var(--color-bg-elev)",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex-1 overflow-y-auto space-y-4 px-1">
          {loadingHistory ? (
            <p className="text-sm text-center mt-20" style={{ color: "var(--color-ink-dim)" }}>
              Loading...
            </p>
          ) : messages.length === 0 ? (
            <div className="text-center mt-10 px-4">
              <div className="text-4xl mb-3">✨</div>
              <p className="text-sm mb-6" style={{ color: "var(--color-ink-dim)" }}>
                Ask about your goals, roadmap, or next career step.
              </p>

              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="text-xs rounded-full px-4 py-2 transition hover:brightness-110"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-line)",
                      color: "var(--color-ink-dim)",
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`msg-in flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && <Avatar role="assistant" />}
                  <div
                    className={`max-w-[75%] px-4 py-3 text-sm leading-7 ${
                      isUser ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md"
                    }`}
                    style={
                      isUser
                        ? {
                            background:
                              "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
                            color: "#111",
                          }
                        : {
                            background: "var(--color-bg-elev2)",
                            border: "1px solid var(--color-line)",
                            color: "var(--color-ink)",
                          }
                    }
                  >
                    {m.content}
                  </div>
                  {isUser && <Avatar role="user" initial={initial} />}
                </div>
              );
            })
          )}

          {sending && <div className="msg-in"><TypingBubble /></div>}

          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-3 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI coach..."
            className="flex-1 rounded-full px-5 py-3 text-sm outline-none transition-colors"
            style={{
              background: "var(--color-bg)",
              color: "var(--color-ink)",
              border: "1px solid var(--color-line)",
            }}
          />

          <button
            type="submit"
            disabled={sending || !input.trim()}
            aria-label="Send message"
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
              color: "#111",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12L20 4L14 20L11 13L4 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="currentColor"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}