import { useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";
import { AuthContext } from "../components/AuthContext";

export default function Topbar() {
  const { isLight, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const fullName =
    user?.user_metadata?.full_name || "Maryam";

  return (
    <header
  className="sticky top-0 z-40 px-8 py-5 w-full"
  style={{
    background: "var(--color-bg)",
  }}
>
  <div className="flex flex-col lg:flex-row lg:items-center justify-between">

    {/* Search */}
    <div
      className="flex items-center gap-2 rounded-xl px-4 h-11 flex-1 max-w-2xl"
      style={{
        background: "var(--color-bg-elev)",
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-card)",
      }}
    >

      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-ink-dim)"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20L17 17" />
      </svg>

      <input
        type="text"
        placeholder="Search goals, roadmap, planner..."
        className="flex-1 bg-transparent outline-none text-xs"
        style={{
          color: "var(--color-ink)",
        }}
      />

    </div>


    {/* Right */}
    <div className="flex items-center gap-3">


      {/* Theme */}
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-xl transition-all text-sm"
        style={{
          background: "var(--color-bg-elev)",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {isLight ? "🌙" : "☀️"}
      </button>


      {/* Notification */}
      <button
        className="relative w-10 h-10 rounded-xl text-sm"
        style={{
          background: "var(--color-bg-elev)",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-card)",
        }}
      >

        🔔

        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
          style={{
            background: "var(--color-primary)",
          }}
        />

      </button>


      {/* Profile */}
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
            background:
              "linear-gradient(135deg,var(--color-primary),var(--color-accent))",
            color:"#111",
          }}
        >
          {fullName.charAt(0).toUpperCase()}
        </div>


        <div className="hidden md:block">

          <div
            className="text-sm font-semibold"
            style={{
              fontFamily:"'Space Grotesk', sans-serif",
            }}
          >
            {fullName}
          </div>


          <div
            className="text-[11px]"
            style={{
              color:"var(--color-ink-dim)",
            }}
          >
            Welcome Back
          </div>

        </div>

      </div>


    </div>

  </div>
</header>
  );
}