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

// shared input styling — base + red border when that field has an error
function fieldClass(hasError) {
  return `w-full rounded-lg px-4 py-3 text-sm bg-[#1B2540] text-[#EDEFF6] placeholder-[#9AA5BD] border transition-colors focus:outline-none focus:border-[#F5B342] ${
    hasError ? "border-[#FF7A6B]" : "border-white/10"
  }`;
}

function CreateGoal() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMode, setSubmitMode] = useState(null);
  const {createGoal, saveDraft, generateRoadmap} = useContext(GoalContext)
  const navigate = useNavigate();

  function handlechange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear this field's error as soon as the person starts fixing it
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const { [name]: _removed, ...rest } = prev;
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
        : prev.learningStyle.filter((v) => v !== value),
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

  await generateRoadmap(goal); // if this fails, goal still exists — GoalDetails will offer a retry

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
      return <LoadingScreen mode={submitMode}/>;
    }

  return (
    
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <section className="mb-8">
          <span className="inline-block font-mono text-xs rounded-full px-3 py-1.5 mb-4 border border-white/20 text-[#F5B342]">
            NEW GOAL
          </span>
          <h1
            className="font-bold text-3xl mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Create New Goal
          </h1>
          <p className="text-sm text-[#9AA5BD]">
            Tell us about your goal and Launchpad AI will generate a
            personalized roadmap designed specifically for you.
          </p>
        </section>

        <form onSubmit={handleSubmit} noValidate>
          {/* Error summary */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 rounded-xl border border-[#FF7A6B] bg-[#FF7A6B]/10 px-5 py-4">
              <p className="text-sm font-semibold text-[#FF7A6B] mb-2">
                Please complete the highlighted fields:
              </p>
              <ul className="text-sm text-[#FF7A6B] list-disc list-inside space-y-1">
                {Object.values(errors).map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Goal Information */}
          <section className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-5">
            <h2
              className="font-semibold text-lg mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Goal Information
            </h2>

            <div className="mb-4">
              <label
                htmlFor="goalTitle"
                className="block text-xs font-mono text-[#9AA5BD] mb-2"
              >
                What is your goal?
              </label>
              <input
                type="text"
                id="goalTitle"
                name="goalTitle"
                value={form.goalTitle}
                onChange={handlechange}
                placeholder="Become a Full Stack Developer"
                className={fieldClass(errors.goalTitle)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="goalCategory"
                className="block text-xs font-mono text-[#9AA5BD] mb-2"
              >
                Category
              </label>
              <select
                name="goalCategory"
                id="goalCategory"
                value={form.goalCategory}
                onChange={handlechange}
                className={fieldClass(errors.goalCategory)}
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
              <label
                htmlFor="goalDescription"
                className="block text-xs font-mono text-[#9AA5BD] mb-2"
              >
                Goal Description
              </label>
              <textarea
                name="goalDescription"
                id="goalDescription"
                rows="4"
                value={form.goalDescription}
                onChange={handlechange}
                placeholder="Describe your goal..."
                className={fieldClass(errors.goalDescription)}
              />
            </div>
          </section>

          {/* Experience Level */}
          <section className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-5">
            <h2
              className="font-semibold text-lg mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Experience Level
            </h2>
            <p className="text-xs text-[#9AA5BD] mb-4">
              Where are you starting from?
            </p>
            <div
              className={`grid grid-cols-3 gap-3 rounded-lg ${errors.experienceLevel ? "ring-1 ring-[#FF7A6B] p-1" : ""}`}
            >
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <label
                  key={level}
                  className={`cursor-pointer text-center text-sm rounded-lg px-3 py-3 border transition-colors ${
                    form.experienceLevel === level
                      ? "border-[#F5B342] bg-[#F5B342]/10 text-[#F5B342]"
                      : "border-white/10 text-[#9AA5BD] hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level}
                    checked={form.experienceLevel === level}
                    onChange={handlechange}
                    className="sr-only"
                  />
                  {level}
                </label>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-5">
            <h2
              className="font-semibold text-lg mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Timeline
            </h2>
            <select
              name="timeline"
              id="timeline"
              value={form.timeline}
              onChange={handlechange}
              className={fieldClass(errors.timeline)}
            >
              <option value="">Select timeline</option>
              <option>3 Months</option>
              <option>6 Months</option>
              <option>9 Months</option>
              <option>12 Months</option>
              <option>18 Months</option>
            </select>
          </section>

          {/* Weekly Study Hours */}
          <section className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-5">
            <h2
              className="font-semibold text-lg mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Weekly Study Hours
            </h2>
            <select
              name="studyHours"
              id="studyHours"
              value={form.studyHours}
              onChange={handlechange}
              className={fieldClass(errors.studyHours)}
            >
              <option value="">Select hours</option>
              <option>5 Hours</option>
              <option>10 Hours</option>
              <option>15 Hours</option>
              <option>20 Hours</option>
              <option>30+ Hours</option>
            </select>
          </section>

          {/* Learning Style */}
          <section className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-5">
            <h2
              className="font-semibold text-lg mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Preferred Learning Style
            </h2>
            <p className="text-xs text-[#9AA5BD] mb-4">
              Pick as many as you like — this shapes how resources are
              recommended.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Video Courses",
                "Books",
                "Documentation",
                "Hands-on Project",
              ].map((style) => (
                <label
                  key={style}
                  className={`cursor-pointer text-sm rounded-lg px-3 py-3 border transition-colors ${
                    form.learningStyle.includes(style)
                      ? "border-[#5EEAD4] bg-[#5EEAD4]/10 text-[#5EEAD4]"
                      : "border-white/10 text-[#9AA5BD] hover:border-white/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="learningStyle"
                    value={style}
                    checked={form.learningStyle.includes(style)}
                    onChange={handleLearningStyleChange}
                    className="sr-only"
                  />
                  {style}
                </label>
              ))}
            </div>
          </section>

          {/* Priority */}
          <section className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-5">
            <h2
              className="font-semibold text-lg mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Goal Priority
            </h2>
            <select
              name="goalPriority"
              id="goalPriority"
              value={form.goalPriority}
              onChange={handlechange}
              className={fieldClass(errors.goalPriority)}
            >
              <option value="">Select priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </section>

          {/* Motivation */}
          <section className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-5">
            <h2
              className="font-semibold text-lg mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Motivation
            </h2>
            <p className="text-xs text-[#9AA5BD] mb-4">
              Why do you want to achieve this goal? This helps Launchpad tailor
              guidance along the way.
            </p>
            <textarea
              name="motivation"
              id="motivation"
              rows="4"
              value={form.motivation}
              onChange={handlechange}
              placeholder="What's driving you toward this goal?"
              className={fieldClass(errors.motivation)}
            />
          </section>

          {/* AI Preferences */}
          <section className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-5">
            <h2
              className="font-semibold text-lg mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              AI Preferences
            </h2>
            <p className="text-xs text-[#9AA5BD] mb-4">
              Choose what you'd like your AI roadmap to include.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  key: "includeResources",
                  label: "Include Learning Resources",
                },
                { key: "includeProjects", label: "Include Practice Projects" },
                { key: "weeklyPlanner", label: "Generate Weekly Planner" },
                { key: "habitTracker", label: "Generate Habit Tracker" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className={`cursor-pointer text-sm rounded-lg px-3 py-3 border transition-colors ${
                    form.aiOptions[key]
                      ? "border-[#F5B342] bg-[#F5B342]/10 text-[#F5B342]"
                      : "border-white/10 text-[#9AA5BD] hover:border-white/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={key}
                    id={key}
                    checked={form.aiOptions[key]}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>

          {/* Goal Preview */}
          <section className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-5">
            <h2
              className="font-semibold text-lg mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Goal Preview
            </h2>
            <p className="text-xs text-[#9AA5BD] mb-4">
              Review your goal before generating your personalized AI roadmap.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-mono text-[#9AA5BD] mb-1">Goal</h3>
                <p className="text-sm">{form.goalTitle || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-[#9AA5BD] mb-1">
                  Experience Level
                </h3>
                <p className="text-sm">
                  {form.experienceLevel || "Not selected"}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-[#9AA5BD] mb-1">
                  Timeline
                </h3>
                <p className="text-sm">{form.timeline || "Not selected"}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-[#9AA5BD] mb-1">
                  Weekly Study Hours
                </h3>
                <p className="text-sm">{form.studyHours || "Not selected"}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-[#9AA5BD] mb-1">
                  Priority
                </h3>
                <p className="text-sm">{form.goalPriority || "Not selected"}</p>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 rounded-full px-6 py-3.5 text-sm font-semibold bg-[#F5B342] text-[#1A1305] hover:brightness-110 transition"
            >
              Generate Roadmap
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 rounded-full px-6 py-3.5 text-sm font-semibold border border-white/20 hover:border-[#F5B342] transition"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full px-6 py-3.5 text-sm font-semibold text-[#9AA5BD] hover:text-[#EDEFF6] transition"
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
