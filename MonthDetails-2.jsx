import { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";

/* ===============================
        DAY NODE (game badge)
================================ */

function DayNode({ day, goalId, monthIndex, isLocked, isCurrent, onLockedClick }) {
  const isDone = day.completed;

  const bg = isDone
    ? "linear-gradient(135deg, var(--color-success), color-mix(in srgb, var(--color-success) 70%, black))"
    : isCurrent
    ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"
    : "linear-gradient(135deg, var(--color-bg-elev2), var(--color-bg-elev))";

  const ring = isDone ? "var(--color-success)" : isCurrent ? "var(--color-primary)" : "color-mix(in srgb, var(--color-ink) 12%, transparent)";

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
          ? "0 0 22px color-mix(in srgb, var(--color-primary) 45%, transparent)"
          : isDone
          ? "0 0 14px color-mix(in srgb, var(--color-success) 30%, transparent)"
          : "none",
      }}
    >
      <span className="text-[10px] font-mono opacity-80 text-[#111]">
        DAY
      </span>
      <span className="text-xl font-extrabold text-[#111]">
        {day.index}
      </span>

      {isDone && (
        <span className="absolute -top-2 -right-2 text-lg">✅</span>
      )}
      {isLocked && (
        <span className="absolute -top-2 -right-2 text-lg">🔒</span>
      )}
      {isCurrent && (
        <span className="absolute -bottom-2 text-[9px] font-bold tracking-widest text-[var(--color-primary)]">
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
      <div className="flex items-center justify-center py-24 text-[var(--color-ink-dim)]">
        Loading...
      </div>
    );
  }

  const goal = goals.find((g) => String(g.id) === goalId);

  if (!goal || !goal.roadmap) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 text-center">
        <p className="text-[var(--color-ink-dim)]">This month doesn't exist.</p>
      </div>
    );
  }

  const month = goal.roadmap.months.find((m) => String(m.index) === monthIndex);

  if (!month) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 text-center">
        <p className="text-[var(--color-ink-dim)]">This month doesn't exist.</p>
      </div>
    );
  }

  if (month.status === "locked") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 text-center">
        <p className="text-[var(--color-ink-dim)]">
          Month {month.index} unlocks after you finish Month {month.index - 1}.
        </p>
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
    <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
          <div>
            <span className="font-mono text-xs text-[var(--color-ink-dim)]">
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
                background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 18%, transparent), color-mix(in srgb, var(--color-success) 12%, transparent))",
                border: "1px solid color-mix(in srgb, var(--color-primary) 40%, transparent)",
                color: "var(--color-primary)",
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
              background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, transparent), color-mix(in srgb, var(--color-success) 8%, transparent))",
              border: "1px solid color-mix(in srgb, var(--color-primary) 35%, transparent)",
            }}
          >
            <div className="text-6xl mb-3">🚀</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to start Month {month.index}?
            </h2>
            <p className="text-sm text-[var(--color-ink-dim)] mb-6">
              Your 30-day mission map is waiting to be unlocked.
            </p>
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="rounded-full px-7 py-3 text-sm font-bold bg-[var(--color-primary)] text-[#111] hover:brightness-110 transition disabled:opacity-50"
            >
              {generating ? "Preparing your journey..." : "Start This Month →"}
            </button>
          </div>
        ) : (
          <>
            {/* Skills & Projects */}
            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-6">
                <h2 className="font-semibold text-base mb-3">Skills</h2>
                <ul className="flex flex-col gap-2">
                  {month.detail.skills?.map((s) => (
                    <li key={s} className="text-sm text-[var(--color-ink-dim)] flex gap-2">
                      <span style={{ color: "var(--color-success)" }}>—</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-6">
                <h2 className="font-semibold text-base mb-3">Projects</h2>
                <ul className="flex flex-col gap-2">
                  {month.detail.projects?.map((p) => (
                    <li key={p} className="text-sm text-[var(--color-ink-dim)] flex gap-2">
                      <span style={{ color: "var(--color-primary)" }}>—</span>
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
                background: "linear-gradient(180deg, var(--color-bg-elev), var(--color-bg))",
                border: "1px solid var(--color-line)",
              }}
            >
              <style>{`
                @keyframes dayPulse {
                  0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary) 50%, transparent); }
                  70%  { box-shadow: 0 0 0 12px transparent; }
                  100% { box-shadow: 0 0 0 0 transparent; }
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
                <p className="text-sm text-[var(--color-ink-dim)]">
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
                <p className="text-xs text-[var(--color-primary)] mt-4">{lockedMessage}</p>
              )}
            </div>
          </>
        )}
    </div>
  );
}
