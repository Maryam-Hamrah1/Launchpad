import { useContext, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import { GoalContext } from "../components/GoalContext";

function getEffectiveStatus(goal) {
  if (goal.status === "draft") return "draft";
  if (goal.roadmap && goal.roadmap.months.every((m) => m.status === "completed")) return "completed";
  return "in-progress";
}

// Walks every day across every goal's roadmap and returns the ones marked completed.
function collectCompletedDays(goals) {
  const days = [];
  for (const goal of goals) {
    if (!goal.roadmap) continue;
    for (const month of goal.roadmap.months) {
      if (!month.detail) continue;
      for (const week of month.detail.weeks) {
        if (!week.detail) continue;
        for (const day of week.detail.days) {
          if (day.status === "completed" && day.completedAt) days.push(day);
        }
      }
    }
  }
  return days;
}

function computeStreak(completedDays) {
  const dateStrings = new Set(completedDays.map((d) => new Date(d.completedAt).toDateString()));
  let streak = 0;
  const cursor = new Date();
  while (dateStrings.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141D33] p-5">
      <span className="font-mono text-[11px] text-[#9AA5BD] block mb-2">{label}</span>
      <span
        className="font-bold text-2xl"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: accent || "#EDEFF6" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function Progress() {
  const { goals, loading } = useContext(GoalContext);

  const stats = useMemo(() => {
    const nonDraft = goals.filter((g) => g.status !== "draft");
    const overallProgress =
      nonDraft.length === 0
        ? 0
        : Math.round(nonDraft.reduce((sum, g) => sum + (g.progress || 0), 0) / nonDraft.length);

    const completedGoalsCount = nonDraft.filter((g) => getEffectiveStatus(g) === "completed").length;
    const completionRate = nonDraft.length === 0 ? 0 : Math.round((completedGoalsCount / nonDraft.length) * 100);

    let completedTasks = 0;
    let learningHours = 0;
    for (const goal of goals) {
      if (!goal.roadmap) continue;
      for (const month of goal.roadmap.months) {
        if (!month.detail) continue;
        for (const week of month.detail.weeks) {
          if (!week.detail) continue;
          completedTasks += week.detail.checklist.filter((t) => t.done).length;
          if (week.status === "completed") learningHours += week.detail.estimatedHours || 0;
          for (const day of week.detail.days) {
            if (!day.detail) continue;
            completedTasks += day.detail.tasks.filter((t) => t.done).length;
          }
        }
      }
    }

    const completedDays = collectCompletedDays(goals);
    const streak = computeStreak(completedDays);

    const chartData = nonDraft.map((g) => ({
      name: g.title.length > 18 ? g.title.slice(0, 18) + "…" : g.title,
      progress: g.progress || 0,
    }));

    return { overallProgress, completionRate, completedTasks, learningHours, streak, chartData };
  }, [goals]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E1526] text-[#9AA5BD]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="inline-block font-mono text-xs rounded-full px-3 py-1.5 mb-3 border border-white/20 text-[#F5B342]">
            📈 PROGRESS
          </span>
          <h1 className="font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Your Progress
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          <StatCard label="OVERALL PROGRESS" value={`${stats.overallProgress}%`} accent="#F5B342" />
          <StatCard label="COMPLETION RATE" value={`${stats.completionRate}%`} accent="#5EEAD4" />
          <StatCard label="COMPLETED TASKS" value={stats.completedTasks} />
          <StatCard label="LEARNING HOURS" value={`${stats.learningHours}h`} />
          <StatCard label="CURRENT STREAK" value={`${stats.streak} days`} accent="#FF7A6B" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6">
          <h2 className="font-semibold text-lg mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Progress by Goal
          </h2>
          {stats.chartData.length === 0 ? (
            <p className="text-sm text-[#9AA5BD]">No goals yet — create one to see your progress here.</p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={stats.chartData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#9AA5BD", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#9AA5BD", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ background: "#1B2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                    labelStyle={{ color: "#EDEFF6" }}
                    itemStyle={{ color: "#F5B342" }}
                  />
                  <Bar dataKey="progress" fill="#F5B342" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}