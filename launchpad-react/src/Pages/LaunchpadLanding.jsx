import { useState } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "🎯", title: "Goal Creation", desc: "Set a goal in plain language — Launchpad structures it into a full plan." },
  { icon: "🤖", title: "AI Roadmap Generator", desc: "Get a milestone-by-milestone route built around your goal and level." },
  { icon: "📚", title: "Learning Resources", desc: "Every milestone comes with vetted resources, so you never search alone." },
  { icon: "📅", title: "Weekly Planner", desc: "Your roadmap breaks into weekly tasks sized to fit a real schedule." },
  { icon: "📈", title: "Progress Tracking", desc: "See exactly how far along the route you are, and what's next." },
  { icon: "💬", title: "AI Coach", desc: "Ask questions, get unstuck, and adjust your plan as your goal evolves." },
];

const STEPS = [
  { id: "WP-01", title: "Create your goal", desc: "Tell Launchpad what you're aiming for — a career, a skill, a milestone." },
  { id: "WP-02", title: "AI builds your roadmap", desc: "Launchpad plots a personalized route with milestones and resources." },
  { id: "WP-03", title: "Complete weekly tasks", desc: "Follow a manageable, week-by-week plan built around your pace." },
  { id: "WP-04", title: "Reach your dream", desc: "Track progress the whole way and arrive with a clear record of how you got there." },
];

const BENEFITS = [
  { icon: "🧭", label: "Stay Focused" },
  { icon: "⚡", label: "Learn Faster" },
  { icon: "🗺️", label: "Never Feel Lost" },
  { icon: "🔁", label: "Build Better Habits" },
  { icon: "📊", label: "Track Your Progress" },
];

const STORIES = [
  { initial: "J", name: "John", role: "Finished UX Roadmap", quote: "I finally finished the UX roadmap I'd been putting off for two years. Breaking it into weeks made all the difference." },
  { initial: "S", name: "Sarah", role: "Started Freelancing", quote: "Launchpad gave me a plan I could actually follow. Three months later I had my first freelance client." },
  { initial: "A", name: "Alex", role: "Got First Job", quote: "Every milestone felt achievable instead of overwhelming. Got my first developer job right on schedule." },
];

const FAQS = [
  { q: "What is Launchpad?", a: "Launchpad is an AI platform that turns your goals into structured, personalized roadmaps with weekly action plans." },
  { q: "Is the AI roadmap personalized?", a: "Yes — every roadmap is built around your specific goal, current level, and available time." },
  { q: "Can I manage multiple goals?", a: "You can run several roadmaps at once and switch between them from your dashboard." },
  { q: "Is my data safe?", a: "Your goals and progress are private to your account and never shared." },
  { q: "Is Launchpad free?", a: "Launchpad offers a free tier to get started, with additional features on paid plans." },
];

function Logo({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="13" stroke="var(--gold)" strokeWidth="1.4" strokeDasharray="3 4" />
      <path d="M15 6 L15 24 M6 15 L24 15" stroke="var(--line-strong)" strokeWidth="1" />
      <circle cx="15" cy="15" r="3.2" fill="var(--gold)" />
    </svg>
  );
}

export default function LaunchpadLanding() {
  const [theme, setTheme] = useState("dark");
  const [openFaq, setOpenFaq] = useState(0);
  const isLight = theme === "light";

  return (
    <div className={`app min-h-screen ${isLight ? "light" : ""}`} style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .app{
          --bg:#0E1526; --bg-elev:#141D33; --bg-elev2:#1B2540;
          --ink:#EDEFF6; --ink-dim:#9AA5BD;
          --line:rgba(237,239,246,0.12); --line-strong:rgba(237,239,246,0.22);
          --gold:#F5B342; --mint:#5EEAD4; --coral:#FF7A6B;
          --shadow: 0 20px 60px rgba(0,0,0,0.35);
          transition: background .3s ease, color .3s ease;
        }
        .app.light{
          --bg:#F5F7FB; --bg-elev:#FFFFFF; --bg-elev2:#EEF1F8;
          --ink:#101828; --ink-dim:#5B677E;
          --line:rgba(16,24,40,0.10); --line-strong:rgba(16,24,40,0.18);
          --shadow: 0 20px 50px rgba(16,24,40,0.10);
        }
        .display{ font-family:'Space Grotesk',sans-serif; letter-spacing:-0.02em; }
        .mono{ font-family:'IBM Plex Mono',monospace; letter-spacing:0.02em; }
        .card{ background:var(--bg-elev); border:1px solid var(--line); border-radius:14px; }
        .card:hover{ border-color:var(--line-strong); }
        .grid-bg{
          position:absolute; inset:0; pointer-events:none;
          background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size:48px 48px;
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%);
          mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%);
          opacity:.6;
        }
        .fp-line{ position:absolute; left:23px; top:14px; bottom:14px; width:2px; background:repeating-linear-gradient(to bottom, var(--line-strong) 0 6px, transparent 6px 12px); }
        .traj-path{ stroke:var(--mint); stroke-width:2; fill:none; stroke-dasharray:6 6; }
        .btn-solid{ background:var(--gold); color:#1A1305; }
        .btn-solid:hover{ filter:brightness(1.08); transform:translateY(-1px); }
        .btn-ghost{ border:1px solid var(--line-strong); color:var(--ink); }
        .btn-ghost:hover{ border-color:var(--gold); }
        a:focus-visible, button:focus-visible{ outline:2px solid var(--gold); outline-offset:2px; border-radius:6px; }
        @media (prefers-reduced-motion: reduce){ *{ transition-duration:.01ms !important; } }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)", borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">
          <div className="flex items-center gap-2.5 display font-bold text-lg">
            <Logo className="w-7 h-7" />
            Launchpad
          </div>
          <nav className="hidden md:flex gap-8 text-sm" style={{ color: "var(--ink-dim)" }}>
            <a href="#hero">Home</a>
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#stories">Success Stories</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex btn-ghost rounded-full px-5 py-2.5 text-sm font-semibold">Log in</Link>
            <Link to="/signUp" className="btn-solid rounded-full px-5 py-2.5 text-sm font-semibold">Sign up</Link>
            <button
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className="btn-ghost w-9 h-9 rounded-full flex items-center justify-center text-base"
              aria-label="Toggle theme"
            >
              {isLight ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative pt-16 pb-12">
        <div className="grid-bg" />
        <div className="max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 md:gap-14 items-center relative">
          <div>
            <div className="mono inline-flex items-center gap-2 text-xs rounded-full px-3 py-1.5 mb-5" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)", boxShadow: "0 0 8px var(--gold)" }} />
              AI ROADMAP ENGINE — v1.0
            </div>
            <h1 className="display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
              Turn Your Dreams Into <span style={{ color: "var(--gold)" }}>Actionable</span> Roadmaps
            </h1>
            <p className="text-base mb-8 max-w-md" style={{ color: "var(--ink-dim)" }}>
              Launchpad uses AI to transform your long-term goals into personalized milestones, weekly action plans, and practical learning paths.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-9">
              <a href="#" className="btn-solid rounded-full px-6 py-3.5 text-sm font-semibold text-center">Get Started</a>
              <a href="#" className="btn-ghost rounded-full px-6 py-3.5 text-sm font-semibold text-center">▶ Watch Demo</a>
            </div>
            <div className="flex flex-wrap gap-6">
              {[["AI-Generated", "Personalized Roadmaps"], ["Weekly", "Action Plans"], ["Live", "Progress Tracking"]].map(([n, l]) => (
                <div key={l} className="flex flex-col gap-0.5">
                  <span className="display font-bold text-base" style={{ color: "var(--mint)" }}>{n}</span>
                  <span className="text-xs" style={{ color: "var(--ink-dim)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6" style={{ boxShadow: "var(--shadow)" }}>
            <div className="flex justify-between items-center mb-4">
              <span className="mono text-xs" style={{ color: "var(--ink-dim)" }}>FLIGHT PLAN · GOAL-014</span>
              <div className="flex gap-1.5">{[0, 1, 2].map(i => <span key={i} className="w-2 h-2 rounded-full" style={{ background: "var(--line-strong)" }} />)}</div>
            </div>
            <svg viewBox="0 0 460 260" className="w-full h-auto">
              <path className="traj-path" d="M30 210 C 120 210, 90 90, 180 90 S 300 40, 340 40 S 420 60, 430 30" />
              <circle cx="30" cy="210" r="6" fill="var(--gold)" stroke="var(--gold)" strokeWidth="2" />
              <text x="10" y="232" className="mono" fontSize="9.5" fill="var(--ink-dim)">SET GOAL</text>
              <circle cx="180" cy="90" r="6" fill="var(--bg-elev)" stroke="var(--gold)" strokeWidth="2" />
              <text x="152" y="76" className="mono" fontSize="9.5" fill="var(--ink-dim)">ROADMAP</text>
              <circle cx="340" cy="40" r="6" fill="var(--bg-elev)" stroke="var(--gold)" strokeWidth="2" />
              <text x="312" y="26" className="mono" fontSize="9.5" fill="var(--ink-dim)">MILESTONE</text>
              <circle cx="430" cy="30" r="6" fill="var(--bg-elev)" stroke="var(--gold)" strokeWidth="2" />
              <text x="392" y="16" className="mono" fontSize="9.5" fill="var(--ink-dim)">LAUNCH</text>
            </svg>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-6" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <span className="mono text-xs" style={{ color: "var(--ink-dim)" }}>TRUSTED BY PEOPLE BUILDING THEIR NEXT CHAPTER</span>
          <div className="flex flex-wrap gap-5">
            {["Students", "Developers", "Designers", "Freelancers", "Career Changers"].map(t => (
              <span key={t} className="display font-semibold text-sm opacity-80" style={{ color: "var(--ink-dim)" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="card relative p-7 flex flex-col overflow-hidden">
            <div className="grid-bg" style={{ opacity: 0.35 }} />
            <span className="mono self-start text-xs rounded-full px-3.5 py-1.5 mb-5 relative" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>🎯 GOAL: Learn UX Design</span>
            <div className="relative">
              {[
                ["RESOURCE", "Introduction to UX Design — Course"],
                ["TASK", "Complete a wireframing exercise"],
                ["TASK", "Review 3 UX case studies"],
              ].map(([k, v], i, arr) => (
                <div key={v}>
                  <div className="flex items-center gap-3.5 py-3">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: i === arr.length - 1 ? "var(--gold)" : "var(--bg)", border: `2px solid ${i === arr.length - 1 ? "var(--gold)" : "var(--mint)"}` }} />
                    <div className="text-sm">
                      <span className="mono block text-[10px] mb-0.5" style={{ color: "var(--ink-dim)" }}>{k}</span>
                      {v}
                    </div>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-5" style={{ background: "var(--line-strong)", marginLeft: "4px" }} />}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mono inline-block text-xs rounded-full px-3 py-1.5 mb-4" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>ABOUT LAUNCHPAD</div>
            <h2 className="display font-bold text-2xl md:text-3xl mb-4">What is Launchpad?</h2>
            <p className="max-w-md text-[15px]" style={{ color: "var(--ink-dim)" }}>
              Launchpad is an AI-powered career and personal-growth platform that helps people transform ambitious goals into practical, step-by-step roadmaps — plotted like a flight path, one waypoint at a time.
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="mono inline-block text-xs rounded-full px-3 py-1.5 mb-4" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>THE GAP</div>
            <h2 className="display font-bold text-2xl md:text-3xl">Big dreams. No flight plan.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card p-7" style={{ borderTop: "3px solid var(--coral)" }}>
              <span className="mono block text-xs mb-3" style={{ color: "var(--coral)" }}>PROBLEM</span>
              <h3 className="display font-semibold text-lg mb-2">People often have big dreams but don't know where to start.</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm" style={{ color: "var(--ink-dim)" }}>
                {["No clear plan", "No sustained motivation", "No defined path forward", "Lost between scattered resources"].map(t => (
                  <li key={t} className="flex gap-2.5"><span style={{ color: "var(--coral)" }}>✕</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="card p-7" style={{ borderTop: "3px solid var(--mint)" }}>
              <span className="mono block text-xs mb-3" style={{ color: "var(--mint)" }}>SOLUTION</span>
              <h3 className="display font-semibold text-lg mb-2">Launchpad plots the entire route for you.</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm" style={{ color: "var(--ink-dim)" }}>
                {["A personalized roadmap", "A weekly action plan", "Curated resources", "Ongoing AI guidance"].map(t => (
                  <li key={t} className="flex gap-2.5"><span style={{ color: "var(--mint)" }}>✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="max-w-xl mb-10">
            <div className="mono inline-block text-xs rounded-full px-3 py-1.5 mb-4" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>FEATURES</div>
            <h2 className="display font-bold text-2xl md:text-3xl mb-3">Everything you need to stay on course</h2>
            <p className="text-[15px]" style={{ color: "var(--ink-dim)" }}>One system, from first goal to final milestone.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-7 transition-transform hover:-translate-y-1" style={{ boxShadow: "none" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4" style={{ background: "var(--bg-elev2)", border: "1px solid var(--line)" }}>{f.icon}</div>
                <h3 className="display font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm" style={{ color: "var(--ink-dim)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="max-w-xl mb-10">
            <div className="mono inline-block text-xs rounded-full px-3 py-1.5 mb-4" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>HOW IT WORKS</div>
            <h2 className="display font-bold text-2xl md:text-3xl">Four waypoints from idea to outcome</h2>
          </div>
          <div className="relative pl-1">
            <div className="fp-line" />
            {STEPS.map((s, i) => (
              <div key={s.id} className="grid gap-5 py-6" style={{ gridTemplateColumns: "48px 1fr" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mono text-[11px] z-10" style={{ background: "var(--bg-elev)", border: "2px solid var(--gold)", color: "var(--gold)" }}>{s.id}</div>
                <div>
                  <span className="mono block text-xs mb-1 opacity-70" style={{ color: "var(--ink-dim)" }}>STAGE {i + 1}</span>
                  <h3 className="display font-semibold text-base mb-1">{s.title}</h3>
                  <p className="text-sm max-w-md" style={{ color: "var(--ink-dim)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="card overflow-hidden" style={{ boxShadow: "var(--shadow)" }}>
            <div className="flex gap-1.5 px-4 py-3.5" style={{ borderBottom: "1px solid var(--line)" }}>
              {[0, 1, 2].map(i => <span key={i} className="w-2 h-2 rounded-full" style={{ background: "var(--line-strong)" }} />)}
            </div>
            <div className="grid" style={{ gridTemplateColumns: "110px 1fr" }}>
              <div className="flex flex-col gap-2.5 p-3.5" style={{ borderRight: "1px solid var(--line)" }}>
                {["Dashboard", "Progress", "Milestones", "Weekly Planner", "Resources"].map((item, i) => (
                  <div key={item} className="text-xs rounded-lg px-2.5 py-2" style={i === 0 ? { background: "var(--bg-elev2)", color: "var(--gold)", fontWeight: 600 } : { color: "var(--ink-dim)" }}>{item}</div>
                ))}
              </div>
              <div className="p-5 flex flex-col gap-4">
                {[["JavaScript", 80], ["React", 55], ["Backend", 30]].map(([label, pct]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="mono text-[10.5px] w-20" style={{ color: "var(--ink-dim)" }}>{label}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-elev2)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,var(--gold),var(--mint))" }} />
                    </div>
                  </div>
                ))}
                <div className="flex gap-2.5">
                  {[["STREAK", "12 days"], ["MILESTONE", "4 / 9"], ["NEXT UP", "Deploy"]].map(([k, v]) => (
                    <div key={k} className="flex-1 rounded-lg p-3" style={{ border: "1px solid var(--line)" }}>
                      <span className="mono text-[10px]" style={{ color: "var(--ink-dim)" }}>{k}</span>
                      <div className="display font-bold text-base mt-1">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mono inline-block text-xs rounded-full px-3 py-1.5 mb-4" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>MISSION CONTROL</div>
            <h2 className="display font-bold text-2xl md:text-3xl mb-4">See your whole route in one view</h2>
            <p className="text-[15px]" style={{ color: "var(--ink-dim)" }}>The Launchpad dashboard keeps every part of your journey visible — no digging through tabs to find out what's next.</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm" style={{ color: "var(--ink-dim)" }}>
              {["Live progress across every skill", "Milestones marked as you clear them", "A weekly planner that adjusts to your pace", "Resources surfaced exactly when you need them"].map(t => (
                <li key={t} className="flex gap-2.5"><span style={{ color: "var(--gold)" }}>—</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ROADMAP PREVIEW */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="mono inline-block text-xs rounded-full px-3 py-1.5 mb-4" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>SAMPLE ROADMAP</div>
            <h2 className="display font-bold text-2xl md:text-3xl mb-3">Learn UX Design Fundamentals</h2>
            <p className="text-[15px]" style={{ color: "var(--ink-dim)" }}>Every roadmap is generated around your specific goal. Here's what one real route looks like.</p>
          </div>
          <div className="relative pl-7">
            <div className="fp-line" style={{ left: "9px" }} />
            {[
              ["RESOURCE", "Introduction to UX Design — Course"],
              ["TASK", "Complete a wireframing exercise"],
              ["TASK", "Review 3 UX case studies"],
            ].map(([tag, title], i, arr) => (
              <div key={title} className="relative py-4" style={{ paddingLeft: "0px" }}>
                <span className="absolute rounded-full" style={{ left: "-30px", top: "22px", width: "16px", height: "16px", background: "var(--bg-elev)", border: `2px solid ${i === arr.length - 1 ? "var(--gold)" : "var(--mint)"}` }} />
                <span className="mono text-[10.5px]" style={{ color: "var(--ink-dim)" }}>{tag}</span>
                <h4 className="display font-semibold text-[15.5px] mt-0.5">{title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="mono inline-block text-xs rounded-full px-3 py-1.5 mb-4" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>WHY LAUNCHPAD</div>
            <h2 className="display font-bold text-2xl md:text-3xl">What you gain along the way</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {BENEFITS.map(b => (
              <div key={b.label} className="card text-center px-3.5 py-6 transition-transform hover:-translate-y-1">
                <div className="text-xl mb-3">{b.icon}</div>
                <p className="text-[13.5px]" style={{ color: "var(--ink-dim)" }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section id="stories" className="py-14">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="max-w-xl mb-10">
            <div className="mono inline-block text-xs rounded-full px-3 py-1.5 mb-4" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>SUCCESS STORIES</div>
            <h2 className="display font-bold text-2xl md:text-3xl">People who reached their destination</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {STORIES.map(s => (
              <div key={s.name} className="card p-6 transition-transform hover:-translate-y-1">
                <div className="text-sm tracking-widest mb-3" style={{ color: "var(--gold)" }}>★★★★★</div>
                <p className="text-sm mb-5" style={{ color: "var(--ink-dim)", minHeight: "60px" }}>"{s.quote}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center display font-bold text-xs" style={{ background: "var(--bg-elev2)", color: "var(--gold)", border: "1px solid var(--line-strong)" }}>{s.initial}</div>
                  <div>
                    <div className="text-sm">{s.name}</div>
                    <div className="mono text-xs" style={{ color: "var(--ink-dim)" }}>{s.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <div className="mb-10">
            <div className="mono inline-block text-xs rounded-full px-3 py-1.5 mb-4" style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}>FAQ</div>
            <h2 className="display font-bold text-2xl md:text-3xl">Questions before you launch</h2>
          </div>
          {FAQS.map((f, i) => (
            <div key={f.q} className="py-5 cursor-pointer" style={{ borderBottom: "1px solid var(--line)" }} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
              <div className="flex justify-between items-center text-[15.5px] font-medium">
                {f.q}
                <span className="mono transition-transform" style={{ color: "var(--gold)", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
              </div>
              {openFaq === i && <div className="text-sm mt-3" style={{ color: "var(--ink-dim)" }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-14 text-center">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="relative rounded-3xl px-6 sm:px-10 py-12 overflow-hidden" style={{ border: "1px solid var(--line-strong)", background: "linear-gradient(160deg, var(--bg-elev), var(--bg-elev2))" }}>
            <div className="grid-bg" />
            <h2 className="display font-bold text-2xl md:text-3xl mb-3 relative">Ready to start your journey?</h2>
            <p className="mb-7 relative" style={{ color: "var(--ink-dim)" }}>Set your first goal and get a roadmap in minutes.</p>
            <Link to="/signUp" className="btn-solid inline-block rounded-full px-7 py-3.5 text-sm font-semibold relative">Create Your First Roadmap</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-11 pb-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-9">
            <div>
              <div className="flex items-center gap-2.5 display font-bold text-base mb-3">
                <Logo className="w-7 h-7" /> Launchpad
              </div>
              <p className="text-xs max-w-[220px]" style={{ color: "var(--ink-dim)" }}>Turning dreams into flight plans, one waypoint at a time.</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--ink-dim)" }}>Quick Links</h4>
              {["Home", "Features", "FAQ", "Contact"].map(l => <a key={l} href="#" className="block text-sm mb-2.5" style={{ color: "var(--ink-dim)" }}>{l}</a>)}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--ink-dim)" }}>Legal</h4>
              {["Privacy Policy", "Terms"].map(l => <a key={l} href="#" className="block text-sm mb-2.5" style={{ color: "var(--ink-dim)" }}>{l}</a>)}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--ink-dim)" }}>Connect</h4>
              {["Email", "Twitter / X", "LinkedIn"].map(l => <a key={l} href="#" className="block text-sm mb-2.5" style={{ color: "var(--ink-dim)" }}>{l}</a>)}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-6 text-xs" style={{ borderTop: "1px solid var(--line)", color: "var(--ink-dim)" }}>
            <span>© 2026 Launchpad. All rights reserved.</span>
            <span className="mono">BUILT FOR THE JOURNEY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
