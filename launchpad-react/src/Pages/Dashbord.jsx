import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { GoalContext } from "../components/GoalContext";
import { ThemeContext } from "../components/ThemeContext";



function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Progress is computed live from the roadmap's actual completed weeks,
// rather than trusting the stored progress column (which nothing updates).
function computeProgress(goal) {
  if (!goal.roadmap) return 0;
  const months = goal.roadmap.months;
  let totalWeeks = 0;
  let doneWeeks = 0;
  months.forEach((m) => {
    const weekCount = m.detail ? m.detail.weeks.length : 4; // assume 4 weeks if not generated yet
    totalWeeks += weekCount;
    if (m.detail) {
      doneWeeks += m.detail.weeks.filter(
        (w) => w.status === "completed",
      ).length;
    }
  });
  return totalWeeks === 0 ? 0 : Math.round((doneWeeks / totalWeeks) * 100);
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
  const dateStrings = new Set(
    completedDays.map((d) => new Date(d.completedAt).toDateString()),
  );
  let streak = 0;
  const cursor = new Date();
  while (dateStrings.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function RadialProgress({ value, size = 96 }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--color-bg-elev2)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--color-primary)"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="700"
        fontSize="20"
        fill="var(--color-ink)"
      >
        {value}%
      </text>
    </svg>
  );
}

function GoalRow({ goal }) {
  const progress = computeProgress(goal);
  return (
    <Link
      to={`/goals/${goal.id}`}
      className="flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors"
      style={{
        border: "1px solid var(--color-line)",
        background: "var(--color-bg-elev)",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center font-semibold text-sm"
        style={{
          background:
            "color-mix(in srgb, var(--color-primary) 15%, transparent)",
          color: "var(--color-primary)",
        }}
      >
        {(goal.title || "?").charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-medium truncate">{goal.title}</div>
        <div
          className="h-1.5 rounded-full mt-2 overflow-hidden"
          style={{ background: "var(--color-bg-elev2)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg,var(--color-primary),var(--color-primary-light))",
            }}
          />
        </div>
      </div>
      <span
        className="font-mono text-xs flex-shrink-0"
        style={{ color: "var(--color-ink-dim)" }}
      >
        {progress}%
      </span>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { isLight, toggleTheme } = useContext(ThemeContext);
  const { goals, loading } = useContext(GoalContext);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-bg)", color: "var(--color-ink-dim)" }}
      >
        Loading...
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "there";
  const activeGoals = goals.filter((g) => g.status === "active");
  const overallProgress =
    activeGoals.length === 0
      ? 0
      : Math.round(
          activeGoals.reduce((sum, g) => sum + computeProgress(g), 0) /
            activeGoals.length,
        );
  const streak = computeStreak(collectCompletedDays(goals));

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}
    >
      

      <main className="flex-1 px-6 md:px-10 py-8 max-w-5xl">
       

        

        {/* Hero */}
<div
  className="rounded-3xl p-8 mb-8"
  style={{
    background:
      "linear-gradient(135deg, rgba(255,138,61,.12), rgba(110,168,254,.08), var(--color-bg-elev))",
    border: "1px solid rgba(255,138,61,.18)",
    boxShadow: "var(--shadow-card)",
  }}
>
  <div className="grid lg:grid-cols-[1.7fr_1fr] gap-8 items-center">

    {/* LEFT */}

    <div>

      <span
        className="inline-flex items-center rounded-full px-3 py-1 text-xs mb-5"
        style={{
          background: "rgba(255,138,61,.12)",
          color: "var(--color-primary)",
          border: "1px solid rgba(255,138,61,.18)",
        }}
      >
        ✨ AI Career Roadmap
      </span>

      <h1
        className="text-4xl font-bold mb-4 leading-tight"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {getGreeting()}, {fullName} 👋
      </h1>

      <p
        className="text-base max-w-2xl leading-8 mb-8"
        style={{ color: "var(--color-ink-dim)" }}
      >
        Welcome back to Launchpad.

        This is where your dreams become achievable.

        Create goals, generate AI roadmaps, complete weekly tasks,
        and track your progress until you reach success.
      </p>

      <div className="flex flex-wrap gap-4 mb-8">

        <Link
          to="/create-goal"
          className="rounded-xl px-6 py-3 font-semibold transition"
          style={{
            background: "var(--color-primary)",
            color: "#111",
          }}
        >
          + Create Goal
        </Link>

        <Link
          to="/goals"
          className="rounded-xl px-6 py-3 font-semibold"
          style={{
            border: "1px solid var(--color-line)",
            background: "var(--color-bg-elev)",
          }}
        >
          View All Goals
        </Link>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {goals.length}
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: "var(--color-ink-dim)" }}
          >
            Total Goals
          </div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: "var(--color-accent)" }}
          >
            {activeGoals.length}
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: "var(--color-ink-dim)" }}
          >
            Active Goals
          </div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: "var(--color-success)" }}
          >
            {streak}
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: "var(--color-ink-dim)" }}
          >
            Day Streak
          </div>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div
            className="text-2xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {overallProgress}%
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: "var(--color-ink-dim)" }}
          >
            Progress
          </div>
        </div>

      </div>

    </div>

    {/* RIGHT */}
    <div
      className="rounded-3xl p-7"
      style={{
        background: "var(--color-bg-elev)",
        border: "1px solid var(--color-line)",
      }}
    >

      <div className="flex justify-center mb-6">
        <RadialProgress value={overallProgress} size={150} />
      </div>

      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-line)",
        }}
      >

        <div
          className="text-xs mb-2"
          style={{ color: "var(--color-ink-dim)" }}
        >
          CURRENT GOAL
        </div>

        <h3
          className="font-semibold text-lg mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {activeGoals[0]?.title || "No Active Goal"}
        </h3>

        <div
          className="text-sm"
          style={{ color: "var(--color-ink-dim)" }}
        >
          {activeGoals[0]?.timeline || "--"}
        </div>

        <div
          className="h-2 rounded-full mt-5 overflow-hidden"
          style={{ background: "var(--color-bg-elev2)" }}
        >
          <div
            style={{
              width: `${overallProgress}%`,
              height: "100%",
              background:
                "linear-gradient(90deg,var(--color-primary),var(--color-primary-light))",
            }}
          />
        </div>

      </div>

    </div>

  </div>
</div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* LEFT: goals */}
          <div className="md:col-span-2">
         {activeGoals.length === 0 ? (
  <div
    className="rounded-3xl p-10 text-center"
    style={{
      background: "var(--color-bg-elev)",
      border: "1px dashed var(--color-line-strong)",
    }}
  >
    <h3
      className="text-xl font-semibold mb-3"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      No Active Goals
    </h3>

    <p
      className="text-sm mb-6"
      style={{ color: "var(--color-ink-dim)" }}
    >
      Create your first AI roadmap and start your journey today.
    </p>

    <Link
      to="/create-goal"
      className="rounded-xl px-6 py-3 font-semibold inline-block"
      style={{
        background: "var(--color-primary)",
        color: "#111",
      }}
    >
      + Create Goal
    </Link>
  </div>
) : (
  <div className="grid gap-5">
    {activeGoals.map((goal) => {
      const progress = computeProgress(goal);

      const currentMonth = goal.roadmap?.months.find(
        (m) => m.status === "current"
      );

      return (
        <Link
          key={goal.id}
          to={`/goals/${goal.id}`}
          className="group rounded-3xl p-6 transition-all duration-300"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between gap-8">

            <div className="flex-1">

              <div className="flex items-center gap-3 mb-3">

                <span
                  className="rounded-full px-3 py-1 text-xs"
                  style={{
                    background: "rgba(255,138,61,.12)",
                    color: "var(--color-primary)",
                  }}
                >
                  {goal.category || "Career"}
                </span>

                <span
                  className="text-xs"
                  style={{ color: "var(--color-ink-dim)" }}
                >
                  {goal.timeline}
                </span>

              </div>

              <h2
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {goal.title}
              </h2>

              <p
                className="text-sm leading-7 mb-5"
                style={{ color: "var(--color-ink-dim)" }}
              >
                Continue building your roadmap and complete this
                week's milestones to stay on track.
              </p>

              <div
                className="h-3 rounded-full overflow-hidden"
                style={{
                  background: "var(--color-bg-elev2)",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg,var(--color-primary),var(--color-primary-light))",
                  }}
                />
              </div>

              <div
                className="flex gap-8 mt-4 text-sm"
                style={{ color: "var(--color-ink-dim)" }}
              >
                <span>Progress {progress}%</span>

                <span>
                  {currentMonth
                    ? `Month ${currentMonth.index}`
                    : "Roadmap Pending"}
                </span>
              </div>

            </div>

            <div
              className="rounded-2xl p-5 lg:w-64"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
              }}
            >

              <div
                className="text-xs mb-3"
                style={{ color: "var(--color-ink-dim)" }}
              >
                QUICK STATS
              </div>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span style={{ color: "var(--color-ink-dim)" }}>
                    Experience
                  </span>
                  <strong>
                    {goal.experienceLevel}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "var(--color-ink-dim)" }}>
                    Timeline
                  </span>

                  <strong>
                    {goal.timeline}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "var(--color-ink-dim)" }}>
                    Progress
                  </span>

                  <strong
                    style={{
                      color: "var(--color-primary)",
                    }}
                  >
                    {progress}%
                  </strong>
                </div>

              </div>

              <button
                className="w-full mt-6 rounded-xl py-3 font-semibold"
                style={{
                  background: "var(--color-primary)",
                  color: "#111",
                }}
              >
                Continue →
              </button>

            </div>

          </div>
        </Link>
      );
    })}
  </div>
)}
            
          </div>
          {/* RIGHT PANEL */}

<div className="flex flex-col gap-6">



  {/* AI Coach */}

  <div
    className="rounded-3xl p-6"
    style={{
      background:
        "linear-gradient(160deg, rgba(255,138,61,.10), transparent)",
      border: "1px solid rgba(255,138,61,.18)",
      boxShadow: "var(--shadow-card)",
    }}
  >

    <div className="flex items-center gap-4 mb-4">

      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
        style={{
          background: "rgba(255,138,61,.12)",
        }}
      >
        🤖
      </div>

      <div>

        <div
          className="font-semibold"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          AI Coach
        </div>

        <div
          className="text-xs"
          style={{
            color: "var(--color-ink-dim)",
          }}
        >
          Personalized Motivation
        </div>

      </div>

    </div>

    <p
      className="text-sm leading-7 mb-5"
      style={{
        color: "var(--color-ink-dim)",
      }}
    >
      {streak > 0
        ? `Amazing! You're currently on a ${streak}-day streak. Keep completing your weekly milestones and you'll reach your goal faster.`
        : "Create your first roadmap and I'll guide you every step of the way."}
    </p>

    <Link
      to="/ai-coach"
      className="block w-full text-center rounded-xl py-3 font-semibold"
      style={{
        background: "var(--color-primary)",
        color: "#111",
      }}
    >
      Open AI Coach
    </Link>

  </div>

  {/* Quick Actions */}

  <div
    className="rounded-3xl p-6"
    style={{
      background: "var(--color-bg-elev)",
      border: "1px solid var(--color-line)",
      boxShadow: "var(--shadow-card)",
    }}
  >

    <h3
      className="font-semibold mb-5"
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      Quick Actions
    </h3>

    <div className="grid gap-3">
      <Link
        to="/create-goal"
        className="rounded-xl px-4 py-3"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-line)",
        }}
      >
        🎯 Create New Goal
      </Link>

      <Link
        to="/planner"
        className="rounded-xl px-4 py-3"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-line)",
        }}
      >
        📅 Weekly Planner
      </Link>

      <Link
        to="/progress"
        className="rounded-xl px-4 py-3"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-line)",
        }}
      >
        📈 Track Progress
      </Link>

    </div>

  </div>

</div>
          
        </div>
      </main>
    </div>
  );
}
