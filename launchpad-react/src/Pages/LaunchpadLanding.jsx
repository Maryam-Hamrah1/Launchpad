import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../components/ThemeContext";

const FEATURES = [
  { icon: "🎯", title: "Goal Creation", desc: "Set a goal in plain language — Launchpad structures it into a full plan." },
  { icon: "🤖", title: "AI Roadmap Generator", desc: "Get a milestone-by-milestone route built around your goal and level." },
  { icon: "📚", title: "Learning Resources", desc: "Every milestone comes with vetted resources, so you never search alone." },
  { icon: "📅", title: "Daily Missions", desc: "Your roadmap breaks into daily tasks sized to fit a real schedule." },
  { icon: "📈", title: "Progress Tracking", desc: "See exactly how far along the route you are, and what's next." },
  { icon: "💬", title: "AI Coach", desc: "Ask questions, get unstuck, and adjust your plan as your goal evolves." },
];

const STEPS = [
  { title: "Create your goal", desc: "Tell Launchpad what you're aiming for — a career, a skill, a milestone." },
  { title: "AI builds your roadmap", desc: "Launchpad plots a personalized route with milestones and resources." },
  { title: "Complete daily missions", desc: "Follow a manageable, day-by-day plan built around your pace." },
  { title: "Reach your dream", desc: "Track progress the whole way and arrive with a clear record of how you got there." },
];

const BENEFITS = [
  { icon: "🧭", label: "Stay Focused" },
  { icon: "⚡", label: "Learn Faster" },
  { icon: "🗺️", label: "Never Feel Lost" },
  { icon: "🔁", label: "Build Better Habits" },
  { icon: "📊", label: "Track Your Progress" },
];

const STORIES = [
  { initial: "J", name: "John", role: "Finished UX Roadmap", quote: "I finally finished the UX roadmap I'd been putting off for two years. Breaking it into daily steps made all the difference." },
  { initial: "S", name: "Sarah", role: "Started Freelancing", quote: "Launchpad gave me a plan I could actually follow. Three months later I had my first freelance client." },
  { initial: "A", name: "Alex", role: "Got First Job", quote: "Every milestone felt achievable instead of overwhelming. Got my first developer job right on schedule." },
];

const FAQS = [
  { q: "What is Launchpad?", a: "Launchpad is an AI platform that turns your goals into structured, personalized roadmaps with daily action plans." },
  { q: "Is the AI roadmap personalized?", a: "Yes — every roadmap is built around your specific goal, current level, and available time." },
  { q: "Can I manage multiple goals?", a: "You can run several roadmaps at once and switch between them from your dashboard." },
  { q: "Is my data safe?", a: "Your goals and progress are private to your account and never shared." },
  { q: "Is Launchpad free?", a: "Launchpad offers a free tier to get started, with additional features on paid plans." },
];

function Logo({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="12.5" stroke="var(--color-primary)" strokeWidth="1.3" />
      <path d="M15 7 L15 23 M7 15 L23 15" stroke="var(--color-line-strong)" strokeWidth="1" />
      <circle cx="15" cy="15" r="2.6" fill="var(--color-primary)" />
    </svg>
  );
}

function Chip({ children }) {
  return (
    <div
      className="inline-flex items-center gap-2 text-xs font-mono rounded-full px-3.5 py-1.5"
      style={{ border: "1px solid var(--color-line-strong)", color: "var(--color-primary)" }}
    >
      {children}
    </div>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: "var(--color-bg-elev)",
        border: "1px solid var(--color-line)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* A small level-badge preview, echoing the roadmap nodes on the real dashboard */
function RoadmapPreview() {
  const nodes = [
    { icon: "🏜", label: "Foundations", state: "done" },
    { icon: "🌲", label: "Core Skills", state: "current" },
    { icon: "⛰", label: "Projects", state: "locked" },
    { icon: "🏆", label: "Launch", state: "locked" },
  ];

  return (
    <Card className="p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex justify-between items-center mb-6">
        <span className="font-mono text-xs" style={{ color: "var(--color-ink-dim)" }}>
          YOUR ROADMAP · Sample
        </span>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2 h-2 rounded-full" style={{ background: "var(--color-line-strong)" }} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {nodes.map((n, i) => {
          const done = n.state === "done";
          const current = n.state === "current";
          const locked = n.state === "locked";

          return (
            <div key={n.label} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: current
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"
                      : done
                      ? "linear-gradient(135deg, var(--color-success), var(--color-bg-elev2))"
                      : "var(--color-bg-elev2)",
                    border: `2px solid ${
                      current ? "var(--color-primary)" : done ? "var(--color-success)" : "var(--color-line-strong)"
                    }`,
                    opacity: locked ? 0.5 : 1,
                    boxShadow: current ? "0 0 18px color-mix(in srgb, var(--color-primary) 45%, transparent)" : "none",
                  }}
                >
                  {n.icon}
                </div>
                {i !== nodes.length - 1 && (
                  <div className="w-px h-6" style={{ background: "var(--color-line-strong)" }} />
                )}
              </div>
              <div className="pb-6">
                <span
                  className="block text-[10px] font-mono mb-0.5"
                  style={{ color: done ? "var(--color-success)" : current ? "var(--color-primary)" : "var(--color-ink-dim)" }}
                >
                  {done ? "COMPLETED" : current ? "IN PROGRESS" : "LOCKED"}
                </span>
                <span className="text-sm font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {n.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default function LaunchpadLanding() {
  const { isLight, toggleTheme } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg)", color: "var(--color-ink)", fontFamily: "Inter, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .display{ font-family:'Space Grotesk',sans-serif; letter-spacing:-0.02em; }
        .mono{ font-family:'IBM Plex Mono',monospace; letter-spacing:0.02em; }
        .hover-card{ transition: transform .2s ease, border-color .2s ease; }
        .hover-card:hover{ transform: translateY(-3px); border-color: var(--color-line-strong); }
        .btn-solid{ background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); color:#111; }
        .btn-solid:hover{ filter:brightness(1.08); transform:translateY(-1px); }
        .btn-ghost{ border:1px solid var(--color-line-strong); color:var(--color-ink); }
        .btn-ghost:hover{ border-color:var(--color-primary); }
        a:focus-visible, button:focus-visible{ outline:2px solid var(--color-primary); outline-offset:2px; border-radius:6px; }
        @media (prefers-reduced-motion: reduce){ *{ transition-duration:.01ms !important; } }
      `}</style>

      {/* NAVBAR */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "color-mix(in srgb, var(--color-bg) 85%, transparent)", borderBottom: "1px solid var(--color-line)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">
          <div className="flex items-center gap-2.5 display font-bold text-lg">
            <Logo className="w-7 h-7" />
            Launchpad
          </div>
          <nav className="hidden md:flex gap-8 text-sm" style={{ color: "var(--color-ink-dim)" }}>
            <a href="#hero">Home</a>
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#stories">Success Stories</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex btn-ghost rounded-full px-5 py-2.5 text-sm font-semibold">
              Log in
            </Link>
            <Link to="/signUp" className="btn-solid rounded-full px-5 py-2.5 text-sm font-semibold">
              Sign up
            </Link>
            <button
              onClick={toggleTheme}
              className="btn-ghost w-9 h-9 rounded-full flex items-center justify-center text-base"
              aria-label="Toggle theme"
            >
              {isLight ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative pt-16 pb-12 overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl -top-32 -left-32 pointer-events-none"
          style={{ background: "color-mix(in srgb, var(--color-primary) 12%, transparent)" }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl top-20 -right-32 pointer-events-none"
          style={{ background: "color-mix(in srgb, var(--color-accent) 10%, transparent)" }}
        />

        <div className="max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 md:gap-14 items-center relative">
          <div>
            <Chip>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--color-primary)", boxShadow: "0 0 8px var(--color-primary)" }}
              />
              AI-POWERED ROADMAPS
            </Chip>

            <h1 className="display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mt-5 mb-5">
              Turn Your Dreams Into <span style={{ color: "var(--color-primary)" }}>Actionable</span> Roadmaps
            </h1>

            <p className="text-base mb-8 max-w-md" style={{ color: "var(--color-ink-dim)" }}>
              Launchpad uses AI to transform your long-term goals into personalized milestones, daily missions, and practical learning paths.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-9">
              <Link to="/signUp" className="btn-solid rounded-full px-6 py-3.5 text-sm font-semibold text-center">
                Get Started
              </Link>
              <a href="#how" className="btn-ghost rounded-full px-6 py-3.5 text-sm font-semibold text-center">
                See How It Works
              </a>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                ["AI-Generated", "Personalized Roadmaps"],
                ["Daily", "Missions"],
                ["Live", "Progress Tracking"],
              ].map(([n, l]) => (
                <div key={l} className="flex flex-col gap-0.5">
                  <span className="display font-bold text-base" style={{ color: "var(--color-success)" }}>
                    {n}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-ink-dim)" }}>
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <RoadmapPreview />
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-6" style={{ borderTop: "1px solid var(--color-line)", borderBottom: "1px solid var(--color-line)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <span className="mono text-xs" style={{ color: "var(--color-ink-dim)" }}>
            TRUSTED BY PEOPLE BUILDING THEIR NEXT CHAPTER
          </span>
          <div className="flex flex-wrap gap-5">
            {["Students", "Developers", "Designers", "Freelancers", "Career Changers"].map((t) => (
              <span key={t} className="display font-semibold text-sm opacity-80" style={{ color: "var(--color-ink-dim)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <Card className="p-7">
            <span
              className="mono self-start inline-block text-xs rounded-full px-3.5 py-1.5 mb-5"
              style={{ border: "1px solid var(--color-line-strong)", color: "var(--color-primary)" }}
            >
              🎯 GOAL: Learn UX Design
            </span>
            <div>
              {[
                ["RESOURCE", "Introduction to UX Design — Course"],
                ["TASK", "Complete a wireframing exercise"],
                ["TASK", "Review 3 UX case studies"],
              ].map(([k, v], i, arr) => (
                <div key={v}>
                  <div className="flex items-center gap-3.5 py-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        background: i === arr.length - 1 ? "var(--color-primary)" : "var(--color-bg)",
                        border: `2px solid ${i === arr.length - 1 ? "var(--color-primary)" : "var(--color-success)"}`,
                      }}
                    />
                    <div className="text-sm">
                      <span className="mono block text-[10px] mb-0.5" style={{ color: "var(--color-ink-dim)" }}>
                        {k}
                      </span>
                      {v}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-px h-5" style={{ background: "var(--color-line-strong)", marginLeft: "4px" }} />
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div>
            <Chip>ABOUT LAUNCHPAD</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4 mb-4">What is Launchpad?</h2>
            <p className="max-w-md text-[15px]" style={{ color: "var(--color-ink-dim)" }}>
              Launchpad is an AI-powered career and personal-growth platform that helps people transform ambitious
              goals into practical, step-by-step roadmaps — one milestone at a time.
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <Chip>THE GAP</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">Big dreams. No clear plan.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <Card className="p-7" style={{ borderTop: "3px solid var(--color-danger)" }}>
              <span className="mono block text-xs mb-3" style={{ color: "var(--color-danger)" }}>
                PROBLEM
              </span>
              <h3 className="display font-semibold text-lg mb-2">
                People often have big dreams but don't know where to start.
              </h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm" style={{ color: "var(--color-ink-dim)" }}>
                {["No clear plan", "No sustained motivation", "No defined path forward", "Lost between scattered resources"].map(
                  (t) => (
                    <li key={t} className="flex gap-2.5">
                      <span style={{ color: "var(--color-danger)" }}>✕</span>
                      {t}
                    </li>
                  )
                )}
              </ul>
            </Card>

            <Card className="p-7" style={{ borderTop: "3px solid var(--color-success)" }}>
              <span className="mono block text-xs mb-3" style={{ color: "var(--color-success)" }}>
                SOLUTION
              </span>
              <h3 className="display font-semibold text-lg mb-2">Launchpad plots the entire route for you.</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm" style={{ color: "var(--color-ink-dim)" }}>
                {["A personalized roadmap", "A daily action plan", "Curated resources", "Ongoing AI guidance"].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span style={{ color: "var(--color-success)" }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="max-w-xl mb-10">
            <Chip>FEATURES</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4 mb-3">Everything you need to stay on course</h2>
            <p className="text-[15px]" style={{ color: "var(--color-ink-dim)" }}>
              One system, from first goal to final milestone.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover-card p-7">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4"
                  style={{ background: "var(--color-bg-elev2)", border: "1px solid var(--color-line)" }}
                >
                  {f.icon}
                </div>
                <h3 className="display font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm" style={{ color: "var(--color-ink-dim)" }}>
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="max-w-xl mb-10">
            <Chip>HOW IT WORKS</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">Four steps from idea to outcome</h2>
          </div>
          <div className="relative pl-1">
            <div
              className="absolute left-6 top-2 bottom-2 w-px"
              style={{ background: "var(--color-line-strong)" }}
            />
            {STEPS.map((s, i) => (
              <div key={s.title} className="grid gap-5 py-6" style={{ gridTemplateColumns: "48px 1fr" }}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mono text-sm font-bold z-10"
                  style={{ background: "var(--color-bg-elev)", border: "2px solid var(--color-primary)", color: "var(--color-primary)" }}
                >
                  {i + 1}
                </div>
                <div>
                  <span className="mono block text-xs mb-1 opacity-70" style={{ color: "var(--color-ink-dim)" }}>
                    STEP {i + 1}
                  </span>
                  <h3 className="display font-semibold text-base mb-1">{s.title}</h3>
                  <p className="text-sm max-w-md" style={{ color: "var(--color-ink-dim)" }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <Card className="overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex gap-1.5 px-4 py-3.5" style={{ borderBottom: "1px solid var(--color-line)" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 rounded-full" style={{ background: "var(--color-line-strong)" }} />
              ))}
            </div>
            <div className="grid" style={{ gridTemplateColumns: "110px 1fr" }}>
              <div className="flex flex-col gap-2.5 p-3.5" style={{ borderRight: "1px solid var(--color-line)" }}>
                {["Dashboard", "Progress", "Planner", "AI Coach", "Resources"].map((item, i) => (
                  <div
                    key={item}
                    className="text-xs rounded-lg px-2.5 py-2"
                    style={
                      i === 0
                        ? { background: "var(--color-bg-elev2)", color: "var(--color-primary)", fontWeight: 600 }
                        : { color: "var(--color-ink-dim)" }
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="p-5 flex flex-col gap-4">
                {[
                  ["JavaScript", 80],
                  ["React", 55],
                  ["Backend", 30],
                ].map(([label, pct]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="mono text-[10.5px] w-20" style={{ color: "var(--color-ink-dim)" }}>
                      {label}
                    </span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-bg-elev2)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg,var(--color-primary),var(--color-success))" }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex gap-2.5">
                  {[
                    ["STREAK", "12 days"],
                    ["MILESTONE", "4 / 9"],
                    ["NEXT UP", "Deploy"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex-1 rounded-lg p-3" style={{ border: "1px solid var(--color-line)" }}>
                      <span className="mono text-[10px]" style={{ color: "var(--color-ink-dim)" }}>
                        {k}
                      </span>
                      <div className="display font-bold text-base mt-1">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div>
            <Chip>YOUR DASHBOARD</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4 mb-4">See your whole journey in one view</h2>
            <p className="text-[15px]" style={{ color: "var(--color-ink-dim)" }}>
              The Launchpad dashboard keeps every part of your journey visible — no digging through tabs to find out
              what's next.
            </p>
            <ul className="mt-5 flex flex-col gap-3 text-sm" style={{ color: "var(--color-ink-dim)" }}>
              {[
                "Live progress across every skill",
                "Milestones marked as you clear them",
                "A daily planner that adjusts to your pace",
                "Resources surfaced exactly when you need them",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span style={{ color: "var(--color-primary)" }}>—</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <Chip>WHY LAUNCHPAD</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">What you gain along the way</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {BENEFITS.map((b) => (
              <Card key={b.label} className="hover-card text-center px-3.5 py-6">
                <div className="text-xl mb-3">{b.icon}</div>
                <p className="text-[13.5px]" style={{ color: "var(--color-ink-dim)" }}>
                  {b.label}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section id="stories" className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="max-w-xl mb-10">
            <Chip>SUCCESS STORIES</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">People who reached their destination</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {STORIES.map((s) => (
              <Card key={s.name} className="hover-card p-6">
                <div className="text-sm tracking-widest mb-3" style={{ color: "var(--color-primary)" }}>
                  ★★★★★
                </div>
                <p className="text-sm mb-5" style={{ color: "var(--color-ink-dim)", minHeight: "60px" }}>
                  "{s.quote}"
                </p>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center display font-bold text-xs"
                    style={{ background: "var(--color-bg-elev2)", color: "var(--color-primary)", border: "1px solid var(--color-line-strong)" }}
                  >
                    {s.initial}
                  </div>
                  <div>
                    <div className="text-sm">{s.name}</div>
                    <div className="mono text-xs" style={{ color: "var(--color-ink-dim)" }}>
                      {s.role}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <div className="mb-10">
            <Chip>FAQ</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">Questions before you launch</h2>
          </div>
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className="py-5 cursor-pointer"
              style={{ borderBottom: "1px solid var(--color-line)" }}
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
            >
              <div className="flex justify-between items-center text-[15.5px] font-medium">
                {f.q}
                <span
                  className="mono transition-transform"
                  style={{ color: "var(--color-primary)", transform: openFaq === i ? "rotate(45deg)" : "none" }}
                >
                  +
                </span>
              </div>
              {openFaq === i && (
                <div className="text-sm mt-3" style={{ color: "var(--color-ink-dim)" }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-14 text-center">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div
            className="relative rounded-3xl px-6 sm:px-10 py-12 overflow-hidden"
            style={{
              border: "1px solid var(--color-line-strong)",
              background: "linear-gradient(160deg, var(--color-bg-elev), var(--color-bg-elev2))",
            }}
          >
            <h2 className="display font-bold text-2xl md:text-3xl mb-3 relative">Ready to start your journey?</h2>
            <p className="mb-7 relative" style={{ color: "var(--color-ink-dim)" }}>
              Set your first goal and get a roadmap in minutes.
            </p>
            <Link to="/signUp" className="btn-solid inline-block rounded-full px-7 py-3.5 text-sm font-semibold relative">
              Create Your First Roadmap
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--color-line)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-11 pb-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-9">
            <div>
              <div className="flex items-center gap-2.5 display font-bold text-base mb-3">
                <Logo className="w-7 h-7" /> Launchpad
              </div>
              <p className="text-xs max-w-[220px]" style={{ color: "var(--color-ink-dim)" }}>
                Turning dreams into roadmaps, one milestone at a time.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--color-ink-dim)" }}>
                Quick Links
              </h4>
              {["Home", "Features", "FAQ", "Contact"].map((l) => (
                <a key={l} href="#" className="block text-sm mb-2.5" style={{ color: "var(--color-ink-dim)" }}>
                  {l}
                </a>
              ))}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--color-ink-dim)" }}>
                Legal
              </h4>
              {["Privacy Policy", "Terms"].map((l) => (
                <a key={l} href="#" className="block text-sm mb-2.5" style={{ color: "var(--color-ink-dim)" }}>
                  {l}
                </a>
              ))}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--color-ink-dim)" }}>
                Connect
              </h4>
              {["Email", "Twitter / X", "LinkedIn"].map((l) => (
                <a key={l} href="#" className="block text-sm mb-2.5" style={{ color: "var(--color-ink-dim)" }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-6 text-xs"
            style={{ borderTop: "1px solid var(--color-line)", color: "var(--color-ink-dim)" }}
          >
            <span>© 2026 Launchpad. All rights reserved.</span>
            <span className="mono">BUILT FOR THE JOURNEY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

