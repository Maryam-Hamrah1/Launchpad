import { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";

export default function DailyPlanner() {
  const { goalId, monthIndex, dayIndex } = useParams();
  const {
    goals,
    loading,
    generateDayDetail,
    toggleDayTask,
    saveDayNotes,
    completeDay,
  } = useContext(GoalContext);
  const navigate = useNavigate();

  const [generating, setGenerating] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const goal = goals.find((g) => String(g.id) === goalId);
  const month = goal?.roadmap?.months.find((m) => String(m.index) === monthIndex);
  const days = month?.detail?.days || [];
  const day = days.find((d) => String(d.index) === dayIndex);

  useEffect(() => {
    if (day?.detail?.notes !== undefined) {
      setNotesDraft(day.detail.notes);
    }
  }, [day?.detail?.notes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--color-ink-dim)]">
        Loading...
      </div>
    );
  }

  const monthBackLink = `/goals/${goalId}/month/${monthIndex}`;

  if (!goal || !month || !day) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 text-center">
        <p className="text-[var(--color-ink-dim)]">This day doesn't exist.</p>
      </div>
    );
  }

  // A day is locked if any earlier day in this month isn't completed yet.
  const isLocked = days.some((d) => d.index < day.index && !d.completed);

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 text-center">
        <div className="text-6xl">🔒</div>
        <p className="text-[var(--color-ink-dim)]">
          Day {day.index} unlocks after you finish Day {day.index - 1}.
        </p>
      </div>
    );
  }

  async function handleGenerate() {
    setGenerating(true);
    await generateDayDetail(goal, month.index, day.index);
    setGenerating(false);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    await saveDayNotes(goal, month.index, day.index, notesDraft);
    setSavingNotes(false);
  }

  async function handleCompleteDay() {
    await completeDay(goal, month.index, day.index);
    navigate(monthBackLink);
  }

  const detail = day.detail;
  const doneCount = detail ? detail.tasks.filter((t) => t.done).length : 0;
  const totalCount = detail ? detail.tasks.length : 0;
  const allDone = totalCount > 0 && doneCount === totalCount;
  const taskPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto">
        {/* Hero header */}
        <div
          className="rounded-3xl p-8 mb-6 text-center"
          style={{
            background: day.completed
              ? "linear-gradient(135deg, color-mix(in srgb, var(--color-success) 18%, transparent), color-mix(in srgb, var(--color-success) 8%, transparent))"
              : "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 18%, transparent), color-mix(in srgb, var(--color-primary) 8%, transparent))",
            border: `1px solid ${day.completed ? "color-mix(in srgb, var(--color-success) 40%, transparent)" : "color-mix(in srgb, var(--color-primary) 40%, transparent)"}`,
          }}
        >
          <span className="font-mono text-xs text-[var(--color-ink-dim)]">
            {goal.title} · Month {month.index} · Day {day.index} of {days.length}
          </span>

          <div className="text-6xl my-4">{day.completed ? "🏅" : "🎯"}</div>
          <h1
            className="font-bold text-3xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {detail?.title || `Day ${day.index} Mission`}
          </h1>
        </div>

        {!detail ? (
          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: "var(--color-bg-elev)",
              border: "1px solid var(--color-line)",
            }}
          >
            <div className="text-5xl mb-3">⚡️</div>
            <p className="text-sm text-[var(--color-ink-dim)] mb-5">
              Today's mission hasn't been generated yet.
            </p>
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="rounded-full px-6 py-3 text-sm font-bold bg-[var(--color-primary)] text-[#111] hover:brightness-110 transition disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Today's Tasks"}
            </button>
          </div>
        ) : (
          <>
            {/* Overview */}
            {detail.overview && (
              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-6 mb-6">
                <h2
                  className="font-semibold text-lg mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  📖 What Today Covers
                </h2>
                <p className="text-sm text-[var(--color-ink-dim)] leading-7">{detail.overview}</p>
              </div>
            )}

            {/* AI Tip */}
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-6 mb-6">
              <span
                className="font-mono text-[11px] block mb-2"
                style={{ color: "var(--color-primary)" }}
              >
                🤖 AI TIP
              </span>
              <p className="text-sm text-[var(--color-ink)]">{detail.aiTip}</p>
            </div>

            {/* Tasks */}
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-semibold text-lg"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Today's Tasks
                </h2>
                <span
                  className="text-xs font-bold rounded-full px-3 py-1"
                  style={{
                    background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                    color: "var(--color-primary)",
                  }}
                >
                  {doneCount}/{totalCount}
                </span>
              </div>

              {/* progress bar */}
              <div className="h-2 rounded-full bg-[var(--color-ink)]/5 mb-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${taskPct}%`,
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-success))",
                  }}
                />
              </div>

              <div className="flex flex-col gap-3">
                {detail.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl px-3 py-3"
                    style={{ background: "color-mix(in srgb, var(--color-ink) 3%, transparent)" }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDayTask(goal, month.index, day.index, task.id)}
                      className="flex items-start gap-3 text-left w-full"
                    >
                      <span
                        className="w-5 h-5 mt-0.5 rounded flex-shrink-0 flex items-center justify-center text-xs"
                        style={
                          task.done
                            ? { background: "var(--color-success)", color: "#111" }
                            : { border: "1px solid var(--color-line-strong)" }
                        }
                      >
                        {task.done ? "✓" : ""}
                      </span>
                      <span className="flex-1">
                        <span
                          className="block text-sm font-semibold"
                          style={
                            task.done
                              ? { color: "var(--color-ink-dim)", textDecoration: "line-through" }
                              : { color: "var(--color-ink)" }
                          }
                        >
                          {task.task}
                        </span>
                        {task.how && (
                          <span className="block text-xs text-[var(--color-ink-dim)] mt-1 leading-6">
                            {task.how}
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            {Array.isArray(detail.resources) && detail.resources.length > 0 && (
              <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-6 mb-6">
                <h2
                  className="font-semibold text-lg mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  📚 Resources for Today
                </h2>
                <div className="flex flex-col gap-2">
                  {detail.resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-[var(--color-ink)]/5 transition"
                      style={{ border: "1px solid var(--color-line)" }}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="text-xl flex-shrink-0">
                          {r.type?.toLowerCase().includes("video") ||
                          r.type?.toLowerCase().includes("youtube")
                            ? "🎬"
                            : r.type?.toLowerCase().includes("course")
                            ? "🎓"
                            : "🔗"}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm text-[var(--color-ink)] truncate">
                            {r.title}
                          </span>
                          <span className="block text-xs text-[var(--color-ink-dim)]">
                            {r.type}
                            {r.is_free ? " · Free" : ""}
                          </span>
                        </span>
                      </span>
                      <span className="text-[var(--color-primary)] text-sm flex-shrink-0">Open →</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-6 mb-6">
              <h2
                className="font-semibold text-lg mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Notes
              </h2>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                onBlur={handleSaveNotes}
                rows={4}
                placeholder="Jot down anything worth remembering from today..." 
                className="w-full rounded-lg px-4 py-3 text-sm bg-[var(--color-bg-elev2)] text-[var(--color-ink)] placeholder-[var(--color-ink-dim)] border border-[var(--color-line)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
              {savingNotes && (
                <span className="text-xs text-[var(--color-ink-dim)] mt-1 block">Saving...</span>
              )}
            </div>

            {/* Completion */}
            {day.completed ? (
              <div
                className="flex items-center justify-center gap-2 text-sm font-semibold rounded-full py-3"
                style={{ color: "var(--color-success)", background: "color-mix(in srgb, var(--color-success) 10%, transparent)" }}
              >
                ✅ Day completed
              </div>
            ) : (
              <button
                type="button"
                disabled={!allDone}
                onClick={handleCompleteDay}
                className="w-full rounded-full px-5 py-3 text-sm font-bold bg-[var(--color-success)] text-[#111] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {allDone ? "🏁 Mark Day Complete" : `Complete all tasks (${doneCount}/${totalCount})`}
              </button>
            )}
          </>
        )}
    </div>
  );
}
