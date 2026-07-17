import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { GoalContext } from "../components/GoalContext";

function getEffectiveStatus(goal) {
  if (goal.status === "draft") return "draft";

  if (
    goal.roadmap &&
    goal.roadmap.months.every((m) => m.status === "completed")
  ) {
    return "completed";
  }

  return "in-progress";
}

function collectCompletedDays(goals) {
  const days = [];

  for (const goal of goals) {
    if (!goal.roadmap) continue;

    for (const month of goal.roadmap.months) {
      if (!month.detail) continue;

      for (const week of month.detail.weeks) {
        if (!week.detail) continue;

        for (const day of week.detail.days) {
          if (day.status === "completed" && day.completedAt) {
            days.push(day);
          }
        }
      }
    }
  }

  return days;
}

function computeStreak(days) {
  const dates = new Set(
    days.map((d) => new Date(d.completedAt).toDateString())
  );

  let streak = 0;
  const today = new Date();

  while (dates.has(today.toDateString())) {
    streak++;
    today.setDate(today.getDate() - 1);
  }

  return streak;
}

function computeBadges(goals, streak) {
  const badges = [];

  const goalCreated = goals.length > 0;

  const weekCompleted = goals.some((g) =>
    g.roadmap?.months.some((m) =>
      m.detail?.weeks.some((w) => w.status === "completed")
    )
  );

  const monthCompleted = goals.some((g) =>
    g.roadmap?.months.some((m) => m.status === "completed")
  );

  const goalCompleted = goals.some(
    (g) => getEffectiveStatus(g) === "completed"
  );


  if (goalCreated)
    badges.push({
      icon: "🎯",
      title: "First Goal",
      desc: "Created your first goal",
    });


  if (weekCompleted)
    badges.push({
      icon: "✅",
      title: "First Week",
      desc: "Completed a milestone",
    });


  if (monthCompleted)
    badges.push({
      icon: "🗓",
      title: "First Month",
      desc: "Finished a month",
    });


  if (streak >= 7)
    badges.push({
      icon: "🔥",
      title: "7 Day Streak",
      desc: "Stayed consistent",
    });


  if (goalCompleted)
    badges.push({
      icon: "🏆",
      title: "Goal Achieved",
      desc: "Completed a goal",
    });


  return badges;
}


function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl p-6 ${className}`}
      style={{
        background: "var(--color-bg-elev)",
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {children}
    </div>
  );
}



export default function Profile() {

  const { user, signOut } = useContext(AuthContext);
  const { goals, loading } = useContext(GoalContext);
  const navigate = useNavigate();


  const stats = useMemo(() => {

    const activeGoals = goals.filter(
      (g) => getEffectiveStatus(g) === "in-progress"
    );


    const streak = computeStreak(
      collectCompletedDays(goals)
    );


    return {
      activeGoals,
      streak,
      badges: computeBadges(goals, streak)
    };

  }, [goals]);



  if (loading) {

    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:"var(--color-bg)",
          color:"var(--color-ink-dim)"
        }}
      >
        Loading...
      </div>
    );

  }



  const fullName =
    user?.user_metadata?.full_name || "User";


  const initial =
    fullName.charAt(0).toUpperCase();



  return (

    <div
      className="w-full"
      style={{
        color:"var(--color-ink)"
      }}
    >


      {/* Hero Profile */}

      <Card className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">


          <div className="flex items-center gap-5">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{
                background:
                "linear-gradient(135deg,var(--color-primary),var(--color-primary-light))",
                color:"#111"
              }}
            >
              {initial}
            </div>



            <div>

              <h1
                className="text-2xl font-bold"
                style={{
                  fontFamily:"'Space Grotesk',sans-serif"
                }}
              >
                {fullName}
              </h1>


              <p
                className="text-sm mt-1"
                style={{
                  color:"var(--color-ink-dim)"
                }}
              >
                {user?.email}
              </p>


              <p
                className="text-sm mt-3 max-w-md leading-6"
                style={{
                  color:"var(--color-ink-dim)"
                }}
              >
                Building my future through learning, consistency and AI powered goals.
              </p>


            </div>


          </div>



          <button
            className="rounded-xl px-5 py-3 font-semibold text-sm"
            style={{
              background:"var(--color-primary)",
              color:"#111"
            }}
          >
            Edit Profile
          </button>


        </div>


      </Card>





      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-5 mb-8">


        <Card>

          <p
            className="text-xs mb-2"
            style={{
              color:"var(--color-ink-dim)"
            }}
          >
            ACTIVE GOALS
          </p>


          <h2
            className="text-3xl font-bold"
            style={{
              color:"var(--color-primary)"
            }}
          >
            {stats.activeGoals.length}
          </h2>

        </Card>



        <Card>

          <p
            className="text-xs mb-2"
            style={{
              color:"var(--color-ink-dim)"
            }}
          >
            CURRENT STREAK
          </p>


          <h2
            className="text-3xl font-bold"
            style={{
              color:"var(--color-success)"
            }}
          >
            {stats.streak}d
          </h2>


        </Card>


        <Card>

          <p
            className="text-xs mb-2"
            style={{
              color:"var(--color-ink-dim)"
            }}
          >
            ACHIEVEMENTS
          </p>


          <h2
            className="text-3xl font-bold"
            style={{
              color:"var(--color-accent)"
            }}
          >
            {stats.badges.length}
          </h2>


        </Card>


      </div>






      {/* Active Goals */}


      <Card className="mb-8">


        <h2
          className="text-xl font-semibold mb-5"
          style={{
            fontFamily:"'Space Grotesk',sans-serif"
          }}
        >
          Active Goals
        </h2>



        {
          stats.activeGoals.length === 0 ? (

            <p
              className="text-sm"
              style={{
                color:"var(--color-ink-dim)"
              }}
            >
              No active goals yet.
            </p>


          ) : (


            <div className="grid md:grid-cols-2 gap-4">


              {
                stats.activeGoals.map((goal)=>(

                  <button
                    key={goal.id}
                    onClick={()=>navigate(`/goals/${goal.id}`)}
                    className="text-left rounded-2xl p-4 transition"
                    style={{
                      background:"var(--color-bg)",
                      border:"1px solid var(--color-line)"
                    }}
                  >
                    <h3
                      className="font-semibold mb-2"
                      style={{
                        fontFamily:"'Space Grotesk',sans-serif"
                      }}
                    >
                      {goal.title}
                    </h3>


                    <div
                      className="text-xs"
                      style={{
                        color:"var(--color-ink-dim)"
                      }}
                    >
                      {goal.category || "Career"}
                    </div>


                  </button>


                ))
              }


            </div>


          )
        }


      </Card>






      {/* Achievements */}


      <Card className="mb-8">


        <h2
          className="text-xl font-semibold mb-5"
          style={{
            fontFamily:"'Space Grotesk',sans-serif"
          }}
        >
          Achievements
        </h2>



        {
          stats.badges.length === 0 ? (

            <p
              className="text-sm"
              style={{
                color:"var(--color-ink-dim)"
              }}
            >
              Complete tasks to unlock achievements.
            </p>


          ) : (


            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">


              {
                stats.badges.map((badge)=>(

                  <div
                    key={badge.title}
                    className="rounded-2xl p-5"
                    style={{
                      background:"var(--color-bg)",
                      border:"1px solid var(--color-line)"
                    }}
                  >

                    <div className="text-3xl mb-3">
                      {badge.icon}
                    </div>


                    <h3
                      className="font-semibold"
                    >
                      {badge.title}
                    </h3>


                    <p
                      className="text-xs mt-1"
                      style={{
                        color:"var(--color-ink-dim)"
                      }}
                    >
                      {badge.desc}
                    </p>


                  </div>


                ))
              }


            </div>


          )
        }


      </Card>






      <button
        onClick={async()=>{
          await signOut();
          navigate("/login");
        }}
        className="rounded-xl px-6 py-3 font-semibold text-sm"
        style={{
          border:"1px solid var(--color-line)",
          color:"var(--color-danger)"
        }}
      >
        Log Out
      </button>



    </div>

  );
}