import { useState } from "react";
import { Outlet } from "react-router-dom";
import GoalSidebar from "./GoalSidebar";
import GoalTopbar from "./GoalTopbar";

export default function GoalLayout() {
  const [expanded, setExpanded] = useState(true); // desktop rail: wide by default
  const [mobileOpen, setMobileOpen] = useState(false); // mobile overlay: closed by default

  return (
    <div
      className="h-screen overflow-hidden flex"
      style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}
    >
      <GoalSidebar
        expanded={expanded}
        onToggleExpanded={() => setExpanded((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Right column shifts to make room for the fixed sidebar on desktop only */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-screen transition-[margin] duration-300 ease-in-out ${
          expanded ? "md:ml-56" : "md:ml-16"
        }`}
      >
        <GoalTopbar mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen((v) => !v)} />

        {/* Only this scrolls */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
