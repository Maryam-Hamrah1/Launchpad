import { useContext, useMemo } from "react";
import { GoalContext } from "./GoalContext";

function collectCompletedDays(goals) {
  const days = [];

  for (const goal of goals) {
    if (!goal.roadmap) continue;

    for (const month of goal.roadmap.months) {
      if (!month.detail) continue;

      for (const day of month.detail.days || []) {
        if (day.completed && day.completedAt) {
          days.push(day.completedAt);
        }
      }
    }
  }

  return days;
}


function calculateStreak(days) {
  const dates = new Set(
    days.map((d) => new Date(d).toDateString())
  );

  let streak = 0;
  const today = new Date();

  while (dates.has(today.toDateString())) {
    streak++;
    today.setDate(today.getDate() - 1);
  }

  return streak;
}


export default function StreakCalendar() {

  const { goals } = useContext(GoalContext);


  const completedDays = useMemo(
    () => collectCompletedDays(goals),
    [goals]
  );


  const streak = useMemo(
    () => calculateStreak(completedDays),
    [completedDays]
  );


  const days = Array.from({ length: 28 });


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
            className="text-2xl font-bold"
            style={{
              color:"var(--color-primary)"
            }}
          >
            🔥 {streak}
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



      <div className="grid grid-cols-7 gap-2">

        {days.map((_, index)=>{

          const active =
            index <  completedDays.length;


          return (

            <div
              key={index}
              className="aspect-square rounded-md"
              style={{
                background: active
                ? "var(--color-primary)"
                : "var(--color-bg-elev2)",
                opacity: active ? 1 : .45
              }}
            />

          );

        })}

      </div>


      <div
        className="flex justify-between mt-4 text-xs"
        style={{
          color:"var(--color-ink-dim)"
        }}
      >

        <span>Last 28 days</span>

        <span>
          {completedDays.length} completed
        </span>

      </div>


    </div>

  );
}