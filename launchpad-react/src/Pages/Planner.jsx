import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";

const cardStyle = {
  background: "var(--color-bg-elev)",
  border: "1px solid var(--color-line)",
  boxShadow: "var(--shadow-card)",
};
const dimStyle = { color: "var(--color-ink-dim)" };
const headingFont = { fontFamily: "'Space Grotesk', sans-serif" };

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem("planner-notes") || "{}");
  } catch {
    return {};
  }
}

function saveNotes(notes) {
  localStorage.setItem("planner-notes", JSON.stringify(notes));
}

/* ===============================
        GOAL CARD (today's mission)
================================ */

function GoalPlannerCard({ goal, toggleDayTask }) {
  if (!goal.roadmap) {
    return (
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h3 className="font-semibold text-base mb-2" style={headingFont}>
          {goal.title}
        </h3>
        <p className="text-sm mb-3" style={dimStyle}>
          No roadmap generated yet.
        </p>
        <Link to={`/goals/${goal.id}`} className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
          Go to Goal →
        </Link>
      </div>
    );
  }

  const month = goal.roadmap.months.find((m) => m.status === "current");

  if (!month?.detail) {
    return (
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h3 className="font-semibold text-base mb-2" style={headingFont}>
          {goal.title}
        </h3>
        <p className="text-sm mb-3" style={dimStyle}>
          Month {month?.index} hasn't been planned yet.
        </p>
        <Link
          to={`/goals/${goal.id}/month/${month?.index}`}
          className="text-sm font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          Plan This Month →
        </Link>
      </div>
    );
  }

  const days = month.detail.days || [];
  const day = days.find((d) => !d.completed);
  const dayLink = `/goals/${goal.id}/month/${month.index}/day/${day?.index}`;

  if (!day) {
    return (
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h3 className="font-semibold text-base mb-2" style={headingFont}>
          {goal.title}
        </h3>
        <p className="text-sm" style={{ color: "var(--color-success)" }}>
          🏆 All days completed for this month!
        </p>
      </div>
    );
  }

  if (!day.detail) {
    return (
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex justify-between items-start mb-1 gap-3">
          <h3 className="font-semibold text-base" style={headingFont}>
            {goal.title}
          </h3>
          <span className="font-mono text-[10px] flex-shrink-0" style={dimStyle}>
            Month {month.index} · Day {day.index}
          </span>
        </div>
        <p className="text-sm mb-3" style={dimStyle}>
          Today's mission hasn't been generated yet.
        </p>
        <Link to={dayLink} className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
          Generate Today's Tasks →
        </Link>
      </div>
    );
  }

  const doneCount = day.detail.tasks.filter((t) => t.done).length;
  const totalCount = day.detail.tasks.length;

  return (
    <div className="rounded-2xl p-6" style={cardStyle}>
      <div className="flex justify-between items-start mb-1 gap-3">
        <h3 className="font-semibold text-base" style={headingFont}>
          {goal.title}
        </h3>
        <span
          className="font-mono text-[10px] flex-shrink-0 rounded-full px-2 py-1"
          style={{
            color: "var(--color-primary)",
            background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
          }}
        >
          Day {day.index} · {doneCount}/{totalCount}
        </span>
      </div>
      <p className="text-xs mb-4" style={dimStyle}>
        {day.detail.title || month.title}
      </p>

      <div className="flex flex-col gap-1.5 mb-3">
        {day.detail.tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggleDayTask(goal, month.index, day.index, task.id)}
            className="flex items-center gap-3 text-left rounded-lg px-2 py-1.5 transition"
          >
            <span
              className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center text-[10px]"
              style={
                task.done
                  ? { background: "var(--color-success)", color: "var(--color-bg)" }
                  : { border: "1px solid var(--color-line-strong)" }
              }
            >
              {task.done ? "✓" : ""}
            </span>
            <span
              className="text-sm"
              style={
                task.done
                  ? { color: "var(--color-ink-dim)", textDecoration: "line-through" }
                  : { color: "var(--color-ink)" }
              }
            >
              {task.task}
            </span>
          </button>
        ))}
      </div>
      <Link to={dayLink} className="text-xs font-semibold" style={dimStyle}>
        Open full day view →
      </Link>
    </div>
  );
}

/* ===============================
        MINI CALENDAR
================================ */

function MiniCalendar({ selectedDate, onSelect, notes }) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayKey = dateKey(new Date());
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function changeMonth(delta) {
    setViewDate(new Date(year, month + delta, 1));
  }

  return (
    <div className="rounded-2xl p-6" style={cardStyle}>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ border: "1px solid var(--color-line)", color: "var(--color-ink)" }}
        >
          ‹
        </button>
        <h2 className="font-semibold text-sm" style={headingFont}>
          {monthLabel}
        </h2>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ border: "1px solid var(--color-line)", color: "var(--color-ink)" }}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-mono" style={dimStyle}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const cellDate = new Date(year, month, d);
          const key = dateKey(cellDate);
          const isSelected = key === dateKey(selectedDate);
          const isToday = key === todayKey;
          const hasNote = Boolean(notes[key]);

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(cellDate)}
              className="relative aspect-square rounded-lg text-xs flex items-center justify-center transition"
              style={{
                background: isSelected
                  ? "var(--color-primary)"
                  : isToday
                  ? "color-mix(in srgb, var(--color-primary) 14%, transparent)"
                  : "transparent",
                color: isSelected ? "#111" : "var(--color-ink)",
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {d}
              {hasNote && !isSelected && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ background: "var(--color-accent)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ===============================
        NOTE PANEL (for selected date)
================================ */

function NotePanel({ selectedDate, notes, onSave }) {
  const key = dateKey(selectedDate);
  const [draft, setDraft] = useState(notes[key] || "");

  useEffect(() => {
    setDraft(notes[key] || "");
  }, [key]);

  const label = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl p-6" style={cardStyle}>
      <h2 className="font-semibold text-sm mb-1" style={headingFont}>
        📝 Notes — {label}
      </h2>
      <p className="text-xs mb-3" style={dimStyle}>
        Jot down anything for this day.
      </p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => onSave(key, draft)}
        rows={5}
        placeholder="Write a note for this day..."
        className="w-full rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none"
        style={{
          background: "var(--color-bg)",
          color: "var(--color-ink)",
          border: "1px solid var(--color-line)",
        }}
      />
    </div>
  );
}

/* ===============================
        MAIN PAGE
================================ */

export default function Planner() {
  const { goals, loading, toggleDayTask } = useContext(GoalContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState({});

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  function handleSaveNote(key, text) {
    setNotes((prev) => {
      const updated = { ...prev };
      if (text.trim()) {
        updated[key] = text;
      } else {
        delete updated[key];
      }
      saveNotes(updated);
      return updated;
    });
  }

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

  const activeGoals = goals.filter((g) => g.status === "active");

  return (
    <div className="min-h-screen py-12 px-5" style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span
            className="inline-block font-mono text-xs rounded-full px-3 py-1.5 mb-3"
            style={{
              border: "1px solid var(--color-line-strong)",
              color: "var(--color-primary)",
            }}
          >
            📅 PLANNER
          </span>
          <h1 className="font-bold text-3xl" style={headingFont}>
            Today & Your Calendar
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          {/* Left: goal missions */}
          <div className="flex flex-col gap-4">
            {activeGoals.length === 0 ? (
              <div className="rounded-2xl p-6" style={cardStyle}>
                <p className="text-sm" style={dimStyle}>
                  No active goals yet.
                </p>
              </div>
            ) : (
              activeGoals.map((g) => (
                <GoalPlannerCard key={g.id} goal={g} toggleDayTask={toggleDayTask} />
              ))
            )}
          </div>

          {/* Right: calendar + notes */}
          <div className="flex flex-col gap-4">
            <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate} notes={notes} />
            <NotePanel selectedDate={selectedDate} notes={notes} onSave={handleSaveNote} />
          </div>
        </div>
      </div>
    </div>
  );
}
