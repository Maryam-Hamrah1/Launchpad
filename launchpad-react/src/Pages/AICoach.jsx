import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../components/AuthContext";
import { GoalContext } from "../components/GoalContext";
import { supabase } from "../supabaseClient";

const WORKER_URL = "https://launchpad-worker.maryam-ai.workers.dev";

function buildGoalsContext(goals) {
  const active = goals.filter((g) => g.status === "active");
  if (active.length === 0) return "";

  return active
    .map((g) => {
      const monthInfo = g.roadmap
        ? `currently on Month ${g.roadmap.months.find((m) => m.status === "current")?.index || "?"} of ${g.roadmap.months.length}`
        : "roadmap not generated yet";
      return `- "${g.title}" (${g.category}), ${g.timeline} timeline, ${g.progress || 0}% progress, ${monthInfo}`;
    })
    .join("\n");
}

export default function AICoach() {
  const { user } = useContext(AuthContext);
  const { goals } = useContext(GoalContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    loadHistory();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadHistory() {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load chat history:", error.message);
    } else {
      setMessages(data);
    }
    setLoadingHistory(false);
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);

    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    await supabase.from("chat_messages").insert({ user_id: user.id, role: "user", content: text });

    try {
      const res = await fetch(`${WORKER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          goalsContext: buildGoalsContext(goals),
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const { reply } = await res.json();

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      await supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: reply });
    } catch (err) {
      console.error("Chat failed:", err.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Try again in a moment." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1526] text-[#EDEFF6]">
      <div className="max-w-2xl w-full mx-auto flex flex-col flex-1 px-5 py-8">
        <div className="mb-6">
          <span className="inline-block font-mono text-xs rounded-full px-3 py-1.5 mb-3 border border-white/20 text-[#F5B342]">
            🤖 AI COACH
          </span>
          <h1 className="font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Talk it through
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#141D33] p-5 mb-4 flex flex-col gap-4 min-h-[400px]">
          {loadingHistory ? (
            <p className="text-sm text-[#9AA5BD] text-center my-auto">Loading...</p>
            ) : messages.length === 0 ? (
            <p className="text-sm text-[#9AA5BD] text-center my-auto">
              Ask about your goals, get unstuck, or just say how you're feeling today.
            </p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
                  style={
                    m.role === "user"
                      ? { background: "#F5B342", color: "#1A1305" }
                      : { background: "#1B2540", color: "#EDEFF6", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2.5 text-sm" style={{ background: "#1B2540", color: "#9AA5BD" }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full px-4 py-3 text-sm bg-[#1B2540] text-[#EDEFF6] placeholder-[#9AA5BD] border border-white/10 focus:outline-none focus:border-[#F5B342] transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-full px-6 py-3 text-sm font-semibold bg-[#F5B342] text-[#1A1305] hover:brightness-110 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}