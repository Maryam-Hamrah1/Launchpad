import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoalContext } from "./GoalContext";
import { buildNotifications } from "./notificationUtils";
import { Bell, PartyPopper } from "lucide-react";

export default function NotificationBell() {
  const { goals } = useContext(GoalContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const notifications = buildNotifications(goals);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative w-10 h-10 rounded-xl text-sm flex items-center justify-center"
        style={{
          background: "var(--color-bg-elev)",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <Bell size={16} />
        {notifications.length > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--color-primary)" }}
          />
        )}
      </button>

      {open && (
        <div
          className="absolute left-0 top-12 w-64 max-w-[60vw] rounded-2xl p-2 z-50"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-line)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="px-3 py-2 text-xs font-mono" style={{ color: "var(--color-ink-dim)" }}>
            NOTIFICATIONS
          </div>

          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm flex flex-col items-center gap-2" style={{ color: "var(--color-ink-dim)" }}>
              <PartyPopper size={20} />
              You're all caught up
            </div>
          ) : (
            <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.link}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors"
                  style={{ color: "var(--color-ink)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-elev2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span className="flex-shrink-0"><n.icon size={18} /></span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug">{n.title}</span>
                    <span
                      className="block text-xs mt-0.5 truncate"
                      style={{ color: "var(--color-ink-dim)" }}
                    >
                      {n.detail}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
