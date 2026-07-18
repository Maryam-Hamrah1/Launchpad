import { useContext, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { GoalContext } from "../components/GoalContext";


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
    days.map((d) =>
      new Date(d.completedAt).toDateString()
    )
  );


  let streak = 0;
  const cursor = new Date();


  while (dates.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }


  return streak;
}





function ProgressCard({goal}){

  const progress = goal.progress || 0;


  return (

    <div
      className="rounded-2xl p-5"
      style={{
        background:
        "var(--color-bg-elev)",

        border:
        "1px solid var(--color-line)",

        boxShadow:
        "var(--shadow-card)"
      }}
    >


      <div className="flex justify-between items-start mb-4">


        <div>

          <h3
            className="font-semibold text-lg"
            style={{
              fontFamily:
              "'Space Grotesk',sans-serif"
            }}
          >
            {goal.title}
          </h3>


          <p
            className="text-xs mt-1"
            style={{
              color:
              "var(--color-ink-dim)"
            }}
          >
            {goal.category || "Career"}
          </p>

        </div>


        <span
          className="text-sm font-semibold"
          style={{
            color:
            "var(--color-primary)"
          }}
        >
          {progress}%
        </span>


      </div>





      <div
        className="h-2 rounded-full overflow-hidden"
        style={{
          background:
          "var(--color-bg-elev2)"
        }}
      >

        <div
          className="h-full rounded-full"
          style={{
            width:`${progress}%`,

            background:
            "linear-gradient(90deg,var(--color-primary),var(--color-primary-light))"
          }}
        />

      </div>



      <div
        className="flex justify-between mt-4 text-xs"
        style={{
          color:
          "var(--color-ink-dim)"
        }}
      >

        <span>
          {goal.timeline || "No timeline"}
        </span>

        <span>
          {goal.priority || "Normal"}
        </span>

      </div>


    </div>

  );

}






function StatBox({title,value,color}){

return (

<div
className="rounded-2xl p-5"
style={{

background:
"var(--color-bg-elev)",

border:
"1px solid var(--color-line)"

}}
>


<p
className="text-xs mb-2"
style={{
color:
"var(--color-ink-dim)"
}}
>
{title}
</p>


<h2
className="text-2xl font-bold"
style={{
fontFamily:
"'Space Grotesk',sans-serif",

color
}}
>
{value}
</h2>


</div>

)

}







export default function Progress(){


const {goals,loading}=useContext(GoalContext);





const stats=useMemo(()=>{


const active =
goals.filter(
g=>g.status!=="draft"
);



const overall =
active.length===0
?
0
:
Math.round(
active.reduce(
(sum,g)=>
sum+(g.progress||0),
0
)
/active.length
);



const completed =
active.filter(
g=>
g.roadmap &&
g.roadmap.months.every(
m=>m.status==="completed"
)
).length;



const completionRate =
active.length===0
?
0
:
Math.round(
(completed/active.length)*100
);



let tasks=0;


for(const goal of goals){

if(!goal.roadmap) continue;


for(const month of goal.roadmap.months){

if(!month.detail) continue;


for(const day of month.detail.days || []){

if(!day.detail) continue;


tasks += (day.detail.tasks || []).filter(
t=>t.done
).length;


}

}

}



const chartData =
active.map(g=>({
  name:
g.title.length>15
?
g.title.slice(0,15)+"..."
:
g.title,

progress:
g.progress||0

}));



return {

overall,
completionRate,
tasks,
streak:
computeStreak(
collectCompletedDays(goals)
),

chartData

};


},[goals]);






if(loading){

return (

<div
className="flex justify-center items-center h-64"
style={{
color:
"var(--color-ink-dim)"
}}
>
Loading...
</div>

)

}






return (

<div
className="w-full space-y-8"
>





{/* HERO */}

<section
className="rounded-3xl p-6"
style={{

background:
"linear-gradient(135deg,rgba(255,138,61,.12),rgba(110,168,254,.08),var(--color-bg-elev))",

border:
"1px solid var(--color-line)",

boxShadow:
"var(--shadow-card)"

}}
>


<span
className="inline-flex rounded-full px-3 py-1 text-xs mb-3"
style={{

background:
"rgba(255,138,61,.12)",

color:
"var(--color-primary)"

}}
>
📈 PROGRESS TRACKER
</span>



<h1
className="text-3xl font-bold mb-2"
style={{
fontFamily:
"'Space Grotesk',sans-serif"
}}
>
Track Your Growth Journey
</h1>


<p
className="text-sm"
style={{
color:
"var(--color-ink-dim)"
}}
>
See how far you have come and monitor every goal you are building.
</p>


</section>







{/* STATS */}


<div
className="grid md:grid-cols-4 gap-5"
>

<StatBox
title="OVERALL PROGRESS"
value={`${stats.overall}%`}
color="var(--color-primary)"
/>


<StatBox
title="COMPLETION RATE"
value={`${stats.completionRate}%`}
color="var(--color-success)"
/>


<StatBox
title="COMPLETED TASKS"
value={stats.tasks}
/>


<StatBox
title="CURRENT STREAK"
value={`${stats.streak} days`}
color="var(--color-accent)"
/>


</div>







{/* CHART */}


<div
className="rounded-3xl p-6"
style={{

background:
"var(--color-bg-elev)",

border:
"1px solid var(--color-line)",

boxShadow:
"var(--shadow-card)"

}}
>


<h2
className="font-semibold text-lg mb-6"
style={{
fontFamily:
"'Space Grotesk',sans-serif"
}}
>
Progress By Goals
</h2>



<div
style={{
height:280
}}
>


<ResponsiveContainer>

<BarChart data={stats.chartData}>


<CartesianGrid
strokeDasharray="3 3"
stroke="var(--color-line)"
vertical={false}
/>


<XAxis
dataKey="name"
tick={{
fill:"var(--color-ink-dim)",
fontSize:11
}}
/>


<YAxis
domain={[0,100]}
tick={{
fill:"var(--color-ink-dim)",
fontSize:11
}}
/>


<Tooltip />



<Bar
dataKey="progress"
fill="var(--color-primary)"
radius={[8,8,0,0]}
/>


</BarChart>


</ResponsiveContainer>


</div>


</div>








{/* GOAL CARDS */}


<div>

<h2
className="text-xl font-semibold mb-5"
style={{
fontFamily:
"'Space Grotesk',sans-serif"
}}
>
Goal Progress
</h2>



<div
className="grid md:grid-cols-2 gap-5"
>

{

goals
.filter(g=>g.status!=="draft")
.map(goal=>(

<ProgressCard
key={goal.id}
goal={goal}
/>

))

}


</div>


</div>





</div>

);


}