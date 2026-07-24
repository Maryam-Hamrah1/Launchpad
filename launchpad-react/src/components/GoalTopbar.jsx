import { useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";
import { AuthContext } from "../components/AuthContext";
import NotificationBell from "./NotificationBell"
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

function HamburgerIcon({ isOpen }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {isOpen ? <path d="M6 6 L18 18 M6 18 L18 6" /> : <path d="M4 7 H20 M4 12 H20 M4 17 H20" />}
    </svg>
  );
}

export default function GoalTopbar({ mobileOpen, onToggleMobile }) {
  const { isLight, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const fullName = user?.user_metadata?.full_name || "Maryam";

  return (
    <header className="sticky top-0 z-30 px-8 py-5 w-full backdrop-blur-md"
  style={{ background: "color-mix(in srgb, var(--color-bg) 80%, transparent)" }}>
      <div className="flex items-center justify-between">
        {/* Mobile menu toggle — hidden on desktop, the sidebar has its own arrow there */}
        <button
          onClick={onToggleMobile}
          aria-label="Toggle menu"
          className="md:hidden w-10 h-10 rounded-xl transition-all flex items-center justify-center"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
            boxShadow: "var(--shadow-card)",
            color: "var(--color-ink)",
          }}
        >
          <HamburgerIcon isOpen={mobileOpen} />
        </button>

        {/* spacer so the right-side cluster stays right-aligned on desktop */}
        <div className="hidden md:block flex-1" />

        {/* Right */}
        <div className="flex items-center gap-3">
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

          <NotificationBell/>

          
          {/* profile */}
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
