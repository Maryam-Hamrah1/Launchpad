import { useContext, useState, useEffect, useRef } from "react";
import {  Link } from "react-router-dom";
import { ThemeContext } from "../components/ThemeContext";
import {
  Target, Bot, BookOpen, Calendar, TrendingUp, MessageCircle,
  Map, Repeat, PenLine, CheckCircle2, Trophy, Bell, Moon, Sun,
  Check, Flame, Medal, Mail, MapPin, X,
  Sparkles, Hand, Star,
} from "lucide-react";

// Brand icons (removed from lucide-react v1+) as small inline SVGs
function GithubIcon({ size = 18, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-1.94c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.07.78 2.15v3.19c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
    </svg>
  );
}
function LinkedinIcon({ size = 18, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}




const FEATURES = [
  { icon: Target, title: "Goal Creation", desc: "Set a goal in plain language — Launchpad structures it into a full plan." },
  { icon: Bot, title: "AI Roadmap Generator", desc: "Get a milestone-by-milestone route built around your goal and level." },
  { icon: BookOpen, title: "Learning Resources", desc: "Every milestone comes with vetted resources, so you never search alone." },
  { icon: Calendar, title: "Daily Missions", desc: "Your roadmap breaks into daily tasks sized to fit a real schedule." },
  { icon: TrendingUp, title: "Progress Tracking", desc: "See exactly how far along the route you are, and what's next." },
  { icon: MessageCircle, title: "AI Coach", desc: "Ask questions, get unstuck, and adjust your plan as your goal evolves." },
];

const AI_CAPABILITIES = [
  { icon: Map, title: "Personalized Roadmaps", desc: "Built around your goal, experience level, and available time." },
  { icon: Calendar, title: "Weekly Planning", desc: "Your roadmap breaks into a realistic weekly rhythm." },
  { icon: BookOpen, title: "Resource Recommendation", desc: "Curated courses and material matched to each milestone." },
  { icon: Bot, title: "AI Mentor", desc: "Ask questions and get unstuck without leaving your roadmap." },
  { icon: TrendingUp, title: "Progress Prediction", desc: "See where you're headed based on your current pace." },
  { icon: Repeat, title: "Habit Tracking", desc: "Daily streaks that keep momentum visible and rewarding." },
];

const STEPS = [
  { icon: PenLine, title: "Describe Your Goal", desc: "Tell Launchpad what you're aiming for — a career, a skill, a milestone." },
  { icon: Bot, title: "AI Creates Your Roadmap", desc: "Launchpad plots a personalized route with milestones and resources." },
  { icon: CheckCircle2, title: "Complete Daily Missions", desc: "Follow a manageable, day-by-day plan built around your pace." },
  { icon: TrendingUp, title: "Track Your Progress", desc: "Watch your roadmap fill in as streaks and milestones add up." },
  { icon: Trophy, title: "Achieve Your Goal", desc: "Arrive with a clear record of exactly how you got there." },
];

const STATS = [
  { value: "98%", label: "User Satisfaction" },
  { value: "10K+", label: "Roadmaps Generated" },
  { value: "500+", label: "Learning Resources" },
  { value: "35+", label: "Career Paths" },
];

const STORIES = [
  { initial: "H", name: "Hamesha", role: "Finished UX Roadmap", quote: "I finally finished the UX roadmap I'd been putting off for two years. Breaking it into daily steps made all the difference." },
  { initial: "M", name: "Mahdia", role: "Started Freelancing", quote: "Launchpad gave me a plan I could actually follow. Three months later I had my first freelance client." },
  { initial: "S", name: "Samira", role: "Got First Job", quote: "Every milestone felt achievable instead of overwhelming. Got my first developer job right on schedule." },
];

const FAQS = [
  { q: "How does Launchpad generate roadmaps?", a: "Launchpad's AI analyzes your goal, experience level, timeline, and study hours, then builds a month-by-month roadmap broken into daily missions." },
  { q: "Can I edit my roadmap?", a: "Yes — you're never locked in. You can regenerate a month or adjust your goal at any time." },
  { q: "Does AI recommend courses?", a: "Each milestone comes with curated learning resources matched to what that stage of your roadmap needs." },
  { q: "Can I regenerate my roadmap?", a: "Yes — if your goal or pace changes, you can regenerate any month for an updated plan." },
  { q: "Is my data secure?", a: "Your goals and progress are private to your account and never shared." },
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
      style={{ background: "var(--color-bg-elev)", border: "1px solid var(--color-line)", ...style }}
    >
      {children}
    </div>
  );
}

/* Scroll-reveal: fades/slides sections up into view once, on entry */
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity .7s ease, transform .7s ease",
      }}
    >
      {children}
    </div>
  );
}

/* Compact dashboard mockup for the hero — modeled on the real Launchpad dashboard */
function DashboardMockup() {
  return (
    <Card className="p-0 overflow-hidden relative" style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)" }}>
      <div className="flex">
        {/* mini sidebar */}
        <div
          className="hidden sm:flex flex-col gap-1 py-4 px-2.5 w-32 flex-shrink-0"
          style={{ borderRight: "1px solid var(--color-line)" }}
        >
          <div className="flex items-center gap-1.5 display font-bold text-[11px] px-1.5 mb-3">
            <Logo className="w-4 h-4" /> Launchpad
          </div>
          {[
            ["Dashboard", true],
            ["Goals", false],
            ["Planner", false],
            ["AI Coach", false],
            ["Progress", false],
          ].map(([label, active]) => (
            <div
              key={label}
              className="text-[9.5px] rounded-md px-2 py-1.5"
              style={
                active
                  ? { background: "color-mix(in srgb, var(--color-primary) 14%, transparent)", color: "var(--color-primary)", fontWeight: 600 }
                  : { color: "var(--color-ink-dim)" }
              }
            >
              {label}
            </div>
          ))}
        </div>

        {/* main */}
        <div className="flex-1 p-3.5 sm:p-4 min-w-0">
          {/* topbar */}
          <div className="flex items-center gap-2 mb-3.5">
            <div
              className="flex-1 flex items-center gap-1.5 rounded-lg px-2.5 h-7 text-[9.5px]"
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)", color: "var(--color-ink-dim)" }}
            >
               Search goals, roadmap, planner...
            </div>
            <div className="w-7 flex items-center justify-center  text-[12px] h-7 rounded-lg flex-shrink-0" style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)" }} >
              <Bell size={13} />
            </div>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9.5px] font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg,var(--color-primary),var(--color-accent))", color: "#111" }}
            >
              M
            </div>
          </div>

          {/* greeting card */}
          <div
            className="rounded-xl p-3.5 relative overflow-hidden"
            style={{
              background: `radial-gradient(circle at top right, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 60%), var(--color-bg-elev2)`,
              border: "1px solid var(--color-line)",
            }}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <span
                  className="inline-flex items-center gap-1 text-[8.5px] rounded-full px-2 py-1 mb-2"
                  style={{ background: "color-mix(in srgb, var(--color-primary) 14%, transparent)", color: "var(--color-primary)" }}
                >
                  <Sparkles size={9} /> AI Career Roadmap
                </span>
                <div className="text-[13px] font-bold display leading-tight flex items-center gap-1">Good morning, Maryam <Hand size={13} /></div>
                <p className="text-[9px] mt-1.5 leading-4" style={{ color: "var(--color-ink-dim)" }}>
                  Track your goals, follow your AI roadmap, and keep moving toward your future.
                </p>
              </div>

              <div className="flex flex-col items-center flex-shrink-0">
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="21" fill="none" stroke="var(--color-line-strong)" strokeWidth="5" />
                  <circle
                    cx="26" cy="26" r="21" fill="none"
                    stroke="var(--color-primary)" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 21}
                    strokeDashoffset={2 * Math.PI * 21 * 0.68}
                    transform="rotate(-90 26 26)"
                  />
                  <text x="50%" y="54%" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--color-ink)">32%</text>
                </svg>
                <span className="text-[7.5px] mt-1" style={{ color: "var(--color-ink-dim)" }}>PROGRESS</span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mt-3.5">
              {[
                ["GOALS", "6", "var(--color-primary)"],
                ["ACTIVE", "4", "var(--color-accent)"],
                ["DONE", "12", "var(--color-success)"],
                ["STREAK", "9d", "var(--color-primary)"],
                ["SCORE", "48", "var(--color-accent)"],
              ].map(([label, val, color]) => (
                <div key={label} className="rounded-lg px-2 py-1.5" style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)" }}>
                  <div className="text-[7px]" style={{ color: "var(--color-ink-dim)" }}>{label}</div>
                  <div className="text-[11px] font-bold" style={{ color }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function LaunchpadLanding() {
  const { isLight, toggleTheme } = useContext(ThemeContext);
  const [openFaq, setOpenFaq] = useState(0);
  const [contactSent, setContactSent] = useState(false);

  function handleContactSubmit(e) {
    e.preventDefault();
    setContactSent(true);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-ink)", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .display{ font-family:'Space Grotesk',sans-serif; letter-spacing:-0.02em; }
        .mono{ font-family:'IBM Plex Mono',monospace; letter-spacing:0.02em; }
        .hover-card{ transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .hover-card:hover{ transform: translateY(-4px); border-color: var(--color-line-strong); box-shadow: 0 20px 45px -20px color-mix(in srgb, var(--color-primary) 35%, transparent); }
        .btn-solid{ background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light)); color:#111; box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--color-primary) 55%, transparent); }
        .btn-solid:hover{ filter:brightness(1.08); transform:translateY(-1px); }
        .btn-ghost{ border:1px solid var(--color-line-strong); color:var(--color-ink); }
        .btn-ghost:hover{ border-color:var(--color-primary); }
        input, textarea{ font-family: inherit; }
        input:focus, textarea:focus{ outline:2px solid var(--color-primary); outline-offset:1px; }
        a:focus-visible, button:focus-visible{ outline:2px solid var(--color-primary); outline-offset:2px; border-radius:6px; }
        @keyframes auroraDrift {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(3%, -4%) scale(1.08); }
        }
        .aurora-blob{ animation: auroraDrift 14s ease-in-out infinite; }
        @keyframes floatSlow {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .float-slow{ animation: floatSlow 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ *{ transition-duration:.01ms !important; animation:none !important; } }
      `}</style>

      {/* NAVBAR */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "color-mix(in srgb, var(--color-bg) 82%, transparent)", borderBottom: "1px solid var(--color-line)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">
          <Link to={'/'}>
          <div className="flex items-center gap-2.5 display font-bold text-lg">
            <Logo className="w-7 h-7" />
            Launchpad
          </div>
          </Link>
          
          <nav className="hidden md:flex gap-8 text-sm" style={{ color: "var(--color-ink-dim)" }}>
            <a href="#hero">Home</a>
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#stories">Success Stories</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex btn-ghost rounded-full px-5 py-2.5 text-sm font-semibold">
              Log in
            </Link>
            <Link to="/signUp" className="btn-solid rounded-full px-5 py-2.5 text-sm font-semibold">
              Sign up
            </Link>
            <button onClick={toggleTheme} className="btn-ghost w-9 h-9 rounded-full flex items-center justify-center text-base" aria-label="Toggle theme">
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO — luxury aurora */}
      <section id="hero" className="relative pt-10 pb-16 overflow-hidden">
        <div
          className="aurora-blob absolute w-[520px] h-[520px] rounded-full blur-3xl -top-40 -left-32 pointer-events-none"
          style={{ background: "color-mix(in srgb, var(--color-primary) 20%, transparent)" }}
        />
        <div
          className="aurora-blob absolute w-[480px] h-[480px] rounded-full blur-3xl top-10 -right-40 pointer-events-none"
          style={{ background: "color-mix(in srgb, var(--color-accent) 16%, transparent)", animationDelay: "3s" }}
        />
        <div
          className="aurora-blob absolute w-96 h-96 rounded-full blur-3xl bottom-0 left-1/3 pointer-events-none"
          style={{ background: "color-mix(in srgb, var(--color-success) 10%, transparent)", animationDelay: "6s" }}
        />

        <div className="max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 md:gap-14 items-center relative">
          <Reveal>
            <Chip>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-primary)", boxShadow: "0 0 8px var(--color-primary)" }} />
              AI-POWERED CAREER NAVIGATOR
            </Chip>

            <h1 className="display font-bold text-3xl sm:text-4xl md:text-[3.2rem] leading-[1.1] mt-5 mb-5">
              Turn Any Goal Into A <span style={{ color: "var(--color-primary)" }}>Personalized AI Roadmap</span>
            </h1>

            <p className="text-base mb-8 max-w-md" style={{ color: "var(--color-ink-dim)" }}>
              Launchpad analyzes your goal, experience, available time, and preferred learning style to generate a
              step-by-step roadmap with milestones, curated resources, and progress tracking — all powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-9">
              <Link to="/signUp" className="btn-solid rounded-full px-6 py-3.5 text-sm font-semibold text-center">
                Create Free Roadmap
              </Link>
              <a href="#how" className="btn-ghost rounded-full px-6 py-3.5 text-sm font-semibold text-center">
                See How It Works
              </a>
            </div>

            <div className="flex flex-wrap gap-6">
              {[["AI-Generated", "Personalized Roadmaps"], ["Daily", "Missions"], ["Live", "Progress Tracking"]].map(([n, l]) => (
                <div key={l} className="flex flex-col gap-0.5">
                  <span className="display font-bold text-base" style={{ color: "var(--color-success)" }}>{n}</span>
                  <span className="text-xs" style={{ color: "var(--color-ink-dim)" }}>{l}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="float-slow">
            <DashboardMockup />
          </Reveal>
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

      {/* PROBLEM */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <Chip>THE PROBLEM</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4 mb-4">Stop wasting time searching.</h2>
            <p className="max-w-md text-[15px]" style={{ color: "var(--color-ink-dim)" }}>
              People spend hundreds of hours trying to find the right courses, tutorials, and learning paths —
              piecing together a plan from scattered blog posts and playlists. Launchpad builds everything
              automatically, so that time goes toward actually learning.
            </p>
          </Reveal>

          <Reveal>
            <Card className="p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-danger)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-primary)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-success)" }} />
                <div className="flex-1 rounded-md h-6 ml-2" style={{ background: "var(--color-bg)", border: "1px solid var(--color-line)" }} />
              </div>
              {["\"best way to learn UX design 2024\"", "\"react roadmap for beginners\"", "\"free courses vs paid — which one\""].map((q) => (
                <div key={q} className="flex items-center justify-between rounded-lg px-3.5 py-2.5 mb-2" style={{ background: "var(--color-bg)" }}>
                  <span className="text-xs" style={{ color: "var(--color-ink-dim)" }}>{q}</span>
                  <X size={14} style={{ color: "var(--color-danger)" }} />
                </div>
              ))}
              <div
                className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
                style={{ background: "color-mix(in srgb, var(--color-success) 10%, transparent)", border: "1px solid var(--color-success)" }}
              >
                <span className="text-xs font-semibold" style={{ color: "var(--color-success)" }}>Launchpad builds your roadmap instantly</span>
                <Check size={14} style={{ color: "var(--color-success)" }} />
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* AI COACH CAPABILITIES */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <Reveal className="max-w-xl mb-10">
            <Chip>POWERED BY AI</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4 mb-3">Meet your AI learning coach</h2>
            <p className="text-[15px]" style={{ color: "var(--color-ink-dim)" }}>
              Not just a generator — an ongoing guide for the whole journey.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {AI_CAPABILITIES.map((c) => (
              <Reveal key={c.title}>
                <Card
                  className="hover-card p-6 h-full"
                  style={{ background: "linear-gradient(160deg, var(--color-bg-elev), var(--color-bg-elev2))" }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "color-mix(in srgb, var(--color-primary) 14%, transparent)" }}
                  >
                    <c.icon size={20} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <h3 className="display font-semibold text-base mb-2">{c.title}</h3>
                  <p className="text-sm" style={{ color: "var(--color-ink-dim)" }}>{c.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LARGE DASHBOARD PREVIEW */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <Reveal className="text-center max-w-xl mx-auto mb-10">
            <Chip>YOUR DASHBOARD</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">See your whole journey in one view</h2>
            <p className="text-[15px] mt-3" style={{ color: "var(--color-ink-dim)" }}>
              Roadmap, progress, planner, and achievements — all in one workspace.
            </p>
          </Reveal>

          <Reveal>
            <Card className="p-5 md:p-7" style={{ boxShadow: "0 30px 80px -25px rgba(0,0,0,0.5)" }}>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <span className="mono text-[10px]" style={{ color: "var(--color-ink-dim)" }}>ROADMAP</span>
                  <div className="flex flex-col gap-1.5 mt-2">
                    {[
                      ["Foundations", "done"],
                      ["Core Skills", "current"],
                      ["Projects", "locked"],
                    ].map(([label, state]) => (
                      <div key={label} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: "var(--color-bg)" }}>
                        <span
                          className="w-6 h-6 rounded-full flex-shrink-0"
                          style={{
                            background:
                              state === "current"
                                ? "linear-gradient(135deg,var(--color-primary),var(--color-primary-light))"
                                : state === "done"
                                ? "var(--color-success)"
                                : "var(--color-bg-elev2)",
                            border: `2px solid ${state === "current" ? "var(--color-primary)" : state === "done" ? "var(--color-success)" : "var(--color-line-strong)"}`,
                          }}
                        />
                        <span className="text-xs" style={{ opacity: state === "locked" ? 0.5 : 1 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mono text-[10px]" style={{ color: "var(--color-ink-dim)" }}>WEEKLY TASKS</span>
                  <div className="flex flex-col gap-1.5 mt-2">
                    {["Complete wireframing exercise", "Watch UI patterns course", "Review 2 case studies"].map((t, i) => (
                      <div key={t} className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background: "var(--color-bg)" }}>
                        <span
                          className="w-4 h-4 rounded flex-shrink-0"
                          style={i === 0 ? { background: "var(--color-success)" } : { border: "1px solid var(--color-line-strong)" }}
                        />
                        <span className="text-xs" style={i === 0 ? { color: "var(--color-ink-dim)", textDecoration: "line-through" } : {}}>{t}</span>
                      </div>
                    ))}
                  </div>

                  <span className="mono text-[10px] mt-4 block" style={{ color: "var(--color-ink-dim)" }}>ACHIEVEMENTS</span>
                  <div className="flex gap-2 mt-2">
                    {[
                      { Icon: Flame, label: "9-Day Streak" },
                      { Icon: Medal, label: "First Milestone" },
                      { Icon: Target, label: "Goal Started" },
                    ].map(({ Icon, label }) => (
                      <span key={label} className="inline-flex items-center gap-1 text-[10px] rounded-full px-2.5 py-1.5" style={{ background: "color-mix(in srgb, var(--color-primary) 12%, transparent)", color: "var(--color-primary)" }}>
                        <Icon size={11} /> {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <Reveal className="max-w-xl mb-10">
            <Chip>FEATURES</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4 mb-3">Everything you need to stay on course</h2>
            <p className="text-[15px]" style={{ color: "var(--color-ink-dim)" }}>
              One system, from first goal to final milestone.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Reveal key={f.title}>
                <Card className="hover-card p-7 h-full">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "var(--color-bg-elev2)", border: "1px solid var(--color-line)" }}
                  >
                    <f.icon size={18} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <h3 className="display font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-sm" style={{ color: "var(--color-ink-dim)" }}>{f.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <Reveal>
            <Chip>ABOUT LAUNCHPAD</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4 mb-5">About Launchpad</h2>
            <p className="text-[15px] leading-8 mb-4" style={{ color: "var(--color-ink-dim)" }}>
              Launchpad is an AI-powered career and learning platform designed to help students, professionals, and
              lifelong learners transform ambitious goals into structured action plans.
            </p>
            <p className="text-[15px] leading-8 mb-4" style={{ color: "var(--color-ink-dim)" }}>
              Instead of spending weeks searching for courses, tutorials, and learning paths, users simply describe
              their goal. Launchpad's AI analyzes the objective and generates a personalized roadmap tailored to the
              user's experience, available time, and learning preferences.
            </p>
            <p className="text-[15px] leading-8" style={{ color: "var(--color-ink-dim)" }}>
              The platform combines intelligent planning, curated learning resources, daily task generation, habit
              tracking, and progress analytics into one unified workspace — making long-term goals easier to achieve.
            </p>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS — timeline */}
      <section id="how" className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <Reveal className="max-w-xl mb-10">
            <Chip>HOW IT WORKS</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">Five steps from idea to outcome</h2>
          </Reveal>
          <div className="relative pl-1">
            <div className="absolute left-6 top-2 bottom-2 w-px" style={{ background: "var(--color-line-strong)" }} />
            {STEPS.map((s, i) => (
              <Reveal key={s.title}>
                <div className="grid gap-5 py-6" style={{ gridTemplateColumns: "48px 1fr" }}>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center z-10"
                    style={{ background: "var(--color-bg-elev)", border: "2px solid var(--color-primary)" }}
                  >
                    <s.icon size={18} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <div>
                    <span className="mono block text-xs mb-1 opacity-70" style={{ color: "var(--color-ink-dim)" }}>STEP {i + 1}</span>
                    <h3 className="display font-semibold text-base mb-1">{s.title}</h3>
                    <p className="text-sm max-w-md" style={{ color: "var(--color-ink-dim)" }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <Reveal>
            <Card
              className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 md:p-10 text-center"
              style={{
                boxShadow: "var(--shadow-card)",
                background: "linear-gradient(160deg, var(--color-bg-elev), var(--color-bg-elev2))",
              }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="display font-bold text-3xl md:text-4xl mb-1" style={{ color: "var(--color-primary)" }}>
                    {s.value}
                  </div>
                  <div className="text-xs" style={{ color: "var(--color-ink-dim)" }}>{s.label}</div>
                </div>
              ))}
            </Card>
          </Reveal>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section id="stories" className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <Reveal className="max-w-xl mb-10">
            <Chip>SUCCESS STORIES</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">People who reached their destination</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {STORIES.map((s) => (
              <Reveal key={s.name}>
                <Card className="hover-card p-6 h-full">
                  <div className="flex gap-0.5 mb-3" style={{ color: "var(--color-primary)" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm mb-5" style={{ color: "var(--color-ink-dim)", minHeight: "60px" }}>"{s.quote}"</p>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center display font-bold text-xs"
                      style={{ background: "var(--color-bg-elev2)", color: "var(--color-primary)", border: "1px solid var(--color-line-strong)" }}
                    >
                      {s.initial}
                    </div>
                    <div>
                      <div className="text-sm">{s.name}</div>
                      <div className="mono text-xs" style={{ color: "var(--color-ink-dim)" }}>{s.role}</div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <Reveal className="mb-10">
            <Chip>FAQ</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">Questions before you launch</h2>
          </Reveal>
          {FAQS.map((f, i) => (
            <div
              key={f.q}
              className="py-5 cursor-pointer"
              style={{ borderBottom: "1px solid var(--color-line)" }}
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
            >
              <div className="flex justify-between items-center text-[15.5px] font-medium">
                {f.q}
                <span className="mono transition-transform" style={{ color: "var(--color-primary)", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
              </div>
              {openFaq === i && (
                <div className="text-sm mt-3" style={{ color: "var(--color-ink-dim)" }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <Reveal className="max-w-xl mb-10">
            <Chip>CONTACT</Chip>
            <h2 className="display font-bold text-2xl md:text-3xl mt-4">Questions? Reach out.</h2>
          </Reveal>

          <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
            <Reveal>
              <Card className="p-7">
                {contactSent ? (
                  <div className="text-center py-10">
                    <div className="flex justify-center mb-3"><CheckCircle2 size={40} style={{ color: "var(--color-success)" }} /></div>
                    <p className="text-sm" style={{ color: "var(--color-ink-dim)" }}>
                      Thanks — your message has been sent. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="grid sm:grid-cols-2 gap-4">
                    {["Name", "Email"].map((label) => (
                      <div key={label}>
                        <label className="block text-xs font-mono mb-2" style={{ color: "var(--color-ink-dim)" }}>{label}</label>
                        <input
                          type={label === "Email" ? "email" : "text"}
                          required
                          className="w-full rounded-xl px-4 py-3 text-sm"
                          style={{ background: "var(--color-bg)", color: "var(--color-ink)", border: "1px solid var(--color-line)" }}
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono mb-2" style={{ color: "var(--color-ink-dim)" }}>Subject</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl px-4 py-3 text-sm"
                        style={{ background: "var(--color-bg)", color: "var(--color-ink)", border: "1px solid var(--color-line)" }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono mb-2" style={{ color: "var(--color-ink-dim)" }}>Message</label>
                      <textarea
                        rows={4}
                        required
                        className="w-full rounded-xl px-4 py-3 text-sm"
                        style={{ background: "var(--color-bg)", color: "var(--color-ink)", border: "1px solid var(--color-line)" }}
                      />
                    </div>
                    <button type="submit" className="btn-solid sm:col-span-2 rounded-full py-3.5 text-sm font-semibold">
                      Send Message
                    </button>
                  </form>
                )}
              </Card>
            </Reveal>

            <Reveal>
              <Card className="p-7 h-full flex flex-col gap-5 justify-center">
                {[
                  { Icon: Mail, label: "Email", value: "mhamrah112@gmail.com" },
                  { Icon: GithubIcon, label: "GitHub", value: "https://github.com/Maryam-Hamrah1" },
                  { Icon: LinkedinIcon, label: "LinkedIn", value: "https://www.linkedin.com/in/maryam-hamrah-5187442ab" },
                  { Icon: MapPin, label: "Location", value: "Afghanistan" },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--color-bg-elev2)", border: "1px solid var(--color-line)" }}
                    >
                      <Icon size={18} style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: "var(--color-ink-dim)" }}>{label}</div>
                      <div className="text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 text-center">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <Reveal>
            <div
              className="relative rounded-3xl px-6 sm:px-10 py-14 overflow-hidden"
              style={{
                border: "1px solid var(--color-line-strong)",
                background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 55%), linear-gradient(160deg, var(--color-bg-elev), var(--color-bg-elev2))`,
              }}
            >
              <h2 className="display font-bold text-2xl md:text-3xl mb-3 relative">Ready to start your journey?</h2>
              <p className="mb-7 relative" style={{ color: "var(--color-ink-dim)" }}>
                Transform your goals into an AI-powered roadmap today.
              </p>
              <Link to="/signUp" className="btn-solid inline-block rounded-full px-7 py-3.5 text-sm font-semibold relative">
                Create Free Roadmap
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--color-line)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-11 pb-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-9">
            <div>
              <Link to={'/'}>
              <div className="flex items-center gap-2.5 display font-bold text-base mb-3">
                <Logo className="w-7 h-7" /> Launchpad
              </div>
              </Link>
              
              <p className="text-xs max-w-[220px]" style={{ color: "var(--color-ink-dim)" }}>
                Turning dreams into roadmaps, one milestone at a time.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--color-ink-dim)" }}>Quick Links</h4>
              {["Home", "Features", "FAQ", "Contact"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm mb-2.5" style={{ color: "var(--color-ink-dim)" }}>{l}</a>
              ))}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--color-ink-dim)" }}>Legal</h4>
              {["Privacy Policy", "Terms"].map((l) => (
                <a key={l} href="#" className="block text-sm mb-2.5" style={{ color: "var(--color-ink-dim)" }}>{l}</a>
              ))}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider mb-4" style={{ color: "var(--color-ink-dim)" }}>Connect</h4>
              
              {[
              {label: "Email" , href:"mhamrah112@gmail.com"}, 
              {label:"GitHub", href:"https://github.com/Maryam-Hamrah1"}, 
              {label:"LinkedIn", href:"https://www.linkedin.com/in/maryam-hamrah-5187442ab"}


              ].map((item) => (
                <a key={item.label} href={item.href} className="block text-sm mb-2.5" style={{ color: "var(--color-ink-dim)" }}>{item.label}</a>
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