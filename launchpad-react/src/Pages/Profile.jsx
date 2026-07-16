import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { GoalContext } from "../components/GoalContext";

function getEffectiveStatus(goal) {
  if (goal.status === "draft") return "draft";
  if (goal.roadmap && goal.roadmap.months.every((m) => m.status === "completed")) return "completed";
  return "in-progress";
}

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

function computeBadges(goals, streak) {
  const badges = [];
  const hasAnyGoal = goals.length > 0;
  const hasCompletedWeek = goals.some(
    (g) => g.roadmap?.months.some((m) => m.detail?.weeks.some((w) => w.status === "completed"))
  );
  const hasCompletedMonth = goals.some((g) => g.roadmap?.months.some((m) => m.status === "completed"));
  const hasCompletedGoal = goals.some((g) => getEffectiveStatus(g) === "completed");

  if (hasAnyGoal) badges.push({ icon: "🎯", label: "First Goal Created" });
  if (hasCompletedWeek) badges.push({ icon: "✅", label: "First Week Completed" });
  if (hasCompletedMonth) badges.push({ icon: "🗓️", label: "First Month Completed" });
  if (streak >= 7) badges.push({ icon: "🔥", label: "7-Day Streak" });
  if (hasCompletedGoal) badges.push({ icon: "🏁", label: "Goal Achieved" });

  return badges;
}

export default function Profile() {
  const { user, signOut } = useContext(AuthContext);
  const { goals, loading } = useContext(GoalContext);
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const activeGoals = goals.filter((g) => getEffectiveStatus(g) === "in-progress");
    const currentGoal = activeGoals[0] || null;
    const streak = computeStreak(collectCompletedDays(goals));
    const badges = computeBadges(goals, streak);
    return { activeGoals, currentGoal, streak, badges };
  }, [goals]);

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E1526] text-[#9AA5BD]">
        Loading...
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "there";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0"
            style={{ background: "#1B2540", border: "2px solid #F5B342", color: "#F5B342" }}
          >
            {initial}
          </div>
          <div>
            <h1 className="font-bold text-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {fullName}
            </h1>
            <p className="text-sm text-[#9AA5BD]">{user?.email}</p>
          </div>
        </div>

        {/* Current goal + level + streak */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#141D33] p-5">
          <span className="font-mono text-[11px] text-[#9AA5BD] block mb-2">CURRENT GOAL</span>
            <span className="text-sm">{stats.currentGoal?.title || "None yet"}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#141D33] p-5">
            <span className="font-mono text-[11px] text-[#9AA5BD] block mb-2">CURRENT LEVEL</span>
            <span className="text-sm">{stats.currentGoal?.experience_level || "—"}</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#141D33] p-5">
            <span className="font-mono text-[11px] text-[#9AA5BD] block mb-2">STREAK</span>
            <span className="font-bold text-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#FF7A6B" }}>
              {stats.streak}d
            </span>
          </div>
        </div>

        {/* Active goals */}
        <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Active Goals
          </h2>
          {stats.activeGoals.length === 0 ? (
            <p className="text-sm text-[#9AA5BD]">No active goals yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.activeGoals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => navigate(`/goals/${g.id}`)}
                  className="flex items-center justify-between text-left rounded-lg px-3 py-2.5 hover:bg-white/5 transition"
                >
                  <span className="text-sm">{g.title}</span>
                  <span className="font-mono text-xs text-[#9AA5BD]">{g.progress || 0}%</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Achievements
          </h2>
          {stats.badges.length === 0 ? (
            <p className="text-sm text-[#9AA5BD]">Complete tasks to start earning badges.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.badges.map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center text-center rounded-xl px-3 py-4"
                  style={{ border: "1px solid #F5B342", background: "rgba(245,179,66,0.08)" }}
                >
                  <span className="text-xl mb-1">{b.icon}</span>
                  <span className="text-xs">{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full px-6 py-3 text-sm font-semibold border border-white/20 hover:border-[#FF7A6B] hover:text-[#FF7A6B] transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
