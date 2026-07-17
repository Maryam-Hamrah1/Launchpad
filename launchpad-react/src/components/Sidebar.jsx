import { NavLink } from "react-router-dom";


const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "M4 12 L12 4 L20 12 M6 10 V20 H18 V10",
  },
  { 
    to: "/goals", 
    label: "Goals", 
    icon: "circle:8|3" 
  },
  {
    to: "/planner",
    label: "Planner",
    icon: "M4 6 C4 6 8 4 12 6 C16 4 20 6 20 6 V18 C20 18 16 16 12 18 C8 16 4 18 4 18 Z",
  },
  { 
    to: "/ai-coach", 
    label: "AI Coach", 
    icon: "coach" 
  },
  {
    to: "/resources",
    label: "Resources",
    icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  },
  {
    to: "/progress",
    label: "Progress",
    icon: "M4 20 V13 M10 20 V8 M16 20 V11 M22 20 V4",
  },
  { 
    to: "/profile", 
    label: "Profile", 
    icon: "profile" 
  },
  { 
    to: "/settings", 
    label: "Settings", 
    icon: "gear" 
  },
];



function NavIcon({ type }) {

  if (type === "circle:8|3") {
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }


  if (type === "coach") {
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="9" r="5" />
        <path d="M6 20 C6 16.5 8.5 14 12 14 C15.5 14 18 16.5 18 20" />
      </svg>
    );
  }


  if (type === "profile") {
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20 C4 15.5 7.5 13 12 13 C16.5 13 20 15.5 20 20" />
      </svg>
    );
  }


  if (type === "gear") {
    return (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }


  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={type} />
    </svg>
  );
}



export default function Sidebar() {

  return (
    <aside
      className="w-56 flex-shrink-0 hidden md:flex md:flex-col px-3 py-5"
      style={{
        borderRight: "1px solid var(--color-line)",
      }}
    >


      {/* Logo */}

      <div
        className="flex items-center gap-2.5 font-bold text-[15px] px-2 mb-7"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >

        <svg
          className="w-6 h-6"
          viewBox="0 0 30 30"
          fill="none"
        >

          <circle
            cx="15"
            cy="15"
            r="12.5"
            stroke="var(--color-primary)"
            strokeWidth="1.3"
          />

          <path
            d="M15 7 L15 23 M7 15 L23 15"
            stroke="var(--color-line-strong)"
            strokeWidth="1"
          />

          <circle
            cx="15"
            cy="15"
            r="2.6"
            fill="var(--color-primary)"
          />

        </svg>
        Launchpad

      </div>




      {/* Navigation */}

      <nav className="flex flex-col gap-0.5">

        {NAV_ITEMS.map((item) => (

          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-all"
            style={({ isActive }) => ({

              background: isActive
                ? "color-mix(in srgb, var(--color-primary) 14%, transparent)"
                : "transparent",

              color: isActive
                ? "var(--color-primary)"
                : "var(--color-ink-dim)",

              fontWeight: isActive ? 600 : 400,

            })}
          >

            <NavIcon type={item.icon} />

            {item.label}

          </NavLink>

        ))}

      </nav>


    </aside>
  );
}