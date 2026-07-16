import { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";

export default function DailyPlanner() {
  const { goalId, monthIndex, weekIndex, dayIndex } = useParams();
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
  const week = month?.detail?.weeks.find((w) => String(w.index) === weekIndex);
  const day = week?.detail?.days.find((d) => String(d.index) === dayIndex);

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

  const weekBackLink = `/goals/${goalId}/month/${monthIndex}/week/${weekIndex}`;

  if (!goal || !month || !week || !day) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0E1526] text-[#EDEFF6] px-6 text-center">
        <p className="text-[#9AA5BD]">This day doesn't exist.</p>
        <Link to={weekBackLink} className="text-sm font-semibold text-[#F5B342]">
          ← Back to Week
        </Link>
      </div>
    );
  }

  if (day.status === "locked") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0E1526] text-[#EDEFF6] px-6 text-center">
        <p className="text-[#9AA5BD]">{day.name} unlocks after you finish the day before it.</p>
        <Link to={weekBackLink} className="text-sm font-semibold text-[#F5B342]">
          ← Back to Week
        </Link>
      </div>
    );
  }

  async function handleGenerate() {
    setGenerating(true);
    await generateDayDetail(goal, month.index, week.index, day.index);
    setGenerating(false);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    await saveDayNotes(goal, month.index, week.index, day.index, notesDraft);
    setSavingNotes(false);
  }

  async function handleCompleteDay() {
    await completeDay(goal, month.index, week.index, day.index);
    navigate(weekBackLink);
  }

  const detail = day.detail;
  const doneCount = detail ? detail.tasks.filter((t) => t.done).length : 0;
  const totalCount = detail ? detail.tasks.length : 0;
  const allDone = totalCount > 0 && doneCount === totalCount;

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-2xl mx-auto">
        <Link to={weekBackLink} className="text-sm text-[#9AA5BD] hover:text-[#EDEFF6] mb-6 inline-block">
          ← Back to Week
        </Link>

        <div className="mb-8">
          <span className="font-mono text-xs text-[#9AA5BD]">
            {goal.title} · Week {week.index}
          </span>
          <h1 className="font-bold text-3xl mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {day.name}: {day.title}
          </h1>
        </div>

        {!detail ? (
          <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 text-center">
            <p className="text-sm text-[#9AA5BD] mb-4">Today's tasks haven't been generated yet.</p>
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="rounded-full px-5 py-2.5 text-sm font-semibold bg-[#F5B342] text-[#1A1305] hover:brightness-110 transition disabled:opacity-50"
              >
              {generating ? "Generating..." : "Generate Today's Tasks"}
            </button>
          </div>
        ) : (
          <>
            {/* AI Tip */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
              <span className="font-mono text-[11px] block mb-2" style={{ color: "#F5B342" }}>
                🤖 AI TIP
              </span>
              <p className="text-sm text-[#EDEFF6]">{detail.aiTip}</p>
            </div>

            {/* Tasks */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
              <h2 className="font-semibold text-lg mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Today's Tasks
              </h2>
              <div className="flex flex-col gap-2">
                {detail.tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleDayTask(goal, month.index, week.index, day.index, task.id)}
                    className="flex items-center gap-3 text-left rounded-lg px-3 py-2.5 hover:bg-white/5 transition"
                  >
                    <span
                      className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-xs"
                      style={
                        task.done
                          ? { background: "#5EEAD4", color: "#0E1526" }
                          : { border: "1px solid rgba(255,255,255,0.25)" }
                      }
                    >
                      {task.done ? "✓" : ""}
                    </span>
                    <span
                      className="text-sm"
                      style={task.done ? { color: "#9AA5BD", textDecoration: "line-through" } : {}}
                    >
                      {task.task}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
              <h2 className="font-semibold text-lg mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
              {savingNotes && <span className="text-xs text-[#9AA5BD] mt-1 block">Saving...</span>}
            </div>

            {/* Completion */}
            {day.status === "completed" ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: "#5EEAD4" }}>
                ✅ Day completed
              </div>
            ) : (
              <button
                type="button"
                disabled={!allDone}
                onClick={handleCompleteDay}
                className="rounded-full px-5 py-2.5 text-sm font-semibold bg-[#5EEAD4] text-[#0E1526] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {allDone ? "Mark Day Complete" : `Complete all tasks (${doneCount}/${totalCount})`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}