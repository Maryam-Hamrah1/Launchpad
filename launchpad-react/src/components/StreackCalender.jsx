import { useContext, useMemo } from "react";
import { GoalContext } from "./GoalContext";
import { collectCompletedDays, computeStreak } from "./streakUtils";
import { Flame } from "lucide-react";

// Week starts on Saturday. JS getDay(): 0=Sun...6=Sat.
// Map so Saturday -> 0, Sunday -> 1, ... Friday -> 6.
const WEEKDAY_LABELS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const toSaturdayFirstIndex = (jsDay) => (jsDay + 1) % 7;

export default function StreakCalendar() {

  const { goals } = useContext(GoalContext);


  const completedDays = useMemo(
    () => collectCompletedDays(goals),
    [goals]
  );


  const streak = useMemo(
    () => computeStreak(completedDays),
    [completedDays]
  );


  const completedDates = useMemo(
    () => new Set(completedDays.map((d) => new Date(d.completedAt).toDateString())),
    [completedDays]
  );

  const today = new Date();

  // Real month grid: weekday-aligned cells for the current month,
  // padded with blanks so day 1 sits under its actual weekday column.
  const monthLabel = today.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const cells = useMemo(() => {
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingBlanks = toSaturdayFirstIndex(firstOfMonth.getDay());

    const list = [];
    for (let i = 0; i < leadingBlanks; i++) {
      list.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(new Date(year, month, d));
    }
    // pad the tail so the grid always ends on a full week
    while (list.length % 7 !== 0) {
      list.push(null);
    }
    return list;
  }, []);


  return (

    <div
      className="rounded-3xl p-6"
      style={{
        background:"var(--color-bg-elev)",
        border:"1px solid var(--color-line)",
        boxShadow:"var(--shadow-card)"
      }}
    >


      <div className="flex justify-between items-center mb-5">

        <div>

          <h3
            className="font-semibold text-lg"
            style={{
              fontFamily:"'Space Grotesk', sans-serif"
            }}
          >
            Streak Calendar
          </h3>

          <p
            className="text-xs mt-1"
            style={{
              color:"var(--color-ink-dim)"
            }}
          >
            Keep your momentum going
          </p>

        </div>


        <div
          className="text-right"
        >

          <div
  className="text-2xl font-bold flex items-center gap-1.5"
  style={{
    color:"var(--color-primary)"
  }}
>
  <Flame size={22} /> {streak}
</div>

          <span
            className="text-xs"
            style={{
              color:"var(--color-ink-dim)"
            }}
          >
            days
          </span>

        </div>


      </div>


      <div dir="ltr">

        <div className="text-center text-xs font-medium mb-2" style={{ color:"var(--color-ink-dim)" }}>
          {monthLabel}
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="text-center text-xs font-medium"
              style={{ color:"var(--color-ink-dim)" }}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">

          {cells.map((date, index) => {

            if (!date) {
              return <div key={index} className="aspect-square" />;
            }

            const active = completedDates.has(date.toDateString());
            const isToday = date.toDateString() === today.toDateString();

            return (

              <div
                key={index}
                title={date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                className="aspect-square rounded-md flex items-center justify-center text-[10px] font-medium"
                style={{
                  background: active
                  ? "var(--color-primary)"
                  : "var(--color-bg-elev2)",
                  opacity: active ? 1 : .45,
                  outline: isToday ? "2px solid var(--color-primary)" : "none",
                  outlineOffset: "1px",
                  color: active ? "var(--color-bg-elev)" : "var(--color-ink-dim)",
                }}
              >
                {date.getDate()}
              </div>

            );

          })}

        </div>

      </div>


      <div
        className="flex justify-between mt-4 text-xs"
        style={{
          color:"var(--color-ink-dim)"
        }}
      >

        <span>{monthLabel}</span>

        <span>
          {completedDates.size} active days
        </span>

      </div>


    </div>

  );
}
