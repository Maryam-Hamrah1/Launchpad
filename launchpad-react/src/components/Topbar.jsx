import { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../components/ThemeContext";
import { AuthContext } from "../components/AuthContext";
import { GoalContext } from "../components/GoalContext";
import NotificationBell from "./NotificationBell"
import { Link, useNavigate } from "react-router-dom";
import { Target, LayoutDashboard, Bot, BookOpen, TrendingUp, User, CalendarDays, Settings as SettingsIcon } from "lucide-react";
import { Moon, Sun } from "lucide-react";

const PAGES = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "AI Coach", path: "/ai-coach", icon: Bot },
  { title: "Goals", path: "/goals", icon: Target },
  { title: "Resources", path: "/resources", icon: BookOpen },
  { title: "Progress", path: "/progress", icon: TrendingUp },
  { title: "Profile", path: "/profile", icon: User },
  { title: "Planner", path: "/planner", icon: CalendarDays },
  { title: "Settings", path: "/Settings", icon: SettingsIcon },
];

function HamburgerIcon({ isOpen }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {isOpen ? <path d="M6 6 L18 18 M6 18 L18 6" /> : <path d="M4 7 H20 M4 12 H20 M4 17 H20" />}
    </svg>
  );
}

export default function Topbar({ mobileOpen, onToggleMobile }) {
  const { isLight, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { goals } = useContext(GoalContext);
  const navigate = useNavigate();

  const fullName = user?.user_metadata?.full_name || "Maryam";

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = query.trim().toLowerCase();

  const matchedGoals = q
    ? goals
        .filter((g) => (g.title || "").toLowerCase().includes(q))
        .slice(0, 5)
        .map((g) => ({ title: g.title || "Untitled goal", path: `/goals/${g.id}`, icon: Target, type: "Goal" }))
    : [];

  const matchedPages = q
    ? PAGES.filter((p) => p.title.toLowerCase().includes(q)).map((p) => ({ ...p, type: "Page" }))
    : [];

  const results = [...matchedGoals, ...matchedPages];

  function goTo(path) {
    navigate(path);
    setQuery("");
    setShowResults(false);
  }

  return (
    <header
      className="sticky top-0 z-30 px-8 py-5 w-full backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--color-bg) 80%, transparent)" }}
    >
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile menu toggle — hidden on desktop, the sidebar has its own arrow there */}
          <button
            onClick={onToggleMobile}
            aria-label="Toggle menu"
            className="md:hidden flex-shrink-0 w-10 h-10 rounded-xl transition-all flex items-center justify-center"
            style={{
              background: "var(--color-bg-elev)",
              border: "1px solid var(--color-line)",
              boxShadow: "var(--shadow-card)",
              color: "var(--color-ink)",
            }}
          >
            <HamburgerIcon isOpen={mobileOpen} />
          </button>

          {/* Search — hidden on phone, visible from tablet (md) up */}
          <div className="hidden md:block relative flex-1 max-w-2xl" ref={searchRef}>
            <div
              className="flex items-center gap-2 rounded-xl px-4 h-11"
              style={{
                background: "var(--color-bg-elev)",
                border: "1px solid var(--color-line)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-dim)" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20L17 17" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                placeholder="Search goals, roadmap, planner..."
                className="flex-1 bg-transparent outline-none text-xs"
                style={{ color: "var(--color-ink)" }}
              />
            </div>

            {showResults && q && (
              <div
                className="absolute left-0 top-12 w-full rounded-2xl p-2 z-50 max-h-80 overflow-y-auto"
                style={{
                  background: "var(--color-bg-elev)",
                  border: "1px solid var(--color-line)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {results.length === 0 ? (
                  <p className="px-3 py-4 text-xs text-center" style={{ color: "var(--color-ink-dim)" }}>
                    No matches for "{query}"
                  </p>
                ) : (
                  results.map((r) => (
                    <button
                      key={`${r.type}-${r.path}`}
                      onClick={() => goTo(r.path)}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:brightness-110 transition"
                      style={{ background: "transparent" }}
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--color-bg)" }}
                      >
                        <r.icon size={15} style={{ color: "var(--color-primary)" }} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium truncate">{r.title}</span>
                        <span className="block text-[10px]" style={{ color: "var(--color-ink-dim)" }}>{r.type}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme */}
                <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl transition-all flex items-center justify-center"
            style={{
              background: "var(--color-bg-elev)",
              border: "1px solid var(--color-line)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Notification */}
          <NotificationBell/>

          {/* Profile */}
          <Link to="/profile">
          <div
            className="flex items-center gap-2 rounded-xl px-2.5 py-1.5"
            style={{
              background: "var(--color-bg-elev)",
              border: "1px solid var(--color-line)",
              boxShadow: "var(--shadow-card)",
            }}
            >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: "linear-gradient(135deg,var(--color-primary),var(--color-accent))",
                color: "#111",
              }}
              >
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden md:block">
              <div className="text-sm font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {fullName}
              </div>
              <div className="text-[11px]" style={{ color: "var(--color-ink-dim)" }}>
                Welcome Back
              </div>
            </div>
          </div>
              </Link>
        </div>
      </div>
    </header>
  );
}