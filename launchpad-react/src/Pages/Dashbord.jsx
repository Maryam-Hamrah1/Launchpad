import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { GoalContext } from "../components/GoalContext";
import StreakCalendar from "../components/StreackCalender";
import { collectCompletedDays, computeStreak } from "../components/streakUtils";
import {Bot, Sparkles} from "lucide-react"


function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";

  return "Good evening";
}

// Calculate progress from roadmap
function computeProgress(goal) {
  if (!goal.roadmap) return goal.progress || 0;

  let totalDays = 0;
  let completedDays = 0;

  goal.roadmap.months.forEach((month) => {
    const days = month.detail?.days || [];

    totalDays += days.length || 30;

    days.forEach((day) => {
      if (day.completed) {
        completedDays++;
      }
    });
  });

  if (totalDays === 0) return 0;

  return Math.round((completedDays / totalDays) * 100);
}

function computeScore(goals, streak) {
  const completedGoals = goals.filter(
    (g) => g.roadmap && g.roadmap.months.every((m) => m.status === "completed"),
  ).length;

  const completedTasks = goals.reduce((total, g) => {
    g.roadmap?.months.forEach((month) => {
      (month.detail?.days || []).forEach((day) => {
        day.detail?.tasks?.forEach((task) => {
          if (task.done) total++;
        });
      });
    });

    return total;
  }, 0);

  return Math.min(100, completedGoals * 20 + streak * 5 + completedTasks);
}
function RadialProgress({ value, size = 150 }) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circle = 2 * Math.PI * radius;

  const offset = circle - (value / 100) * circle;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--color-bg-elev2)"
        strokeWidth={stroke}
        fill="none"
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--color-primary)"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circle}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-ink)"
        fontSize="24"
        fontWeight="700"
        fontFamily="'Space Grotesk', sans-serif"
      >
        {value}%
      </text>
    </svg>
  );
}

function StatCard({ title, value, accent }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--color-bg-elev)",
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        className="text-xs mb-3"
        style={{
          color: "var(--color-ink-dim)",
        }}
      >
        {title}
      </div>

      <div
        className="text-2xl font-bold"
        style={{
          color: accent || "var(--color-ink)",
          fontFamily: "'Space Grotesk',sans-serif",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function GoalCard({ goal }) {
  const progress = computeProgress(goal);

  return (
    <Link
      to={`/goals/${goal.id}`}
      className="block rounded-3xl p-6 transition"
      style={{
        background: "var(--color-bg-elev)",

        border: "1px solid var(--color-line)",

        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex justify-between mb-4">
        <div>
          <div
            className="text-xs mb-2"
            style={{
              color: "var(--color-primary)",
            }}
          >
            {goal.category || "Career"}
          </div>

          <h3
            className="text-xl font-bold"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            {goal.title}
          </h3>
        </div>
        <div
          className="font-mono text-sm"
          style={{
            color: "var(--color-primary)",
          }}
        >
          {progress}%
        </div>
      </div>

      <div
        className="h-2 rounded-full overflow-hidden mb-4"
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
        className="flex justify-between text-sm"
        style={{
          color: "var(--color-ink-dim)",
        }}
      >
        <span>{goal.timeline || "--"}</span>

        <span>View Roadmap →</span>
      </div>
    </Link>
  );
}
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { goals, loading } = useContext(GoalContext);

  const activeGoals = goals.filter((g) => g.status === "active");

  const overallProgress =
    activeGoals.length === 0
      ? 0
      : Math.round(
          activeGoals.reduce((sum, g) => sum + computeProgress(g), 0) /
            activeGoals.length,
        );

  const streak = computeStreak(collectCompletedDays(goals));

  const score = computeScore(goals, streak);

  const completedGoals = goals.filter(
    (g) => g.roadmap && g.roadmap.months.every((m) => m.status === "completed"),
  ).length;

  if (loading) {
    return (
      <div
        className="min-h-screen  flex items-center justify-center"
        style={{
          background: "var(--color-bg)",
          color: "var(--color-ink-dim)",
        }}
      >
        Loading...
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "there";

  return (
    <div
      className="min-h-screen w-full  "
      style={{
        background: "var(--color-bg)",
        color: "var(--color-ink)",
      }}
    >
      {/* HERO */}

      <section
        className="rounded-3xl p-8 mb-8"
        style={{
          background:
            "linear-gradient(135deg,rgba(255,138,61,.12),rgba(110,168,254,.08),var(--color-bg-elev))",

          border: "1px solid rgba(255,138,61,.18)",

          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="grid grid-cols-1 gap-8">
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 items-center">
            <div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs mb-5"
                style={{
                  color: "var(--color-primary)",
                  background: "rgba(255,138,61,.12)",
                }}
              >
                <Sparkles size={13} /> AI Career Roadmap
              </span>

              <h1
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                }}
              >
                {getGreeting()}, {fullName} 👋
              </h1>

              <p
                className="leading-8 max-w-xl"
                style={{
                  color: "var(--color-ink-dim)",
                }}
              >
                Track your goals, follow your AI roadmap, complete your
                milestones and keep moving toward your future.
              </p>
            </div>

            <div
              className="rounded-3xl p-6 flex flex-col items-center justify-center"
              style={{
                background: "var(--color-bg-elev)",
                border: "1px solid var(--color-line)",
              }}
            >
              <div
                className="text-sm mb-4"
                style={{
                  color: "var(--color-ink-dim)",
                }}
              >
                OVERALL PROGRESS
              </div>

              <RadialProgress value={overallProgress} />
            </div>
          </div>
          {/* FIVE CARDS */}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="TOTAL GOALS"
              value={goals.length}
              accent="var(--color-primary)"
            />

            <StatCard
              title="ACTIVE GOALS"
              value={activeGoals.length}
              accent="var(--color-accent)"
            />

            <StatCard
              title="COMPLETED"
              value={completedGoals}
              accent="var(--color-success)"
            />

            <StatCard
              title="STREAK"
              value={`${streak}d`}
              accent="var(--color-primary)"
            />

            <StatCard
              title="SCORE"
              value={score}
              accent="var(--color-accent)"
            />
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION */}

      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6 mt-15">
        {/* GOALS */}

        <div>
          <div className="flex items-center justify-end mb-6">
            <div className="flex gap-3">
              <Link
                to="/create-goal"
                className="rounded-xl px-4 py-2 text-sm font-semibold transition"
                style={{
                  background: "var(--color-primary)",
                  color: "#111",
                }}
              >
                + Create Goal
              </Link>

              <Link
                to="/goals"
                className="rounded-xl px-4 py-2 text-sm font-semibold transition"
                style={{
                  background: "var(--color-bg-elev)",
                  border: "1px solid var(--color-line)",
                }}
              >
                View Goals
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            {activeGoals.length === 0 ? (
              <div
                className="rounded-3xl p-8 text-center"
                style={{
                  background: "var(--color-bg-elev)",
                  border: "1px dashed var(--color-line)",
                }}
              >
                No goals yet.
              </div>
            ) : (
              activeGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex flex-col gap-6">
          {/* AI COACH */}

          <div
            className="rounded-3xl p-6"
            style={{
              background:
                "linear-gradient(160deg,rgba(255,138,61,.12),transparent)",
              border: "1px solid rgba(255,138,61,.18)",
            }}
          >
            <div className="text-3xl mb-3"><Bot/></div>

            <h3
              className="font-bold mb-2"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
              }}
            >
              AI Coach
            </h3>

            <p
              className="text-sm mb-5"
              style={{
                color: "var(--color-ink-dim)",
              }}
            >
              Get guidance, motivation and answers about your goals.
            </p>

            <Link
              to="/ai-coach"
              className="block text-center rounded-xl py-3 font-semibold"
              style={{
                background: "var(--color-primary)",
                color: "#111",
              }}
            >
              Open AI Coach
            </Link>
          </div>

          <StreakCalendar />
        </div>
      </div>
    </div>
  );
}
