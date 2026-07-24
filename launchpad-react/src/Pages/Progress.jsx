import { useContext, useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { GoalContext } from "../components/GoalContext";
import { collectCompletedDays, computeStreak } from "../components/streakUtils";
import { Bot, TrendingUp } from "lucide-react";

const FEEDBACK_CACHE_KEY = "launchpad-progress-feedback";

function AIInsightCard({ goalsSummary, cacheKey }) {
  const { generateProgressFeedback } = useContext(GoalContext);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function fetchFeedback(force) {
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(FEEDBACK_CACHE_KEY) || "null");
        if (cached && cached.key === cacheKey) {
          setFeedback(cached.feedback);
          return;
        }
      } catch {
        // ignore corrupt cache
      }
    }

    setLoading(true);
    setError(false);
    const result = await generateProgressFeedback(goalsSummary);
    setLoading(false);

    if (!result) {
      setError(true);
      return;
    }

    setFeedback(result);
    localStorage.setItem(FEEDBACK_CACHE_KEY, JSON.stringify({ key: cacheKey, feedback: result }));
  }

  useEffect(() => {
    if (goalsSummary.goals.length > 0) {
      fetchFeedback(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  if (goalsSummary.goals.length === 0) return null;

  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: "linear-gradient(135deg,rgba(110,168,254,.10),rgba(255,138,61,.06),var(--color-bg-elev))",
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className="font-semibold text-lg flex items-center gap-2"
          style={{ fontFamily: "'Space Grotesk',sans-serif" }}
        >
         <Bot size={18} style={{ color: "var(--color-primary)" }} /> AI Progress Review
        </h2>

        <button
          onClick={() => fetchFeedback(true)}
          disabled={loading}
          className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            color: "var(--color-primary)",
            border: "1px solid var(--color-line)",
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "Thinking..." : "Refresh"}
        </button>
      </div>

      {loading && !feedback && (
        <p className="text-sm" style={{ color: "var(--color-ink-dim)" }}>
          Evaluating your progress...
        </p>
      )}

      {error && !feedback && (
        <p className="text-sm" style={{ color: "var(--color-ink-dim)" }}>
          Couldn't generate an insight right now — try refreshing.
        </p>
      )}

      {feedback && (
        <div>
          <p className="text-sm mb-4" style={{ color: "var(--color-ink)" }}>
            {feedback.summary}
          </p>

          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "var(--color-ink-dim)" }}
          >
            NEXT STEPS
          </p>

          <ul className="space-y-2">
            {(feedback.nextSteps || []).map((step, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span style={{ color: "var(--color-primary)" }}>→</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function computeGoalProgress(goal) {
  if (!goal.roadmap) return goal.progress || 0;

  let total = 0;
  let done = 0;

  for (const month of goal.roadmap.months) {
    const days = month.detail?.days || [];
    total += days.length || 30;
    done += days.filter((d) => d.completed).length;
  }

  if (total === 0) return 0;

  return Math.round((done / total) * 100);
}

function ProgressCard({ goal }) {
  const progress = computeGoalProgress(goal);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--color-bg-elev)",

        border: "1px solid var(--color-line)",

        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="font-semibold text-lg"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            {goal.title}
          </h3>

          <p
            className="text-xs mt-1"
            style={{
              color: "var(--color-ink-dim)",
            }}
          >
            {goal.category || "Career"}
          </p>
        </div>

        <span
          className="text-sm font-semibold"
          style={{
            color: "var(--color-primary)",
          }}
        >
          {progress}%
        </span>
      </div>

      <div
        className="h-2 rounded-full overflow-hidden"
        style={{
          background: "var(--color-bg-elev2)",
        }}
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

      <div
        className="flex justify-between mt-4 text-xs"
        style={{
          color: "var(--color-ink-dim)",
        }}
      >
        <span>{goal.timeline || "No timeline"}</span>

        <span>{goal.priority || "Normal"}</span>
      </div>
    </div>
  );
}

function StatBox({ title, value, color }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--color-bg-elev)",

        border: "1px solid var(--color-line)",
      }}
    >
      <p
        className="text-xs mb-2"
        style={{
          color: "var(--color-ink-dim)",
        }}
      >
        {title}
      </p>

      <h2
        className="text-2xl font-bold"
        style={{
          fontFamily: "'Space Grotesk',sans-serif",

          color,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default function Progress() {
  const { goals, loading } = useContext(GoalContext);

  const stats = useMemo(() => {
    const active = goals.filter((g) => g.status !== "draft");

    const overall =
      active.length === 0
        ? 0
        : Math.round(
            active.reduce((sum, g) => sum + computeGoalProgress(g), 0) /
              active.length,
          );

    const completed = active.filter(
      (g) =>
        g.roadmap && g.roadmap.months.every((m) => m.status === "completed"),
    ).length;

    const completionRate =
      active.length === 0 ? 0 : Math.round((completed / active.length) * 100);

    let tasks = 0;

    for (const goal of goals) {
      if (!goal.roadmap) continue;

      for (const month of goal.roadmap.months) {
        if (!month.detail) continue;

        for (const day of month.detail.days || []) {
          if (!day.detail) continue;

          tasks += (day.detail.tasks || []).filter((t) => t.done).length;
        }
      }
    }

    const chartData = active.map((g) => ({
      name: g.title.length > 15 ? g.title.slice(0, 15) + "..." : g.title,

      progress: computeGoalProgress(g),
    }));

    const streak = computeStreak(collectCompletedDays(goals));

    const goalsSummary = {
      overallProgress: overall,
      completionRate,
      completedTasks: tasks,
      streak,
      goals: active.map((g) => {
        const currentMonth = g.roadmap?.months?.find((m) => m.status === "current");
        return {
          title: g.title,
          category: g.category,
          timeline: g.timeline,
          progress: computeGoalProgress(g),
          currentFocus: currentMonth?.title || null,
        };
      }),
    };

    return {
      overall,
      completionRate,
      tasks,
      streak,

      chartData,
      goalsSummary,
    };
  }, [goals]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64"
        style={{
          color: "var(--color-ink-dim)",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* HERO */}

      <section
        className="rounded-3xl p-6"
        style={{
          background:
            "linear-gradient(135deg,rgba(255,138,61,.12),rgba(110,168,254,.08),var(--color-bg-elev))",

          border: "1px solid var(--color-line)",

          boxShadow: "var(--shadow-card)",
        }}
      >
        <span
  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs mb-3"
  style={{
    background: "rgba(255,138,61,.12)",
    color: "var(--color-primary)",
  }}
>
  <TrendingUp size={13} /> PROGRESS TRACKER
</span>

        <h1
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
          }}
        >
          Track Your Growth Journey
        </h1>

        <p
          className="text-sm"
          style={{
            color: "var(--color-ink-dim)",
          }}
        >
          See how far you have come and monitor every goal you are building.
        </p>
      </section>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-5">
        <StatBox
          title="OVERALL PROGRESS"
          value={`${stats.overall}%`}
          color="var(--color-primary)"
        />

        <StatBox
          title="COMPLETION RATE"
          value={`${stats.completionRate}%`}
          color="var(--color-success)"
        />

        <StatBox title="COMPLETED TASKS" value={stats.tasks} />

        <StatBox
          title="CURRENT STREAK"
          value={`${stats.streak} days`}
          color="var(--color-accent)"
        />
      </div>

      {/* CHART */}

      <div
        className="rounded-3xl p-6"
        style={{
          background: "var(--color-bg-elev)",

          border: "1px solid var(--color-line)",

          boxShadow: "var(--shadow-card)",
        }}
      >
        <h2
          className="font-semibold text-lg mb-6"
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
          }}
        >
          Progress By Goals
        </h2>

        <div
          style={{
            height: 280,
          }}
        >
          <ResponsiveContainer>
            <BarChart data={stats.chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-line)"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: "var(--color-ink-dim)",
                  fontSize: 11,
                }}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fill: "var(--color-ink-dim)",
                  fontSize: 11,
                }}
              />

              <Tooltip />

              <Bar
                dataKey="progress"
                fill="var(--color-primary)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI PROGRESS REVIEW */}

      <AIInsightCard
        goalsSummary={stats.goalsSummary}
        cacheKey={JSON.stringify(stats.goalsSummary)}
      />

      {/* GOAL CARDS */}

      <div>
        <h2
          className="text-xl font-semibold mb-5"
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
          }}
        >
          Goal Progress
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {goals
            .filter((g) => g.status !== "draft")
            .map((goal) => (
              <ProgressCard key={goal.id} goal={goal} />
            ))}
        </div>
      </div>
    </div>
  );
}
