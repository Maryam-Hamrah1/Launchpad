import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoalContext } from "../components/GoalContext";
import { Sparkles, Rocket } from "lucide-react";


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


const TABS = [
  { key: "all", label: "All Goals" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "draft", label: "Drafts" },
];



function GoalCard({ goal, effectiveStatus, onClick }) {

  const badge =
    effectiveStatus === "completed"
      ? {
          text: "COMPLETED",
          color: "var(--color-success)",
        }
      : effectiveStatus === "draft"
      ? {
          text: "DRAFT",
          color: "var(--color-ink-dim)",
        }
      : {
          text: "IN PROGRESS",
          color: "var(--color-primary)",
        };


  return (
    <button
      onClick={onClick}
      className="text-left rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--color-bg-elev)",
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-card)",
      }}
    >

      <div className="flex justify-between items-start gap-4 mb-5">

        <div>

          <span
            className="text-xs font-mono"
            style={{
              color: "var(--color-ink-dim)",
            }}
          >
            {goal.category || "Career"}
          </span>


          <h3
            className="text-xl font-semibold mt-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {goal.title || "Untitled Goal"}
          </h3>

        </div>


        <span
          className="text-[10px] rounded-full px-3 py-1 font-mono"
          style={{
            color: badge.color,
            border: `1px solid ${badge.color}`,
          }}
        >
          {badge.text}
        </span>


      </div>



      <div className="flex justify-between text-xs mb-2">
        <span style={{ color: "var(--color-ink-dim)" }}>
          Progress
        </span>

        <span>
          {goal.progress || 0}%
        </span>

      </div>



      <div
        className="h-2 rounded-full overflow-hidden mb-5"
        style={{
          background: "var(--color-bg-elev2)",
        }}
      >

        <div
          className="h-full rounded-full"
          style={{
            width:` ${goal.progress || 0}%`,
            background:
              "linear-gradient(90deg,var(--color-primary),var(--color-accent))",
          }}
        />

      </div>




      <div className="flex gap-10 text-xs">

        <div>

          <span
            className="block mb-1"
            style={{
              color: "var(--color-ink-dim)",
            }}
          >
            Timeline
          </span>

          <span>
            {goal.timeline || "—"}
          </span>

        </div>



        <div>

          <span
            className="block mb-1"
            style={{
              color: "var(--color-ink-dim)",
            }}
          >
            Priority
          </span>

          <span>
            {goal.priority || "—"}
          </span>

        </div>


      </div>


    </button>
  );
}




export default function Goals() {

  const { goals, loading } = useContext(GoalContext);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");



  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }



  const goalsWithStatus = goals.map((goal) => ({
    goal,
    effectiveStatus: getEffectiveStatus(goal),
  }));


  const filtered =
    activeTab === "all"
      ? goalsWithStatus
      : goalsWithStatus.filter(
          (item) => item.effectiveStatus === activeTab
        );



  return (

    <div className="w-full space-y-8">



      {/* Hero */}
      <section
        className="rounded-3xl p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,138,61,.12), rgba(110,168,254,.08), var(--color-bg-elev))",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-card)",
        }}
      >


        <span
  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs mb-4"
  style={{
    background: "rgba(255,138,61,.12)",
    color: "var(--color-primary)",
  }}
>
  <Sparkles size={13} /> YOUR JOURNEY
</span>

<h1
  className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-2"
  style={{
    fontFamily: "'Space Grotesk', sans-serif",
  }}
>
  Every Goal Is A New Journey <Rocket size={26} style={{ color: "var(--color-primary)" }} />
</h1>


        <p
          className="max-w-2xl leading-7 text-sm"
          style={{
            color:
              "var(--color-ink-dim)",
          }}
        >
          Find all your goals here, track your milestones,
          complete your roadmap, and level up your future step by step.
        </p>


      </section>




      {/* Tabs */}

      <div className="flex flex-wrap gap-3">

        {TABS.map((tab) => (

          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="rounded-full px-5 py-2 text-sm font-semibold transition"
            style={
              activeTab === tab.key
                ? {
                    background:
                      "var(--color-primary)",
                    color:
                      "#111",
                  }
                : {
                    background:
                      "var(--color-bg-elev)",
                    border:
                      "1px solid var(--color-line)",
                    color:
                      "var(--color-ink-dim)",
                  }
            }
          >
            {tab.label}
          </button>

        ))}

      </div>





      {/* Goals */}

      {filtered.length === 0 ? (

        <div
          className="rounded-3xl p-10 text-center"
          style={{
            background:
              "var(--color-bg-elev)",
            border:
              "1px dashed var(--color-line-strong)",
          }}
        >

          <h3 className="text-xl font-semibold mb-3">
            No Goals Yet
          </h3>


          <p
            className="text-sm"
            style={{
              color:
                "var(--color-ink-dim)",
            }}
          >
            Start your first journey and create an AI roadmap.
          </p>


        </div>

      ) : (

        <div className="grid gap-5">

          {filtered.map(({ goal, effectiveStatus }) => (

            <GoalCard
              key={goal.id}
              goal={goal}
              effectiveStatus={effectiveStatus}
              onClick={() =>
                navigate(`/goals/${goal.id}`)
              }
            />

          ))}

        </div>

      )}


    </div>

  );
}