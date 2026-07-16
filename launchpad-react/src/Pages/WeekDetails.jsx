import { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";

function DayNode({ day, goalId, monthIndex, weekIndex, onLockedClick }) {
  const isLocked = day.status === "locked";
  const isCurrent = day.status === "current";
  const isDone = day.status === "completed";

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
    <div className="rounded-xl px-3 py-3 text-center" style={style}>
      <div className="mb-1">{isDone ? "✅" : isCurrent ? "🟡" : "🔒"}</div>
      <span className="font-mono text-[10px] block mb-0.5">{day.name}</span>
      <span className="text-[11px] leading-snug block">{day.title}</span>
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
    <Link
      to={`/goals/${goalId}/month/${monthIndex}/week/${weekIndex}/day/${day.index}`}
    >
      {content}
    </Link>
  );
}

export default function WeekDetails() {
  const { goalId, monthIndex, weekIndex } = useParams();
  const {
    goals,
    loading,
    generateWeekDetail,
    toggleChecklistItem,
    completeWeek,
  } = useContext(GoalContext);
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
  const month = goal?.roadmap?.months.find(
    (m) => String(m.index) === monthIndex,
  );
  const week = month?.detail?.weeks.find((w) => String(w.index) === weekIndex);

  if (!goal || !month || !week) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0E1526] text-[#EDEFF6] px-6 text-center">
        <p className="text-[#9AA5BD]">This week doesn't exist.</p>
        <Link
          to={`/goals/${goalId}/month/${monthIndex}`}
          className="text-sm font-semibold text-[#F5B342]"
        >
          ← Back to Month
        </Link>
      </div>
    );
  }

  if (week.status === "locked") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0E1526] text-[#EDEFF6] px-6 text-center">
        <p className="text-[#9AA5BD]">
          Week {week.index} unlocks after you finish Week {week.index - 1}.
        </p>
        <Link
          to={`/goals/${goalId}/month/${monthIndex}`}
          className="text-sm font-semibold text-[#F5B342]"
        >
          ← Back to Month
        </Link>
      </div>
    );
  }

  async function handleGenerate() {
    setGenerating(true);
    await generateWeekDetail(goal, month.index, week.index);
    setGenerating(false);
  }

  const detail = week.detail;
  const completedCount = detail
    ? detail.checklist.filter((i) => i.done).length
    : 0;
  const totalCount = detail ? detail.checklist.length : 0;
  const weeklyProgress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/goals/${goalId}/month/${monthIndex}`}
          className="text-sm text-[#9AA5BD] hover:text-[#EDEFF6] mb-6 inline-block"
        >
          ← Back to Month
        </Link>

        <div className="mb-8">
          <span className="font-mono text-xs text-[#9AA5BD]">
            {goal.title} · Month {month.index} · Week {week.index}
          </span>
          <h1
            className="font-bold text-3xl mt-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {week.title}
          </h1>
        </div>
        {!detail ? (
          <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 text-center">
            <p className="text-sm text-[#9AA5BD] mb-4">
              This week's plan hasn't been generated yet.
            </p>
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="rounded-full px-5 py-2.5 text-sm font-semibold bg-[#F5B342] text-[#1A1305] hover:brightness-110 transition disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Week Plan"}
            </button>
          </div>
        ) : (
          <>
            {/* Progress + Estimated Hours */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl border border-white/10 bg-[#141D33] p-5">
                <span className="font-mono text-[11px] text-[#9AA5BD] block mb-2">
                  WEEKLY PROGRESS
                </span>
                <div className="h-2 rounded-full bg-[#1B2540] overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: ` ${weeklyProgress}%`,
                      background: "linear-gradient(90deg,#F5B342,#5EEAD4)",
                    }}
                  />
                </div>
                <span className="text-xs text-[#9AA5BD]">
                  {completedCount} of {totalCount} tasks · {weeklyProgress}%
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#141D33] p-5">
                <span className="font-mono text-[11px] text-[#9AA5BD] block mb-2">
                  ESTIMATED HOURS
                </span>
                <span
                  className="font-bold text-2xl"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {detail.estimatedHours}h
                </span>
              </div>
            </div>

            {/* AI Advice */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
              <span
                className="font-mono text-[11px] block mb-2"
                style={{ color: "#F5B342" }}
              >
                🤖 AI ADVICE
              </span>
              <p className="text-sm text-[#EDEFF6]">{detail.aiAdvice}</p>
            </div>

            {/* Checklist */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
              <h2
                className="font-semibold text-lg mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Checklist
              </h2>
              <div className="flex flex-col gap-2">
                {detail.checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      toggleChecklistItem(
                        goal,
                        month.index,
                        week.index,
                        item.id,
                      )
                    }
                    className="flex items-center gap-3 text-left rounded-lg px-3 py-2.5 hover:bg-white/5 transition"
                  >
                    <span
                      className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-xs"
                      style={
                        item.done
                          ? { background: "#5EEAD4", color: "#0E1526" }
                          : { border: "1px solid rgba(255,255,255,0.25)" }
                      }
                    >
                      {item.done ? "✓" : ""}
                    </span>
                    <span
                      className="text-sm"
                      style={
                        item.done
                          ? { color: "#9AA5BD", textDecoration: "line-through" }
                          : {}
                      }
                    >
                      {item.task}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              {week.status === "completed" ? (
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "#5EEAD4" }}
                >
                  ✅ Week completed
                </div>
              ) : (
                <button
                  type="button"
                  disabled={weeklyProgress < 100}
                  onClick={() => completeWeek(goal, month.index, week.index)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold bg-[#5EEAD4] text-[#0E1526] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {weeklyProgress < 100
                    ? "Complete all tasks to finish this week"
                    : "Mark Week Complete"}
                </button>
              )}
            </div>

            {/* Resources */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6"></div>
            <h2
              className="font-semibold text-lg mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Resources
            </h2>
            <div className="flex flex-col gap-3">
              {detail.resources.map((r) => (
                <div
                  key={r.title}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-sm block">{r.title}</span>
                    <span className="font-mono text-[10px] text-[#9AA5BD]">
                      {r.type}
                    </span>
                  </div>
                  <span
                    className="font-mono text-[10px] rounded-full px-2 py-1 flex-shrink-0"
                    style={
                      r.is_free
                        ? { border: "1px solid #5EEAD4", color: "#5EEAD4" }
                        : {
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#9AA5BD",
                          }
                    }
                  >
                    {r.is_free ? "FREE" : "PAID"}
                  </span>
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
              <h2
                className="font-semibold text-lg mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Days
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {detail.days.map((d) => (
                  <DayNode
                    key={d.index}
                    day={d}
                    goalId={goalId}
                    monthIndex={monthIndex}
                    weekIndex={weekIndex}
                    onLockedClick={() =>
                      setLockedMessage(
                        `${d.name} unlocks after you finish the day before it.`,
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
