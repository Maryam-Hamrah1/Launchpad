import { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";
function WeekNode({ week, goalId, monthIndex, onLockedClick }) {
  const isLocked = week.status === "locked";
  const isCurrent = week.status === "current";
  const isDone = week.status === "completed";

  const style = isDone
    ? {
        border: "1px solid #5EEAD4",
        color: "#5EEAD4",
        background: "rgba(94,234,212,0.08)",
      }
    : isCurrent
      ? {
          border: "1px solid #F5B342",
          color: "#F5B342",
          background: "rgba(245,179,66,0.1)",
        }
      : { border: "1px solid rgba(255,255,255,0.1)", color: "#9AA5BD" };

  const content = (
    <div className="rounded-2xl px-5 py-4" style={style}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[11px]">Week {week.index}</span>
        <span>{isDone ? "✅" : isCurrent ? "🟡" : "🔒"}</span>
      </div>
      <span className="text-sm">{week.title}</span>
    </div>
  );

  if (isLocked) {
    return (
      <button
        type="button"
        onClick={onLockedClick}
        className="text-left w-full"
      >
        {content}
      </button>
    );
  }

  return (
    <Link to={`/goals/${goalId}/month/${monthIndex}/week/${week.index}`}>
      {content}
    </Link>
  );
}

export default function MonthDetails() {
  const { goalId, monthIndex } = useParams();
  const { goals, loading, generateMonthDetail } = useContext(GoalContext);
  const [generating, setGenerating] = useState(false);
  const [lockedMessage, setLockedMessage] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E1526] text-[#9AA5BD]">
        Loading...
      </div>
    );
  }

  const goal = goals.find((g) => String(g.id) === goalId);

  if (!goal || !goal.roadmap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0E1526] text-[#EDEFF6] px-6 text-center">
        <p className="text-[#9AA5BD]">This month doesn't exist.</p>
        <Link
          to={`/goals/${goalId}`}
          className="text-sm font-semibold text-[#F5B342]"
        >
          ← Back to Goal
        </Link>
      </div>
    );
  }

  const month = goal.roadmap.months.find((m) => String(m.index) === monthIndex);

  if (!month) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0E1526] text-[#EDEFF6] px-6 text-center">
        <p className="text-[#9AA5BD]">This month doesn't exist.</p>
        <Link
          to={`/goals/${goalId}`}
          className="text-sm font-semibold text-[#F5B342]"
        >
          ← Back to Goal
        </Link>
      </div>
    );
  }

  if (month.status === "locked") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0E1526] text-[#EDEFF6] px-6 text-center">
        <p className="text-[#9AA5BD]">
          Month {month.index} unlocks after you finish Month {month.index - 1}.
        </p>
        <Link
          to={`/goals/${goalId}`}
          className="text-sm font-semibold text-[#F5B342]"
        >
          ← Back to Goal
        </Link>
      </div>
    );
  }

  async function handleGenerate() {
    setGenerating(true);
    await generateMonthDetail(goal, month.index);
    setGenerating(false);
  }

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/goals/${goalId}`}
          className="text-sm text-[#9AA5BD] hover:text-[#EDEFF6] mb-6 inline-block"
        >
          ← Back to Goal
        </Link>

        <div className="mb-8">
          <span className="font-mono text-xs text-[#9AA5BD]">
            Month {month.index}
          </span>
          <h1
            className="font-bold text-3xl mt-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {month.title}
          </h1>
        </div>
        {!month.detail ? (
          <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 text-center">
            <p className="text-sm text-[#9AA5BD] mb-4">
              This month's plan hasn't been generated yet.
            </p>
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="rounded-full px-5 py-2.5 text-sm font-semibold bg-[#F5B342] text-[#1A1305] hover:brightness-110 transition disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Month Plan"}
            </button>
          </div>
        ) : (
          <>
            {/* Skills & Projects */}
            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
                <h2 className="font-semibold text-base mb-3">Skills</h2>
                <ul className="flex flex-col gap-2">
                  {month.detail.skills.map((s) => (
                    <li key={s} className="text-sm text-[#9AA5BD] flex gap-2">
                      <span style={{ color: "#5EEAD4" }}>—</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
                <h2 className="font-semibold text-base mb-3">Projects</h2>
                <ul className="flex flex-col gap-2">
                  {month.detail.projects.map((p) => (
                    <li key={p} className="text-sm text-[#9AA5BD] flex gap-2">
                      <span style={{ color: "#F5B342" }}>—</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Weeks */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
              <h2
                className="font-semibold text-lg mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Weeks
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {month.detail.weeks.map((w) => (
                  <WeekNode
                    key={w.index}
                    week={w}
                    goalId={goalId}
                    monthIndex={month.index}
                    onLockedClick={() =>
                      setLockedMessage(
                        `Week ${w.index} unlocks after you finish Week ${w.index - 1}.`,
                      )
                    }
                  />
                ))}
              </div>
              {lockedMessage && (
                <p className="text-xs text-[#F5B342] mt-3">{lockedMessage}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
