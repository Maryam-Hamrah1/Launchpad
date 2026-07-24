import { useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";
import {Lock, Trash2, Trophy,
  Check, Play, Medal, Link2, FileEdit, Rocket, Bot,
} from "lucide-react";

const BIOMES = [
  "🏜", "🌲", "⛰", "🌊",
  "🏝", "🌋", "🏕", "🏛",
  "❄️", "☁️", "🌿", "🏆"
];

const styles = {
  card: {
    background: "var(--color-bg-elev)",
    border: "1px solid var(--color-line)",
  },
  box: {
    background: "var(--color-bg)",
    border: "1px solid var(--color-line)",
  },
  dim: {
    color: "var(--color-ink-dim)",
  },
  title: {
    fontFamily: "'Space Grotesk',sans-serif",
  },
  button: {
    background: "var(--color-primary)",
    color: "#111",
  },
};

/* Inject keyframes once */
function GameStyles() {
  return (
    <style>{`
      @keyframes pulseGlow {
        0%   { box-shadow: 0 0 0 0 rgba(255,138,61,.45); }
        70%  { box-shadow: 0 0 0 18px rgba(255,138,61,0); }
        100% { box-shadow: 0 0 0 0 rgba(255,138,61,0); }
      }
      @keyframes floatY {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      @keyframes dashMove {
        to { stroke-dashoffset: -48; }
      }
      .node-current-ring {
        animation: pulseGlow 2.2s infinite;
      }
      .node-float {
        animation: floatY 3.4s ease-in-out infinite;
      }
      .path-dash {
        animation: dashMove 3s linear infinite;
      }
    `}</style>
  );
}

/* ===============================
      PROGRESS CIRCLE
================================ */

function ProgressCircle({ value }) {
  const size = 170;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-bg-elev2)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (value / 100) * circumference}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .6s ease" }}
      />
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        fill="var(--color-ink)"
        fontSize="32"
        fontWeight="700"
      >
        {value}%
      </text>
      <text
        x="50%"
        y="66%"
        textAnchor="middle"
        fill="var(--color-ink-dim)"
        fontSize="12"
      >
        Journey Progress
      </text>
    </svg>
  );
}

/* ===============================
      GAME-STYLE PATH CONNECTOR
================================ */

function PathConnector({ flip }) {
  const from = flip ? 330 : 50;
  const to = flip ? 50 : 330;

  return (
    <svg
      width="100%"
      height="80"
      viewBox="0 0 380 80"
      preserveAspectRatio="none"
      className="block mx-auto"
    >
      <defs>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      <path
        d={`M ${from} 0 C ${from} 40, ${to} 40, ${to} 80`}
        stroke="url(#pathGrad)"
        strokeWidth="5"
        strokeDasharray="4 12"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
        className="path-dash"
      />
    </svg>
  );
}

/* ===============================
          LOCK MODAL
================================ */

function LockedModal({ month, onClose }) {
  if (!month) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div
        className="w-[520px] max-w-[90vw] rounded-[32px] p-8"
        style={styles.card}
      >
        <Lock size={48} style={{ color: "var(--color-ink-dim)" }} />
        <h2 className="text-3xl font-bold mt-5" style={styles.title}>
          Month {month.index}
        </h2>
        <p className="mt-2 text-lg" style={{ color: "var(--color-primary)" }}>
          {month.title}
        </p>
        <p className="mt-6 leading-8" style={styles.dim}>
          This stage is locked. Complete the previous milestone before
          unlocking this mission.
        </p>
        <button
          onClick={onClose}
          className="mt-8 px-6 py-3 rounded-xl font-semibold"
          style={styles.button}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ===============================
        Delete Modal Confirmation
================================ */

function ConfirmDeleteModal({ goalTitle, onCancel, onConfirm }) {
  if (!goalTitle) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="w-[440px] max-w-[90vw] rounded-[32px] p-8" style={styles.card}>
        <Trash2 size={48} style={{ color: "var(--color-danger)" }} />
        <h2 className="text-2xl font-bold mt-5" style={styles.title}>
          Delete this goal?
        </h2>
        <p className="mt-3 leading-7" style={styles.dim}>
          "{goalTitle}" and all its progress will be permanently removed. This can't be undone.
        </p>
        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl font-semibold"
            style={{ border: "1px solid var(--color-line-strong)", color: "var(--color-ink)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-xl font-semibold"
            style={{ background: "var(--color-danger)", color: "#fff" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================
        ROADMAP NODE (Game level badge)
================================ */

function JourneyNode({ month, goalId, icon, alignRight, onLockedClick }) {
  const completed = month.status === "completed";
  const current = month.status === "current";
  const locked = month.status === "locked";

  const statusText = completed
    ? "✓ Completed"
    : current
    ? "▶ Current Mission"
    : "🔒 Locked";

  const ringColor = current
    ? "var(--color-primary)"
    : completed
    ? "var(--color-success)"
    : "var(--color-line-strong)";

  const badge = (
    <div
      className={`relative w-24 h-24 rounded-full flex items-center justify-center text-4xl shrink-0 ${
        current ? "node-current-ring node-float" : ""
      }`}
      style={{
        background: completed
          ? "linear-gradient(135deg, var(--color-success), var(--color-bg-elev2))"
          : current
          ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"
          : "var(--color-bg-elev2)",
        border: `3px solid ${ringColor}`,
        filter: locked ? "grayscale(0.6)" : "none",
      }}
    >
      <span style={{ opacity: locked ? 0.5 : 1 }}>{icon}</span>

      {/* level number ribbon */}
      <div
        className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: "var(--color-bg-elev)",
          border: "1px solid var(--color-line-strong)",
          color: "var(--color-ink)",
        }}
      >
        {month.index}
      </div>

      {completed && (
        <div className="absolute -bottom-1 -right-1 text-xl">🏅</div>
      )}
      {locked && <div className="absolute -bottom-1 -right-1 text-xl">⛓</div>}
    </div>
  );

  const card = (
    <div
      className="w-[300px] rounded-[28px] p-5 flex items-center gap-4 transition hover:scale-[1.03]"
      style={{
        ...styles.card,
        border: current
          ? "1px solid var(--color-primary)"
          : completed
          ? "1px solid var(--color-success)"
          : "1px solid var(--color-line)",
        opacity: locked ? 0.6 : 1,
        boxShadow: current
          ? "0 0 40px rgba(255,138,61,.35)"
          : completed
          ? "0 0 20px rgba(49,208,170,.18)"
          : "none",
      }}
    >
      {badge}

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[.2em]" style={styles.dim}>
          Month {month.index}
        </p>
        <h3
          className="mt-1 text-lg font-bold truncate"
          style={styles.title}
          title={month.title}
        >
          {month.title}
        </h3>
        <div
          className="mt-2 text-sm font-semibold"
          style={{
            color: completed
              ? "var(--color-success)"
              : current
              ? "var(--color-primary)"
              : "var(--color-ink-dim)",
          }}
        >
          {statusText}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex ${alignRight ? "justify-end" : "justify-start"}`}>
      {locked ? (
        <button onClick={() => onLockedClick(month)}>{card}</button>
      ) : (
        <Link to={`/goals/${goalId}/month/${month.index}`}>{card}</Link>
      )}
    </div>
  );
}

/* ===============================
        MAIN PAGE
================================ */

export default function GoalDetails() {
  const { goalId } = useParams();
  const { goals, loading, generateRoadmap, deleteGoal } = useContext(GoalContext);
  const navigate = useNavigate();

  const [generating, setGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  

  if (loading)
    return (
      <div
        className="flex items-center justify-center py-24"
        style={styles.dim}
      >
        Loading...
      </div>
    );

  const goal = goals.find((g) => String(g.id) === goalId);

  if (!goal)
    return (
      <div className="flex items-center justify-center py-24">
        Goal Not Found
      </div>
    );

  function handleDelete() {
  setConfirmingDelete(true);
}

async function confirmDelete() {
  await deleteGoal(goal.id);
  navigate("/dashboard");
}

  async function handleGenerate() {
    setGenerating(true);
    await generateRoadmap(goal);
    setGenerating(false);
  }

  // ================= DRAFT VIEW =================
  // Drafts don't get a roadmap yet — show the saved specification
  // and let the person finish editing it or delete it.
if (goal.status === "draft") {
    const specRows = [
      ["Category", goal.category],
      ["Experience Level", goal.experience_level],
      ["Timeline", goal.timeline],
      ["Weekly Study Hours", goal.study_hours],
      ["Priority", goal.priority],
      ["Learning Style", (goal.learning_style || []).join(", ") || "—"],
    ];

    const aiOptionLabels = {
      includeResources: "Learning Resources",
      includeProjects: "Practice Projects",
      weeklyPlanner: "Weekly Planner",
      habitTracker: "Habit Tracker",
    };
    const selectedAiOptions = Object.entries(goal.ai_options || {})
      .filter(([, v]) => v)
      .map(([k]) => aiOptionLabels[k] || k);

    return (
      <>
       <ConfirmDeleteModal
      goalTitle={confirmingDelete ? goal.title : null}
      onCancel={() => setConfirmingDelete(false)}
      onConfirm={confirmDelete}
    />
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-[36px] p-10"
          style={{
            ...styles.card,
            background: `radial-gradient( <ConfirmDeleteModal
      goalTitle={confirmingDelete ? goal.title : null}
      onCancel={() => setConfirmingDelete(false)}
      onConfirm={confirmDelete}
    />circle at top right, rgba(255,138,61,.12), transparent 35%), var(--color-bg-elev)`,
          }}
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs mb-6"
            style={{ background: "rgba(255,138,61,.12)", color: "var(--color-primary)" }}
          >
            <FileEdit size={13} /> Draft — not started yet
          </span>

          <h1 className="text-4xl font-bold mb-3" style={styles.title}>
            {goal.title || "Untitled goal"}
          </h1>

          {goal.description && (
            <p className="mb-8 leading-8" style={styles.dim}>
              {goal.description}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {specRows.map(([label, value]) => (
              <div key={label} className="rounded-2xl px-5 py-4" style={styles.box}>
                <div className="text-xs uppercase" style={styles.dim}>
                  {label}
                </div>
                <div className="font-semibold mt-1">{value || "—"}</div>
              </div>
            ))}
          </div>

          {goal.motivation && (
            <div className="rounded-2xl px-5 py-4 mb-6" style={styles.box}>
              <div className="text-xs uppercase" style={styles.dim}>
                Motivation
              </div>
              <div className="mt-1 leading-7">{goal.motivation}</div>
            </div>
          )}

          {selectedAiOptions.length > 0 && (
            <div className="rounded-2xl px-5 py-4 mb-8" style={styles.box}>
              <div className="text-xs uppercase mb-2" style={styles.dim}>
                AI Preferences
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAiOptions.map((label) => (
                  <span
                    key={label}
                    className="text-xs rounded-full px-3 py-1.5"
                    style={{ background: "rgba(255,138,61,.12)", color: "var(--color-primary)" }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/create-goal/${goal.id}`}
              className="flex-1 text-center px-8 py-4 rounded-2xl font-semibold inline-flex items-center justify-center gap-2"
              style={styles.button}
            >
              <FileEdit size={16} /> Edit & Finish Setup
            </Link>
            <button
              onClick={handleDelete}
              className="px-8 py-4 rounded-2xl font-semibold inline-flex items-center justify-center gap-2"
              style={{ border: "1px solid var(--color-danger)", color: "var(--color-danger)" }}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }
const months = goal.roadmap?.months || [];

  const currentMonth = months.find((m) => m.status === "current");

  const progressData = months.reduce(
    (data, month) => {
      const days = month.detail?.days || [];
      data.total += days.length || 30;
      days.forEach((day) => {
        if (day.completed) data.done++;
      });
      return data;
    },
    { total: 0, done: 0 }
  );

  const percentage = progressData.total
    ? Math.round((progressData.done / progressData.total) * 100)
    : 0;

  return (
    <>
      <GameStyles />

      <LockedModal month={selectedMonth} onClose={() => setSelectedMonth(null)} />
        <ConfirmDeleteModal
  goalTitle={confirmingDelete ? goal.title : null}
  onCancel={() => setConfirmingDelete(false)}
  onConfirm={confirmDelete}
/>

      <div className="max-w-7xl mx-auto">
          {/* ================= HERO ================= */}
          <section
            className="rounded-[36px] p-10 mb-10"
            style={{
              ...styles.card,
              background: `radial-gradient(circle at top right, rgba(255,138,61,.18), transparent 35%), var(--color-bg-elev)`,
            }}
          >
            <div className="grid lg:grid-cols-[1.6fr_.8fr] gap-10">
              <div>
                <span
                  className="inline-flex rounded-full px-4 py-2 text-xs"
                  style={{ background: "rgba(255,138,61,.12)", color: "var(--color-primary)" }}
                >
                  {goal.category || "AI Goal"}
                </span>

                <h1 className="text-5xl lg:text-6xl font-bold mt-6" style={styles.title}>
                  {goal.title}
                </h1>

                <p className="mt-6 leading-8 max-w-3xl" style={styles.dim}>
                  {goal.description}
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <InfoBox title="Progress" value={`${percentage}%`} />
                  <InfoBox title="Current Mission" value={currentMonth?.title || "Not Started"} />
                  <InfoBox title="Timeline" value={goal.timeline} />
                </div>

                {goal.roadmap ? (
                  <Link
                    to={`/goals/${goal.id}/month/${currentMonth?.index || 1}`}
                    className="inline-block mt-8 px-8 py-4 rounded-2xl font-semibold"
                    style={styles.button}
                  >
                    Continue Journey →
                  </Link>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="mt-8 px-8 py-4 rounded-2xl font-semibold"
                    style={styles.button}
                  >
                    {generating ? "Generating..." : "Generate AI Roadmap"}
                  </button>
                )}
              </div>

              <div className="flex justify-center items-center">
                <ProgressCircle value={percentage} />
              </div>
            </div>
          </section>

          {/* ================= ROADMAP ================= */}
          {goal.roadmap && (
            <section className="rounded-[36px] p-8" style={styles.card}>
              <h2 className="text-4xl font-bold" style={styles.title}>
                Your Journey
              </h2>
              <p className="mt-3" style={styles.dim}>
                Complete each milestone to unlock the next chapter.
              </p>

              <div className="flex flex-col mt-12">
                <div className="flex justify-center mb-4">
                  <div
                    className="px-8 py-5 rounded-[30px] font-bold inline-flex items-center gap-2"
                    style={{ ...styles.box, color: "var(--color-primary)" }}
                  >
                    <Rocket size={18} /> START JOURNEY
                  </div>
                </div>

                {months.map((month, index) => (
                  <div key={month.index}>
                    {index !== 0 && <PathConnector flip={index % 2 !== 0} />}
                    <JourneyNode
                      month={month}
                      goalId={goal.id}
                      icon={BIOMES[index % BIOMES.length]}
                      alignRight={index % 2 !== 0}
                      onLockedClick={setSelectedMonth}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-16">
                <div
                  className="rounded-[36px] px-12 py-10 text-center"
                  style={{
                    background:
                      "linear-gradient(135deg,var(--color-primary),rgba(255,138,61,.15))",
                    color: "#111",
                  }}
                >
                  <div className="flex justify-center"><Trophy size={56} /></div>
                  <h3 className="text-2xl font-bold">FINAL GOAL</h3>
                  <p className="mt-2">{goal.title}</p>
                </div>
              </div>
            </section>
          )}

          {/* =============== MISSION / COACH / ACTIONS =============== */}
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {currentMonth && (
              <section className="rounded-3xl p-5" style={styles.card}>
                <p
                  className="uppercase text-[11px] tracking-[.15em]"
                  style={{ color: "var(--color-primary)" }}
                >
                  Current Mission
                </p>
                <h3 className="text-lg font-bold mt-2 truncate" style={styles.title}>
                  {currentMonth.title}
                </h3>
                <Link
                  to={`/goals/${goal.id}/month/${currentMonth.index}`}
                  className="inline-block mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={styles.button}
                >
                  Open Month →
                </Link>
              </section>
            )}

            <section className="rounded-3xl p-5" style={styles.card}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-bg-elev2)" }}>
                  <Bot size={20} style={{ color: "var(--color-primary)" }} />
                </div>
                <h3 className="text-lg font-bold" style={styles.title}>
                  AI Coach
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6" style={styles.dim}>
                Stay consistent and complete your current milestone before moving forward.
              </p>
            </section>

            <section className="rounded-3xl p-5 flex flex-col justify-center gap-3" style={styles.card}>
              <Link
                to={`/create-goal/${goal.id}`}
                className="w-full text-center px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-1.5"
                style={styles.button}
              >
                <FileEdit size={14} /> Edit Goal
              </Link>
              <button
                onClick={handleDelete}
                className="w-full text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                style={{ border: "1px solid var(--color-danger)", color: "var(--color-danger)" }}
              >
                <Trash2 size={13} /> Delete Goal
              </button>
            </section>
          </div>
      </div>
    </>
  );
}


function InfoBox({ title, value }) {
  return (
    <div className="rounded-2xl px-5 py-4" style={styles.box}>
      <div className="text-xs uppercase" style={styles.dim}>
        {title}
      </div>
      <div className="font-bold text-xl mt-1">{value}</div>
    </div>
  );
}
