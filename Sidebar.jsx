import { NavLink, useParams } from "react-router-dom";

function NavIcon({ type }) {
  if (type === "circle:8|3") {
    return (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (type === "coach") {
    return (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="9" r="5" />
        <path d="M6 20 C6 16.5 8.5 14 12 14 C15.5 14 18 16.5 18 20" />
      </svg>
    );
  }
  if (type === "profile") {
    return (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20 C4 15.5 7.5 13 12 13 C16.5 13 20 15.5 20 20" />
      </svg>
    );
  }
  if (type === "gear") {
    return (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  if (type === "target") {
    return (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (type === "calendar") {
    return (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10 H21 M8 3 V7 M16 3 V7" />
      </svg>
    );
  }
  if (type === "sun") {
    return (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3 M12 19v3 M4.2 4.2l2.1 2.1 M17.7 17.7l2.1 2.1 M2 12h3 M19 12h3 M4.2 19.8l2.1-2.1 M17.7 6.3l2.1-2.1" />
      </svg>
    );
  }

  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={type} />
    </svg>
  );
}

export default function Sidebar({ expanded, onToggleExpanded, mobileOpen, onCloseMobile }) {
  const { goalId, monthIndex, dayIndex } = useParams();

  const MAIN_ITEMS = [
    { to: "/dashboard", label: "Dashboard", icon: "M4 12 L12 4 L20 12 M6 10 V20 H18 V10" },
    { to: "/goals", label: "Goals", icon: "circle:8|3" },

    // Breadcrumb-style entries for wherever you currently are in a goal's journey
    ...(goalId ? [{ to: `/goals/${goalId}`, label: "Roadmap", icon: "target" }] : []),
    ...(goalId && monthIndex
      ? [{ to: `/goals/${goalId}/month/${monthIndex}`, label: "Month Details", icon: "calendar" }]
      : []),
    ...(goalId && monthIndex && dayIndex
      ? [{ to: `/goals/${goalId}/month/${monthIndex}/day/${dayIndex}`, label: "Day Planner", icon: "sun" }]
      : []),

    {
      to: "/planner",
      label: "Planner",
      icon: "M4 6 C4 6 8 4 12 6 C16 4 20 6 20 6 V18 C20 18 16 16 12 18 C8 16 4 18 4 18 Z",
    },
    { to: "/ai-coach", label: "AI Coach", icon: "coach" },
    {
      to: "/resources",
      label: "Resources",
      icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    },
    { to: "/progress", label: "Progress", icon: "M4 20 V13 M10 20 V8 M16 20 V11 M22 20 V4" },
  ];

  const FOOTER_ITEMS = [
    { to: "/profile", label: "Profile", icon: "profile" },
    { to: "/settings", label: "Settings", icon: "gear" },
  ];

  const showLabels = expanded || mobileOpen;

  function NavItem(item) {
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === "/dashboard"}
        title={item.label}
        onClick={onCloseMobile}
        className={`flex items-center gap-3 rounded-lg py-2 text-[13px] transition-all whitespace-nowrap ${
          showLabels ? "px-3" : "px-0 justify-center"
        }`}
        style={({ isActive }) => ({
          background: isActive ? "color-mix(in srgb, var(--color-primary) 14%, transparent)" : "transparent",
          color: isActive ? "var(--color-primary)" : "var(--color-ink-dim)",
          fontWeight: isActive ? 600 : 400,
        })}
      >
        <NavIcon type={item.icon} />
        {showLabels && item.label}
      </NavLink>
    );
  }

  return (
    <>
      {/* Backdrop — mobile only, shown while the menu is open */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onCloseMobile} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex-shrink-0
          transition-[width] duration-300 ease-in-out
          ${mobileOpen ? "w-64" : "w-0"}
          ${expanded ? "md:w-56" : "md:w-16"}
        `}
        style={{
          borderRight: "1px solid var(--color-line)",
          background: "var(--color-bg)",
          boxShadow: mobileOpen ? "var(--shadow-card)" : "none",
        }}
      >
        {/* Desktop expand/collapse arrow — outside the clipped content wrapper */}
        <button
          onClick={onToggleExpanded}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className="hidden md:flex absolute -right-3 top-8 w-6 h-6 rounded-full items-center justify-center z-10 transition-transform"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
            boxShadow: "var(--shadow-card)",
            color: "var(--color-ink)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: expanded ? "rotate(0deg)" : "rotate(180deg)" }}
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        {/* Clipped content */}
        <div
          className={`h-full flex flex-col py-5 overflow-hidden ${mobileOpen ? "px-3" : "px-2"} ${
            expanded ? "md:px-3" : "md:px-2"
          }`}
        >
          {/* Logo */}
          <div
            className={`flex items-center gap-2.5 font-bold text-[15px] mb-7 whitespace-nowrap ${
              showLabels ? "px-2" : "justify-center"
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="12.5" stroke="var(--color-primary)" strokeWidth="1.3" />
              <path d="M15 7 L15 23 M7 15 L23 15" stroke="var(--color-line-strong)" strokeWidth="1" />
              <circle cx="15" cy="15" r="2.6" fill="var(--color-primary)" />
            </svg>
            {showLabels && "Launchpad"}
          </div>

          {/* Main navigation */}
          <nav className="flex flex-col gap-0.5">{MAIN_ITEMS.map(NavItem)}</nav>

          {/* Spacer pushes footer items to the bottom */}
          <div className="flex-1" />

          {/* Footer nav: Profile & Settings */}
          <nav
            className="flex flex-col gap-0.5 pt-3"
            style={{ borderTop: "1px solid var(--color-line)" }}
          >
            {FOOTER_ITEMS.map(NavItem)}
          </nav>
        </div>
      </aside>
    </>
  );
}
