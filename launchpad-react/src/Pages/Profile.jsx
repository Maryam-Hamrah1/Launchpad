import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { GoalContext } from "../components/GoalContext";
import { supabase } from "../supabaseClient";
import { Target, CheckCircle2, CalendarDays, Flame, Trophy, Pencil, X, Check } from "lucide-react";

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

      for (const day of month.detail.days || []) {
        if (day.completed && day.completedAt) {
          days.push(day);
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

  const dayCompleted = goals.some((g) =>
    g.roadmap?.months.some((m) =>
      (m.detail?.days || []).some((d) => d.completed)
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
      icon: Target,
      title: "First Goal",
      desc: "Created your first goal",
    });


  if (dayCompleted)
    badges.push({
      icon: CheckCircle2,
      title: "First Day",
      desc: "Completed a daily mission",
    });


  if (monthCompleted)
    badges.push({
      icon: CalendarDays,
      title: "First Month",
      desc: "Finished a month",
    });


  if (streak >= 7)
    badges.push({
      icon: Flame,
      title: "7 Day Streak",
      desc: "Stayed consistent",
    });


  if (goalCompleted)
    badges.push({
      icon: Trophy,
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

  const { user } = useContext(AuthContext);
  const { goals, loading } = useContext(GoalContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [bio, setBio] = useState(user?.user_metadata?.bio || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, bio },
    });

    setSaving(false);

    if (!error) {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }
  }


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



  const displayName = fullName || user?.user_metadata?.full_name || "User";

  const initial =
    displayName.charAt(0).toUpperCase();



  return (

    <div
      className="w-full"
      style={{
        color:"var(--color-ink)"
      }}
    >


      {/* Hero Profile */}

      <Card className="mb-8">

        {!editing ? (

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">


            <div className="flex items-center gap-5">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
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
                  {displayName}
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
                  {bio || "Building my future through learning, consistency and AI powered goals."}
                </p>


              </div>


            </div>



            <button
              onClick={() => setEditing(true)}
              className="rounded-xl px-5 py-3 font-semibold text-sm inline-flex items-center justify-center gap-2 flex-shrink-0"
              style={{
                background:"var(--color-primary)",
                color:"#111"
              }}
            >
              <Pencil size={15} /> Edit Profile
            </button>


          </div>

        ) : (

          <form onSubmit={saveProfile} className="space-y-5">

            <div className="flex items-center gap-5 mb-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{
                  background:
                  "linear-gradient(135deg,var(--color-primary),var(--color-primary-light))",
                  color:"#111"
                }}
              >
                {initial}
              </div>
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: "'Space Grotesk',sans-serif" }}
              >
                Edit Your Profile
              </h2>
            </div>

            <div>
              <label
                className="text-xs block mb-2"
                style={{ color:"var(--color-ink-dim)" }}
              >
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e)=>setFullName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 outline-none text-sm"
                style={{
                  background:"var(--color-bg)",
                  border:"1px solid var(--color-line)",
                  color:"var(--color-ink)"
                }}
              />
            </div>

            <div>
              <label
                className="text-xs block mb-2"
                style={{ color:"var(--color-ink-dim)" }}
              >
                Email
              </label>
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background:"var(--color-bg)",
                  border:"1px solid var(--color-line)",
                  color:"var(--color-ink-dim)"
                }}
              >
                {user?.email}
              </div>
            </div>

            <div>
              <label
                className="text-xs block mb-2"
                style={{ color:"var(--color-ink-dim)" }}
              >
                Bio
              </label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e)=>setBio(e.target.value)}
                placeholder="Tell something about yourself..."
                className="w-full rounded-xl px-4 py-3 outline-none text-sm resize-none"
                style={{
                  background:"var(--color-bg)",
                  border:"1px solid var(--color-line)",
                  color:"var(--color-ink)"
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl px-6 py-3 font-semibold text-sm inline-flex items-center gap-2"
                style={{
                  background:"var(--color-primary)",
                  color:"#111"
                }}
              >
                {saving ? "Saving..." : saved ? <><Check size={15}/> Saved</> : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl px-6 py-3 font-semibold text-sm inline-flex items-center gap-2"
                style={{
                  border:"1px solid var(--color-line)",
                  color:"var(--color-ink-dim)"
                }}
              >
                <X size={15}/> Cancel
              </button>
            </div>

          </form>

        )}

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

                    <div className="mb-3" style={{ color: "var(--color-primary)" }}>
                      <badge.icon size={26} />
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






    </div>

  );
}