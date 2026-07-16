import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";

// A goal is "completed" once every month in its roadmap is completed.
// Otherwise, an "active" goal is still in progress.
function getEffectiveStatus(goal) {
  if (goal.status === "draft") return "draft";
  if (goal.roadmap && goal.roadmap.months.every((m) => m.status === "completed")) return "completed";
  return "in-progress";
}

const TABS = [
  { key: "all", label: "All" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "draft", label: "Drafts" },
];

function GoalCard({ goal, effectiveStatus, onClick }) {
  const badge =
    effectiveStatus === "completed"
      ? { text: "COMPLETED", color: "#5EEAD4" }
      : effectiveStatus === "draft"
      ? { text: "DRAFT", color: "#9AA5BD" }
      : { text: "IN PROGRESS", color: "#F5B342" };

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-2xl border border-white/10 bg-[#141D33] p-6 hover:border-white/20 transition-colors"
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div>
          <span className="font-mono text-xs text-[#9AA5BD]">{goal.category || "Uncategorized"}</span>
          <h3 className="font-semibold text-lg mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {goal.title || "Untitled goal"}
          </h3>
        </div>
        <span
          className="font-mono text-[10px] rounded-full px-2.5 py-1 flex-shrink-0"
          style={{ border: `1px solid ${badge.color}`, color: badge.color }}
        >
          {badge.text}
        </span>
      </div>

      <div className="mb-1 flex justify-between text-xs text-[#9AA5BD]">
        <span>Progress</span>
        <span>{goal.progress || 0}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#1B2540] overflow-hidden mb-4">
        <div
          className="h-full rounded-full"
          style={{ width: `${goal.progress || 0}%`, background: "linear-gradient(90deg,#F5B342,#5EEAD4)" }}
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
        <div>
          <span className="block text-[#9AA5BD] mb-0.5">Timeline</span>
          <span>{goal.timeline || "—"}</span>
        </div>
        <div>
          <span className="block text-[#9AA5BD] mb-0.5">Priority</span>
          <span>{goal.priority || "—"}</span>
        </div>
      </div>
    </button>
  );
}

export default function Goals() {
  const { goals, loading } = useContext(GoalContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E1526] text-[#9AA5BD]">
        Loading...
      </div>
    );
  }

  const goalsWithStatus = goals.map((g) => ({ goal: g, effectiveStatus: getEffectiveStatus(g) }));
  const filtered =
    activeTab === "all" ? goalsWithStatus : goalsWithStatus.filter((g) => g.effectiveStatus === activeTab);

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="inline-block font-mono text-xs rounded-full px-3 py-1.5 mb-3 border border-white/20 text-[#F5B342]">
            YOUR GOALS
          </span>
          <h1 className="font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            All Goals
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
              style={
                activeTab === tab.key
                  ? { background: "#F5B342", color: "#1A1305" }
                  : { border: "1px solid rgba(255,255,255,0.15)", color: "#9AA5BD" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-[#9AA5BD]">No goals in this category yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(({ goal, effectiveStatus }) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                effectiveStatus={effectiveStatus}
                onClick={() => navigate(`/goals/${goal.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}