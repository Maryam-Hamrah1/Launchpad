import { useContext } from "react";
import { Link } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";

function findCurrent(list) {
  return list?.find((item) => item.status === "current") || null;
}

function GoalPlannerCard({ goal, toggleDayTask }) {
  if (!goal.roadmap) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
        <h3 className="font-semibold text-base mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {goal.title}
        </h3>
        <p className="text-sm text-[#9AA5BD] mb-3">No roadmap generated yet.</p>
        <Link to={`/goals/${goal.id}`} className="text-sm font-semibold" style={{ color: "#F5B342" }}>
          Go to Goal →
        </Link>
      </div>
    );
  }

  const month = findCurrent(goal.roadmap.months);
  if (!month?.detail) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
        <h3 className="font-semibold text-base mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {goal.title}
        </h3>
        <p className="text-sm text-[#9AA5BD] mb-3">Month {month?.index} hasn't been planned yet.</p>
        <Link to={`/goals/${goal.id}/month/${month.index}`} className="text-sm font-semibold" style={{ color: "#F5B342" }}>
          Plan This Month →
        </Link>
      </div>
    );
  }

  const week = findCurrent(month.detail.weeks);
  if (!week?.detail) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
        <h3 className="font-semibold text-base mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {goal.title}
        </h3>
        <p className="text-sm text-[#9AA5BD] mb-3">Week {week?.index} hasn't been planned yet.</p>
        <Link
          to={`/goals/${goal.id}/month/${month.index}/week/${week.index}`}
          className="text-sm font-semibold"
          style={{ color: "#F5B342" }}
        >
          Plan This Week →
        </Link>
      </div>
    );
  }

  const day = findCurrent(week.detail.days);
  const dayLink = `/goals/${goal.id}/month/${month.index}/week/${week.index}/day/${day?.index}`;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
      <div className="flex justify-between items-start mb-1 gap-3">
        <h3 className="font-semibold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {goal.title}
        </h3>
        <span className="font-mono text-[10px] text-[#9AA5BD] flex-shrink-0">
          Week {week.index} · {day?.name}
        </span>
      </div>
      <p className="text-xs text-[#9AA5BD] mb-4">{week.title}</p>

      {!day?.detail ? (
        <Link to={dayLink} className="text-sm font-semibold" style={{ color: "#F5B342" }}>
          Generate Today's Tasks →
        </Link>
      ) : (
        <>
          <div className="flex flex-col gap-1.5 mb-3">
            {day.detail.tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleDayTask(goal, month.index, week.index, day.index, task.id)}
                className="flex items-center gap-3 text-left rounded-lg px-2 py-1.5 hover:bg-white/5 transition"
              >
                <span
                  className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center text-[10px]"
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
          <Link to={dayLink} className="text-xs font-semibold" style={{ color: "#9AA5BD" }}>
            Open full day view →
          </Link>
        </>
      )}
    </div>
  );
}

export default function Planner() {
  const { goals, loading, toggleDayTask } = useContext(GoalContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E1526] text-[#9AA5BD]">
        Loading...
      </div>
    );
  }

  const activeGoals = goals.filter((g) => g.status === "active");

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <span className="inline-block font-mono text-xs rounded-full px-3 py-1.5 mb-3 border border-white/20 text-[#F5B342]">
            📅 PLANNER
          </span>
          <h1 className="font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Today & This Week
          </h1>
        </div>

        {activeGoals.length === 0 ? (
          <p className="text-sm text-[#9AA5BD]">No active goals yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {activeGoals.map((g) => (
              <GoalPlannerCard key={g.id} goal={g} toggleDayTask={toggleDayTask} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}