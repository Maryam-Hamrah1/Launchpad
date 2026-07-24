import { collectCompletedDays, computeStreak, hasCompletedToday } from "./streakUtils";
import { Flame, FileEdit, Map, Target } from "lucide-react";

// Builds a live list of "things worth your attention right now" from
// the goals data already in context. Nothing is stored — this is
// recomputed fresh every time it's called, so it always reflects
// current state (no "mark as read" concept).
export function buildNotifications(goals) {
  const notifications = [];

  const completedDays = collectCompletedDays(goals);
  const streak = computeStreak(completedDays);
  const doneToday = hasCompletedToday(goals);

  if (streak > 0 && !doneToday) {
    notifications.push({
      id: "streak",
      icon: Flame,
      title: `${streak}-day streak — keep it going`,
      detail: "Complete a mission today to extend your streak.",
      link: "/dashboard",
    });
  }

  const drafts = goals.filter((g) => g.status === "draft");
  if (drafts.length > 0) {
    notifications.push({
      id: "drafts",
      icon: FileEdit,
      title: `${drafts.length} draft goal${drafts.length > 1 ? "s" : ""} waiting`,
      detail: drafts.map((d) => d.title || "Untitled goal").join(", "),
      link: drafts.length === 1 ? `/goals/${drafts[0].id}` : "/dashboard",
    });
  }

  const active = goals.filter((g) => g.status === "active" && g.roadmap);

  for (const goal of active) {
    const month = goal.roadmap.months.find((m) => m.status === "current");
    if (!month) continue;

    if (!month.detail) {
      notifications.push({
        id: `month-ready-${goal.id}`,
        icon: Map,
        title: `Month ${month.index} is ready to generate`,
        detail: goal.title,
        link: `/goals/${goal.id}/month/${month.index}`,
      });
      continue;
    }

    const days = month.detail.days || [];
    const nextDay = days.find((d) => !d.completed);

    if (nextDay) {
      notifications.push({
        id: `day-${goal.id}-${month.index}-${nextDay.index}`,
        icon: Target,
        title: `Day ${nextDay.index} is ready`,
        detail: goal.title,
        link: `/goals/${goal.id}/month/${month.index}/day/${nextDay.index}`,
      });
    }
  }

  return notifications;
}
