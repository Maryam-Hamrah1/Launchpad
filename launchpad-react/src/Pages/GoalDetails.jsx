import { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";

function StatCard({ title, value, color }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--color-bg-elev)",
        border: "1px solid var(--color-line)",
      }}
    >
      <p
        className="text-[11px] uppercase tracking-[0.2em]"
        style={{ color: "var(--color-ink-dim)" }}
      >
        {title}
      </p>

      <h3
        className="text-2xl font-bold mt-3"
        style={{
          color: color || "var(--color-ink)",
          fontFamily: "'Space Grotesk',sans-serif",
        }}
      >
        {value}
      </h3>
    </div>
  );
}

function ProgressCircle({ value }) {
  const size = 150;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-bg-elev2)"
        strokeWidth={stroke}
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c - (value / 100) * c}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        fill="var(--color-ink)"
        fontSize="30"
        fontWeight="700"
        fontFamily="Space Grotesk"
      >
        {value}%
      </text>

      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        fill="var(--color-ink-dim)"
        fontSize="11"
      >
        Progress
      </text>
    </svg>
  );
}

function MonthNode({ month, goalId, onLockedClick }) {
  const done = month.status === "completed";
  const current = month.status === "current";
  const locked = month.status === "locked";

  const style = done
    ? {
        border: "1px solid var(--color-success)",
        color: "var(--color-success)",
        background: "rgba(49,208,170,.08)",
      }
    : current
      ? {
          border: "1px solid var(--color-primary)",
          color: "var(--color-primary)",
          background: "rgba(255,138,61,.08)",
        }
      : {
          border: "1px solid var(--color-line)",
          color: "var(--color-ink-dim)",
        };

  const card = (
    <div
      className="w-28 rounded-2xl p-4 text-center flex-shrink-0 transition"
      style={style}
    >
      <div className="text-xl mb-2">{done ? "✅" : current ? "🟠" : "🔒"}</div>

      <div className="text-xs">Month {month.index}</div>

      <div className="text-[11px] mt-2">{month.title}</div>
    </div>
  );

  if (locked) {
    return <button onClick={onLockedClick}>{card}</button>;
  }

  return <Link to={`/goals/${goalId}/month/${month.index}`}>{card}</Link>;
}

export default function GoalDetails() {
  const { goalId } = useParams();

  const { goals, loading, generateRoadmap } = useContext(GoalContext);

  const [generating, setGenerating] = useState(false);

  const [lockedMessage, setLockedMessage] = useState("");

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "var(--color-bg)",
          color: "var(--color-ink-dim)",
        }}
      >
        Loading...
      </div>
    );
  }

  const goal = goals.find((g) => String(g.id) === goalId);

  if (!goal) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "var(--color-bg)",
          color: "var(--color-ink)",
        }}
      >
        Goal Not Found
      </div>
    );
  }
  async function handleGenerate() {
    setGenerating(true);
    await generateRoadmap(goal);
    setGenerating(false);
  }

  return (
    <div
      className="min-h-screen py-10 px-6"
      style={{
        background: "var(--color-bg)",
        color: "var(--color-ink)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Link
          to="/dashboard"
          className="text-sm mb-8 inline-block"
          style={{
            color: "var(--color-ink-dim)",
          }}
        >
          ← Back to Dashboard
        </Link>

        {/* HERO */}

        <div
          className="rounded-3xl p-8 mb-8"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,138,61,.10), rgba(110,168,254,.06), var(--color-bg-elev))",
            border: "1px solid rgba(255,138,61,.15)",
          }}
        >
          <div className="grid lg:grid-cols-[1.6fr_.8fr] gap-8">
            <div>
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs mb-5"
                style={{
                  background: "rgba(255,138,61,.10)",
                  color: "var(--color-primary)",
                }}
              >
                {goal.category || "Career Goal"}
              </span>

              <h1
                className="text-5xl font-bold mb-4"
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                }}
              >
                {goal.title}
              </h1>

              <p
                className="max-w-2xl leading-8 mb-8"
                style={{
                  color: "var(--color-ink-dim)",
                }}
              >
                {goal.description ||
                  "Transform your dream into an achievable roadmap with AI guidance, weekly milestones and measurable progress."}
              </p>

              {goal.roadmap ? (
                <Link
                  to={`/goals/${goal.id}/month/${goal.roadmap.months.find((m) => m.status === "current")?.index || 1}`}
                  className="inline-block rounded-xl px-6 py-3 font-semibold"
                  style={{
                    background: "var(--color-primary)",
                    color: "#111",
                  }}
                >
                  Continue Journey
                </Link>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="rounded-xl px-6 py-3 font-semibold"
                  style={{
                    background: "var(--color-primary)",
                    color: "#111",
                  }}
                >
                  {generating ? "Generating..." : "Generate AI Roadmap"}
                </button>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <ProgressCircle value={goal.progress || 0} />
            </div>
          </div>
        </div>

        {/* QUICK STATS */}

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Timeline"
            value={goal.timeline}
            color="var(--color-primary)"
          />

          <StatCard
            title="Experience"
            value={goal.experience_level}
            color="var(--color-accent)"
          />

          <StatCard
            title="Priority"
            value={goal.priority}
            color="var(--color-success)"
          />

          <StatCard
            title="Progress"
            value={`${goal.progress || 0}%`}
            color="var(--color-primary)"
          />
        </div>
        {/* DESCRIPTION & MOTIVATION */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            className="rounded-3xl p-6"
            style={{
              background: "var(--color-bg-elev)",
              border: "1px solid var(--color-line)",
            }}
          >
            <h2
              className="text-xl font-bold mb-3"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
              }}
            >
              Description
            </h2>

            <p
              className="text-sm leading-7"
              style={{
                color: "var(--color-ink-dim)",
              }}
            >
              {goal.description || "No description provided yet."}
            </p>
          </div>

          <div
            className="rounded-3xl p-6"
            style={{
              background: "var(--color-bg-elev)",
              border: "1px solid var(--color-line)",
            }}
          >
            <h2
              className="text-xl font-bold mb-3"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
              }}
            >
              Motivation
            </h2>

            <p
              className="text-sm leading-7"
              style={{
                color: "var(--color-ink-dim)",
              }}
            >
              {goal.motivation ||
                "Your motivation will keep you focused throughout this journey."}
            </p>
          </div>
        </div>

        {/* CURRENT MILESTONE */}

        <div
          className="rounded-3xl p-7 mb-8"
          style={{
            background:
              "linear-gradient(135deg,rgba(255,138,61,.08),var(--color-bg-elev))",
            border: "1px solid rgba(255,138,61,.15)",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <span
                className="text-xs uppercase tracking-[0.25em]"
                style={{
                  color: "var(--color-primary)",
                }}
              >
                Current Milestone
              </span>

              <h2
                className="text-3xl font-bold mt-3"
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                }}
              >
                {goal.roadmap
                  ? goal.roadmap.months.find((m) => m.status === "current")
                      ?.title || "Starting Journey"
                  : "Generate Your Roadmap"}
              </h2>

              <p
                className="text-sm mt-3"
                style={{
                  color: "var(--color-ink-dim)",
                }}
              >
                Complete milestones step by step and move closer to your goal.
              </p>
            </div>

            <div className="flex items-center">
              <div
                className="rounded-2xl px-6 py-4 text-center"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-line)",
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: "var(--color-primary)",
                  }}
                >
                  {goal.progress || 0}%
                </div>

                <div
                  className="text-xs mt-1"
                  style={{
                    color: "var(--color-ink-dim)",
                  }}
                >
                  Completed
                </div>
              </div>
            </div>
          </div>

          <div
            className="h-3 rounded-full overflow-hidden mt-7"
            style={{
              background: "var(--color-bg-elev2)",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${goal.progress || 0}%`,
                background:
                  "linear-gradient(90deg,var(--color-primary),var(--color-primary-light))",
              }}
            />
          </div>
        </div>

        {/* AI ROADMAP */}

        <div
          className="rounded-3xl p-7 mb-8"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div className="flex justify-between items-center mb-7">
            <div>
              <span
                className="text-xs uppercase tracking-[0.25em]"
                style={{
                  color: "var(--color-primary)",
                }}
              >
                AI Generated Plan
              </span>

              <h2
                className="text-2xl font-bold mt-2"
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                }}
              >
                Roadmap Timeline
              </h2>
            </div>

            {goal.roadmap && (
              <span
                className="text-sm"
                style={{
                  color: "var(--color-ink-dim)",
                }}
              >
                {goal.roadmap.months.length} Months
              </span>
            )}
          </div>

          {!goal.roadmap ? (
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: "var(--color-bg)",
              }}
            >
              <p
                className="text-sm mb-5"
                style={{
                  color: "var(--color-ink-dim)",
                }}
              >
                Generate your personalized AI roadmap to begin your journey.
              </p>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-xl px-6 py-3 font-semibold"
                style={{
                  background: "var(--color-primary)",
                  color: "#111",
                }}
              >
                {generating ? "Generating..." : "Generate Roadmap"}
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {goal.roadmap.months.map((month) => (
                  <MonthNode
                    key={month.index}
                    month={month}
                    goalId={goal.id}
                    onLockedClick={() =>
                      setLockedMessage(
                        `Month ${month.index} is locked. Complete previous milestones first.`,
                      )
                    }
                  />
                ))}
              </div>

              {lockedMessage && (
                <p
                  className="text-sm mt-4"
                  style={{
                    color: "var(--color-primary)",
                  }}
                >
                  {lockedMessage}
                </p>
              )}
            </>
          )}
        </div>
        {/* RESOURCES */}

        <div
          className="rounded-3xl p-7 mb-8"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div className="mb-6">
            <span
              className="text-xs uppercase tracking-[0.25em]"
              style={{
                color: "var(--color-primary)",
              }}
            >
              Recommended Materials
            </span>

            <h2
              className="text-2xl font-bold mt-2"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
              }}
            >
              Learning Resources
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "📘",
                title: "Courses",
                text: "Structured learning paths",
              },
              {
                icon: "🎥",
                title: "Videos",
                text: "Practical explanations",
              },
              {
                icon: "📄",
                title: "Articles",
                text: "Deep knowledge resources",
              },
              {
                icon: "💻",
                title: "Projects",
                text: "Practice your skills",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl p-5 transition"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-line)",
                }}
              >
                <div className="text-3xl mb-4">{item.icon}</div>

                <h3
                  className="font-semibold mb-2"
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-xs leading-5"
                  style={{
                    color: "var(--color-ink-dim)",
                  }}
                >
                  {item.text}
                </p>

                <button
                  className="text-xs font-semibold mt-4"
                  style={{
                    color: "var(--color-primary)",
                  }}
                >
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* STATISTICS */}

        <div
          className="rounded-3xl p-7 mb-8"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
          }}
        >
          <div className="mb-6">
            <span
              className="text-xs uppercase tracking-[0.25em]"
              style={{
                color: "var(--color-primary)",
              }}
            >
              Performance
            </span>

            <h2
              className="text-2xl font-bold mt-2"
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
              }}
            >
              Goal Statistics
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            <StatCard
              title="Completed Tasks"
              value="0"
              color="var(--color-success)"
            />

            <StatCard
              title="Learning Hours"
              value="0h"
              color="var(--color-accent)"
            />

            <StatCard
              title="Completion Rate"
              value={`${goal.progress || 0}%`}
              color="var(--color-primary)"
            />

            <StatCard
              title="Status"
              value={goal.status === "active" ? "Active" : "Draft"}
              color="var(--color-success)"
            />
          </div>
        </div>

        {/* FOOTER ACTION */}

        <div
          className="rounded-3xl p-7 text-center"
          style={{
            background:
              "linear-gradient(135deg,rgba(255,138,61,.12),rgba(110,168,254,.08))",
            border: "1px solid var(--color-line)",
          }}
        >
          <h2
            className="text-2xl font-bold mb-3"
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            Keep Moving Forward 🚀
          </h2>

          <p
            className="text-sm mb-5"
            style={{
              color: "var(--color-ink-dim)",
            }}
          >
            Every milestone completed brings you closer to your dream.
          </p>

          <Link
            to="/planner"
            className="inline-block rounded-xl px-7 py-3 font-semibold"
            style={{
              background: "var(--color-primary)",
              color: "#111",
            }}
          >
            Open Weekly Planner
          </Link>
        </div>
      </div>
    </div>
  );
}
