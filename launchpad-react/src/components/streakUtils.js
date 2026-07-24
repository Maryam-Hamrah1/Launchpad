// Shared streak logic. Import from here everywhere instead of
// re-implementing collectCompletedDays/computeStreak locally —
// that duplication is what caused the streak number to disagree
// with the calendar in different parts of the app.

export function collectCompletedDays(goals) {
  const days = [];

  for (const goal of goals) {
    if (!goal.roadmap) continue;

    for (const month of goal.roadmap.months) {
      if (!month.detail) continue;

      for (const day of month.detail.days || []) {
        if (day.completed && day.completedAt) {
          days.push(day);
        }
      }
    }
  }

  return days;
}

// A streak stays alive through the grace period: if the most recent
// completed day was today OR yesterday, we count backward from there.
// Only if the most recent completion is 2+ days old does the streak
// reset to 0. This is why "complete something today, see it hold
// steady tomorrow until you either complete something again or the
// day passes with nothing done" — not an instant reset at midnight.
export function computeStreak(days) {
  const dates = new Set(
    days.map((d) => new Date(d.completedAt).toDateString())
  );

  if (dates.size === 0) return 0;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let cursor;
  if (dates.has(today.toDateString())) {
    cursor = today;
  } else if (dates.has(yesterday.toDateString())) {
    cursor = yesterday;
  } else {
    return 0;
  }

  let streak = 0;
  while (dates.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

// True if any goal already has a completed day dated today —
// used to decide whether to show the "streak increased" toast
// (only on the FIRST completion of the calendar day, regardless
// of which goal it's for).
export function hasCompletedToday(goals) {
  const todayKey = new Date().toDateString();
  return collectCompletedDays(goals).some(
    (d) => new Date(d.completedAt).toDateString() === todayKey
  );
}
