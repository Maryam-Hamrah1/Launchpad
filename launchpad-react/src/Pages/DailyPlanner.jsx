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
      <div className="min-h-screen flex items-center justify-center bg-[#0E1526] text-[#9AA5BD]">
        Loading...
      </div>
    );
  }

  const monthBackLink = `/goals/${goalId}/month/${monthIndex}`;

  if (!goal || !month || !day) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0E1526] text-[#EDEFF6] px-6 text-center">
        <p className="text-[#9AA5BD]">This day doesn't exist.</p>
        <Link to={monthBackLink} className="text-sm font-semibold text-[#F5B342]">
          ← Back to Month
        </Link>
      </div>
    );
  }

  // A day is locked if any earlier day in this month isn't completed yet.
  const isLocked = days.some((d) => d.index < day.index && !d.completed);

  if (isLocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0E1526] text-[#EDEFF6] px-6 text-center">
        <div className="text-6xl">🔒</div>
        <p className="text-[#9AA5BD]">
          Day {day.index} unlocks after you finish Day {day.index - 1}.
        </p>
        <Link to={monthBackLink} className="text-sm font-semibold text-[#F5B342]">
          ← Back to Month
        </Link>
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
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-2xl mx-auto">
        <Link
          to={monthBackLink}
          className="text-sm text-[#9AA5BD] hover:text-[#EDEFF6] mb-6 inline-block"
        >
          ← Back to Month {monthIndex}
        </Link>

        {/* Hero header */}
        <div
          className="rounded-3xl p-8 mb-6 text-center"
          style={{
            background: day.completed
              ? "linear-gradient(135deg, rgba(94,234,212,.18), rgba(20,184,166,.08))"
              : "linear-gradient(135deg, rgba(245,179,66,.18), rgba(255,138,61,.08))",
            border: `1px solid ${day.completed ? "rgba(94,234,212,.4)" : "rgba(245,179,66,.4)"}`,
          }}
        >
          <span className="font-mono text-xs text-[#9AA5BD]">
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
              background: "#141D33",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="text-5xl mb-3">⚡️</div>
            <p className="text-sm text-[#9AA5BD] mb-5">
              Today's mission hasn't been generated yet.
            </p>
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="rounded-full px-6 py-3 text-sm font-bold bg-[#F5B342] text-[#1A1305] hover:brightness-110 transition disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Today's Tasks"}
            </button>
          </div>
        ) : (
          <>
            {/* Overview */}
            {detail.overview && (
              <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
                <h2
                  className="font-semibold text-lg mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  📖 What Today Covers
                </h2>
                <p className="text-sm text-[#9AA5BD] leading-7">{detail.overview}</p>
              </div>
            )}

            {/* AI Tip */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
              <span
                className="font-mono text-[11px] block mb-2"
                style={{ color: "#F5B342" }}
              >
                🤖 AI TIP
              </span>
              <p className="text-sm text-[#EDEFF6]">{detail.aiTip}</p>
            </div>

            {/* Tasks */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
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
                    background: "rgba(245,179,66,.12)",
                    color: "#F5B342",
                  }}
                >
                  {doneCount}/{totalCount}
                </span>
              </div>

              {/* progress bar */}
              <div className="h-2 rounded-full bg-white/5 mb-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${taskPct}%`,
                    background: "linear-gradient(90deg, #F5B342, #5EEAD4)",
                  }}
                />
              </div>

              <div className="flex flex-col gap-3">
                {detail.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl px-3 py-3"
                    style={{ background: "rgba(255,255,255,0.03)" }}
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
                            ? { background: "#5EEAD4", color: "#0E1526" }
                            : { border: "1px solid rgba(255,255,255,0.25)" }
                        }
                      >
                        {task.done ? "✓" : ""}
                      </span>
                      <span className="flex-1">
                        <span
                          className="block text-sm font-semibold"
                          style={
                            task.done
                              ? { color: "#9AA5BD", textDecoration: "line-through" }
                              : { color: "#EDEFF6" }
                          }
                        >
                          {task.task}
                        </span>
                        {task.how && (
                          <span className="block text-xs text-[#9AA5BD] mt-1 leading-6">
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
              <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
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
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-white/5 transition"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
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
                          <span className="block text-sm text-[#EDEFF6] truncate">
                            {r.title}
                          </span>
                          <span className="block text-xs text-[#9AA5BD]">
                            {r.type}
                            {r.is_free ? " · Free" : ""}
                          </span>
                        </span>
                      </span>
                      <span className="text-[#F5B342] text-sm flex-shrink-0">Open →</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
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
                className="w-full rounded-lg px-4 py-3 text-sm bg-[#1B2540] text-[#EDEFF6] placeholder-[#9AA5BD] border border-white/10 focus:outline-none focus:border-[#F5B342] transition-colors"
              />
              {savingNotes && (
                <span className="text-xs text-[#9AA5BD] mt-1 block">Saving...</span>
              )}
            </div>

            {/* Completion */}
            {day.completed ? (
              <div
                className="flex items-center justify-center gap-2 text-sm font-semibold rounded-full py-3"
                style={{ color: "#5EEAD4", background: "rgba(94,234,212,.1)" }}
              >
                ✅ Day completed
              </div>
            ) : (
              <button
                type="button"
                disabled={!allDone}
                onClick={handleCompleteDay}
                className="w-full rounded-full px-5 py-3 text-sm font-bold bg-[#5EEAD4] text-[#0E1526] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {allDone ? "🏁 Mark Day Complete" : `Complete all tasks (${doneCount}/${totalCount}`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
