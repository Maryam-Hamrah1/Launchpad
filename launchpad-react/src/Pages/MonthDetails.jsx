import { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";

/* ===============================
        DAY NODE (game badge)
================================ */

function DayNode({ day, goalId, monthIndex, isLocked, isCurrent, onLockedClick }) {
  const isDone = day.completed;

  const bg = isDone
    ? "linear-gradient(135deg, #5EEAD4, #14B8A6)"
    : isCurrent
    ? "linear-gradient(135deg, #F5B342, #FF8A3D)"
    : "linear-gradient(135deg, #1E2A44, #141D33)";

  const ring = isDone ? "#5EEAD4" : isCurrent ? "#F5B342" : "rgba(255,255,255,0.12)";

  const node = (
    <div
      className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 transition ${
        isCurrent ? "day-current-pulse" : ""
      } ${!isLocked ? "hover:scale-[1.08] hover:-translate-y-0.5" : ""}`}
      style={{
        background: bg,
        border: `2px solid ${ring}`,
        opacity: isLocked ? 0.45 : 1,
        filter: isLocked ? "grayscale(0.5)" : "none",
        boxShadow: isCurrent
          ? "0 0 22px rgba(245,179,66,.45)"
          : isDone
          ? "0 0 14px rgba(94,234,212,.3)"
          : "none",
      }}
    >
      <span className="text-[10px] font-mono opacity-80 text-[#0E1526]">
        DAY
      </span>
      <span className="text-xl font-extrabold text-[#0E1526]">
        {day.index}
      </span>

      {isDone && (
        <span className="absolute -top-2 -right-2 text-lg">✅</span>
      )}
      {isLocked && (
        <span className="absolute -top-2 -right-2 text-lg">🔒</span>
      )}
      {isCurrent && (
        <span className="absolute -bottom-2 text-[9px] font-bold tracking-widest text-[#F5B342]">
          ● LIVE
        </span>
      )}
    </div>
  );

  if (isLocked) {
    return (
      <button type="button" onClick={onLockedClick} className="w-full">
        {node}
      </button>
    );
  }

  return (
    <Link to={`/goals/${goalId}/month/${monthIndex}/day/${day.index}`} className="block w-full">
      {node}
    </Link>
  );
}

/* ===============================
        MAIN PAGE
================================ */

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
        <Link to={`/goals/${goalId}`} className="text-sm font-semibold text-[#F5B342]">
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
        <Link to={`/goals/${goalId}`} className="text-sm font-semibold text-[#F5B342]">
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
        <Link to={`/goals/${goalId}`} className="text-sm font-semibold text-[#F5B342]">
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

  const days = month.detail?.days || [];
  const doneCount = days.filter((d) => d.completed).length;

  // A day is "current" if it's the first not-yet-completed day.
  // A day is "locked" if any earlier day isn't completed yet.
  const firstIncompleteIndex = days.find((d) => !d.completed)?.index;

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/goals/${goalId}`}
          className="text-sm text-[#9AA5BD] hover:text-[#EDEFF6] mb-6 inline-block"
        >
          ← Back to Goal
        </Link>

        <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
          <div>
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

          {days.length > 0 && (
            <div
              className="rounded-full px-4 py-2 text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, rgba(245,179,66,.18), rgba(94,234,212,.12))",
                border: "1px solid rgba(245,179,66,.4)",
                color: "#F5B342",
              }}
            >
              🔥 {doneCount} / {days.length} days
            </div>
          )}
        </div>

        {!month.detail ? (
          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(245,179,66,.14), rgba(94,234,212,.08))",
              border: "1px solid rgba(245,179,66,.35)",
            }}
          >
            <div className="text-6xl mb-3">🚀</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to start Month {month.index}?
            </h2>
            <p className="text-sm text-[#9AA5BD] mb-6">
              Your 30-day mission map is waiting to be unlocked.
            </p>
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="rounded-full px-7 py-3 text-sm font-bold bg-[#F5B342] text-[#1A1305] hover:brightness-110 transition disabled:opacity-50"
            >
              {generating ? "Preparing your journey..." : "Start This Month →"}
            </button>
          </div>
        ) : (
          <>
            {/* Skills & Projects */}
            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
                <h2 className="font-semibold text-base mb-3">Skills</h2>
                <ul className="flex flex-col gap-2">
                  {month.detail.skills?.map((s) => (
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
                  {month.detail.projects?.map((p) => (
                    <li key={p} className="text-sm text-[#9AA5BD] flex gap-2">
                      <span style={{ color: "#F5B342" }}>—</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 30 Days path */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "linear-gradient(180deg, #141D33, #101828)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <style>{`
                @keyframes dayPulse {
                  0%   { box-shadow: 0 0 0 0 rgba(245,179,66,.5); }
                  70%  { box-shadow: 0 0 0 12px rgba(245,179,66,0); }
                  100% { box-shadow: 0 0 0 0 rgba(245,179,66,0); }
                }
                .day-current-pulse { animation: dayPulse 2s infinite; }
              `}</style>

              <h2
                className="font-semibold text-lg mb-5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                🗺 Your 30-Day Path
              </h2>

              {days.length === 0 ? (
                <p className="text-sm text-[#9AA5BD]">
                  No daily plan found for this month yet.
                </p>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                  {days.map((day) => {
                    const isLocked =
                      firstIncompleteIndex !== undefined && day.index > firstIncompleteIndex;
                    const isCurrent = day.index === firstIncompleteIndex;

                    return (
                      <DayNode
                        key={day.index}
                        day={day}
                        goalId={goalId}
                        monthIndex={month.index}
                        isLocked={isLocked}
                        isCurrent={isCurrent}
                        onLockedClick={() =>
                          setLockedMessage(
                            `Day ${day.index} unlocks after you finish Day ${day.index - 1}.`
                          )
                        }
                      />
                    );
                  })}
                </div>
              )}
              {lockedMessage && (
                <p className="text-xs text-[#F5B342] mt-4">{lockedMessage}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
