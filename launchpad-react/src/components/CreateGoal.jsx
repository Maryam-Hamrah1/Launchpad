import { useContext, useState } from "react";
import { GoalContext } from "./GoalContext";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const initialForm = {
  goalTitle: "",
  goalCategory: "",
  goalDescription: "",
  experienceLevel: "",
  timeline: "",
  studyHours: "",
  learningStyle: [],
  goalPriority: "",
  motivation: "",
  aiOptions: {
    includeResources: false,
    includeProjects: false,
    weeklyPlanner: false,
    habitTracker: false,
  },
};

const REQUIRED_FIELDS = [
  { key: "goalTitle", label: "Goal title" },
  { key: "goalCategory", label: "Category" },
  { key: "goalDescription", label: "Goal description" },
  { key: "experienceLevel", label: "Experience level" },
  { key: "timeline", label: "Timeline" },
  { key: "studyHours", label: "Weekly study hours" },
  { key: "goalPriority", label: "Goal priority" },
  { key: "motivation", label: "Motivation" },
];

function validate(values) {
  const errors = {};
  REQUIRED_FIELDS.forEach(({ key, label }) => {
    if (!values[key] || !values[key].toString().trim()) {
      errors[key] = `${label} is required`;
    }
  });
  return errors;
}

const cardStyle = {
  background: "var(--color-bg-elev)",
  border: "1px solid var(--color-line)",
  boxShadow: "var(--shadow-card)",
};

const dimStyle = { color: "var(--color-ink-dim)" };
const headingFont = { fontFamily: "'Space Grotesk', sans-serif" };

function fieldStyle(hasError) {
  return {
    background: "var(--color-bg)",
    color: "var(--color-ink)",
    border: `1px solid ${hasError ? "var(--color-danger)" : "var(--color-line)"}`,
  };
}

const fieldClass =
  "w-full rounded-2xl px-5 py-4 text-sm placeholder-[color:var(--color-ink-dim)] transition-all focus:outline-none";

function pillStyle(active, accent = "primary") {
  const colorVar = `var(--color-${accent})`;
  return {
    borderColor: active ? colorVar : "var(--color-line)",
    background: active ? `color-mix(in srgb, ${colorVar} 12%, transparent)` : "var(--color-bg)",
    color: active ? colorVar : "var(--color-ink-dim)",
  };
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{
          background: "color-mix(in srgb, var(--color-primary) 14%, transparent)",
        }}
      >
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold" style={{ ...headingFont, color: "var(--color-ink)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-1" style={dimStyle}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function CreateGoal() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMode, setSubmitMode] = useState(null);

  const { createGoal, saveDraft, generateRoadmap } = useContext(GoalContext);
  const navigate = useNavigate();

  function handlechange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  }

  function handleCheckboxChange(e) {
    const { name, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      aiOptions: {
        ...prev.aiOptions,
        [name]: checked,
      },
    }));
  }

  function handleLearningStyleChange(e) {
    const { value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      learningStyle: checked
        ? [...prev.learningStyle, value]
        : prev.learningStyle.filter((item) => item !== value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitMode("goal");
    setIsSubmitting(true);

    const goal = await createGoal(form);

    if (!goal) {
      setIsSubmitting(false);
      return;
    }

    await generateRoadmap(goal);

    setForm(initialForm);
    navigate(`/goals/${goal.id}`);
  }

  async function handleSaveDraft() {
    setSubmitMode("draft");
    setIsSubmitting(true);

    const draft = await saveDraft(form);

    if (!draft) {
      setIsSubmitting(false);
      return;
    }

    navigate("/dashboard");
  }

  function handleCancel() {
    setForm(initialForm);
    setErrors({});
    navigate("/dashboard");
  }

  if (isSubmitting) {
    return <LoadingScreen mode={submitMode} />;
  }

  return (
    <div
      className="min-h-screen px-5 py-10 relative overflow-hidden"
      style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}
    >
      {/* ambient glow, theme-aware */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl -top-40 -left-40 pointer-events-none"
        style={{ background: "color-mix(in srgb, var(--color-primary) 12%, transparent)" }}
      />
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl -bottom-40 -right-40 pointer-events-none"
        style={{ background: "color-mix(in srgb, var(--color-accent) 10%, transparent)" }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Logo */}
        <div
          className="flex justify-center items-center gap-2.5 font-bold text-[25px] px-2 mb-7"
          style={{ ...headingFont, color: "var(--color-ink)" }}
        >
          <svg className="w-10 h-10" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="12.5" stroke="var(--color-primary)" strokeWidth="1.3" />
            <path d="M15 7 L15 23 M7 15 L23 15" stroke="var(--color-line-strong)" strokeWidth="1" />
            <circle cx="15" cy="15" r="2.6" fill="var(--color-primary)" />
          </svg>
          Launchpad
        </div>

        <div style={{ borderBottom: "1px solid var(--color-line)" }} />

        {/* Intro */}
        <section className="mb-12 mt-10 text-center">
          <span
            className="inline-flex rounded-full px-4 py-1.5 text-xs font-semibold mb-4"
            style={{
              background: "color-mix(in srgb, var(--color-primary) 14%, transparent)",
              color: "var(--color-primary)",
            }}
          >
            ✨ AI-Powered Roadmap
          </span>

          <h1
            className="text-4xl font-bold leading-tight mb-4"
            style={headingFont}
          >
            Turn your dreams into a{" "}
            <span style={{ color: "var(--color-primary)" }}>roadmap</span>
          </h1>

          <p className="text-sm leading-relaxed max-w-xl mx-auto" style={dimStyle}>
            Describe your goal and Launchpad AI will transform it into a
            personalized journey with clear steps, milestones, and guidance.
          </p>
        </section>

        <form onSubmit={handleSubmit} noValidate>
          {Object.keys(errors).length > 0 && (
            <div
              className="mb-6 rounded-2xl px-5 py-4 border"
              style={{
                borderColor: "var(--color-danger)",
                background: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
              }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-danger)" }}>
                Please complete the highlighted fields:
              </p>
              <ul className="text-sm space-y-1" style={{ color: "var(--color-danger)" }}>
                {Object.values(errors).map((msg, i) => (
                  <li key={i}>• {msg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Goal Information */}
          <section className="rounded-3xl p-7 mb-5" style={cardStyle}>
            <SectionHeader
              icon="🎯"
              title="Goal Information"
              subtitle="Start by describing what you want to achieve."
            />

            <div className="mb-5">
              <label className="block text-xs font-mono mb-2" style={dimStyle}>
                What is your goal?
              </label>
              <input
                type="text"
                name="goalTitle"
                value={form.goalTitle}
                onChange={handlechange}
                placeholder="Become a Full Stack Developer"
                className={fieldClass}
                style={fieldStyle(errors.goalTitle)}
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-mono mb-2" style={dimStyle}>
                Category
              </label>
              <select
                name="goalCategory"
                value={form.goalCategory}
                onChange={handlechange}
                className={fieldClass}
                style={fieldStyle(errors.goalCategory)}
              >
                <option value="">Select category</option>
                <option>Software Development</option>
                <option>AI & Machine Learning</option>
                <option>UI & UX Design</option>
                <option>Cybersecurity</option>
                <option>Data Science</option>
                <option>Business</option>
                <option>Marketing</option>
                <option>Languages</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono mb-2" style={dimStyle}>
                Goal Description
              </label>
              <textarea
                name="goalDescription"
                rows="4"
                value={form.goalDescription}
                onChange={handlechange}
                placeholder="Describe your goal..."
                className={fieldClass}
                style={fieldStyle(errors.goalDescription)}
              />
            </div>
          </section>

          {/* Experience Level */}
          <section className="rounded-3xl p-7 mb-5" style={cardStyle}>
            <SectionHeader
              icon="📈"
              title="Experience Level"
              subtitle="Where are you starting from?"
            />

            <div
              className="grid grid-cols-3 gap-3"
              style={
                errors.experienceLevel
                  ? { outline: `1px solid var(--color-danger)`, borderRadius: "12px", padding: "4px" }
                  : undefined
              }
            >
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <label
                  key={level}
                  className="cursor-pointer rounded-xl px-4 py-4 text-center text-sm border transition"
                  style={pillStyle(form.experienceLevel === level, "primary")}
                >
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level}
                    checked={form.experienceLevel === level}
                    onChange={handlechange}
                    className="hidden"
                  />
                  {level}
                </label>
              ))}
            </div>
          </section>

          {/* Timeline + Study Hours */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <section className="rounded-3xl p-7" style={cardStyle}>
              <SectionHeader icon="🗓" title="Timeline" />
              <select
                name="timeline"
                value={form.timeline}
                onChange={handlechange}
                className={fieldClass}
                style={fieldStyle(errors.timeline)}
              >
                <option value="">Select timeline</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>9 Months</option>
                <option>12 Months</option>
                <option>18 Months</option>
              </select>
            </section>

            <section className="rounded-3xl p-7" style={cardStyle}>
              <SectionHeader icon="⏱" title="Weekly Study Hours" />
              <select
                name="studyHours"
                value={form.studyHours}
                onChange={handlechange}
                className={fieldClass}
                style={fieldStyle(errors.studyHours)}
              >
                <option value="">Select hours</option>
                <option>5 Hours</option>
                <option>10 Hours</option>
                <option>15 Hours</option>
                <option>20 Hours</option>
                <option>30+ Hours</option>
              </select>
            </section>
          </div>

          {/* Learning Style */}
          <section className="rounded-3xl p-7 mb-5" style={cardStyle}>
            <SectionHeader
              icon="🧠"
              title="Preferred Learning Style"
              subtitle="Choose how you prefer to learn."
            />

            <div className="grid grid-cols-2 gap-3">
              {["Video Courses", "Books", "Documentation", "Hands-on Project"].map((style) => (
                <label
                  key={style}
                  className="cursor-pointer rounded-xl px-4 py-4 text-sm border transition"
                  style={pillStyle(form.learningStyle.includes(style), "success")}
                >
                  <input
                    type="checkbox"
                    name="learningStyle"
                    value={style}
                    checked={form.learningStyle.includes(style)}
                    onChange={handleLearningStyleChange}
                    className="hidden"
                  />
                  {style}
                </label>
              ))}
            </div>
          </section>

          {/* Goal Priority */}
          <section className="rounded-3xl p-7 mb-5" style={cardStyle}>
            <SectionHeader icon="🚩" title="Goal Priority" />
            <select
              name="goalPriority"
              value={form.goalPriority}
              onChange={handlechange}
              className={fieldClass}
              style={fieldStyle(errors.goalPriority)}
            >
              <option value="">Select priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </section>

          {/* Motivation */}
          <section className="rounded-3xl p-7 mb-5" style={cardStyle}>
            <SectionHeader icon="🔥" title="Motivation" subtitle="Why does this goal matter to you?" />
            <textarea
              name="motivation"
              rows="4"
              value={form.motivation}
              onChange={handlechange}
              placeholder="What's driving you toward this goal?"
              className={fieldClass}
              style={fieldStyle(errors.motivation)}
            />
          </section>

          {/* AI Preferences */}
          <section className="rounded-3xl p-7 mb-5" style={cardStyle}>
            <SectionHeader
              icon="🤖"
              title="AI Preferences"
              subtitle="Choose what your AI roadmap should include."
            />

            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "includeResources", label: "Learning Resources" },
                { key: "includeProjects", label: "Practice Projects" },
                { key: "weeklyPlanner", label: "Weekly Planner" },
                { key: "habitTracker", label: "Habit Tracker" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="cursor-pointer rounded-xl px-4 py-4 text-sm border transition"
                  style={pillStyle(form.aiOptions[item.key], "primary")}
                >
                  <input
                    type="checkbox"
                    name={item.key}
                    checked={form.aiOptions[item.key]}
                    onChange={handleCheckboxChange}
                    className="hidden"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </section>

          {/* Goal Preview */}
          <section className="rounded-3xl p-7 mb-6" style={cardStyle}>
            <SectionHeader
              icon="👁"
              title="Goal Preview"
              subtitle="Review your goal before creating your AI roadmap."
            />

            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "GOAL", value: form.goalTitle || "Not specified" },
                { label: "LEVEL", value: form.experienceLevel || "Not selected" },
                { label: "TIMELINE", value: form.timeline || "Not selected" },
                { label: "STUDY HOURS", value: form.studyHours || "Not selected" },
                { label: "PRIORITY", value: form.goalPriority || "Not selected" },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-xs font-mono" style={dimStyle}>
                    {item.label}
                  </span>
                  <p className="text-sm mt-1" style={{ color: "var(--color-ink)" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <section className="flex flex-col sm:flex-row gap-3 mb-10">
            <button
              type="submit"
              className="flex-1 rounded-full py-4 text-sm font-semibold transition hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
                color: "#111",
                boxShadow: "var(--shadow-card)",
              }}
            >
              🚀 Generate Roadmap
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 rounded-full py-4 text-sm font-semibold border transition"
              style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink)" }}
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full px-6 py-4 text-sm font-semibold transition"
              style={dimStyle}
            >
              Cancel
            </button>
          </section>
        </form>
      </div>
    </div>
  );
}

export default CreateGoal;
