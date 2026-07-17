import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../components/AuthContext";
import { GoalContext } from "../components/GoalContext";
import { supabase } from "../supabaseClient";

const WORKER_URL = "https://launchpad-worker.maryam-ai.workers.dev";


function buildGoalsContext(goals) {
  const active = goals.filter((g) => g.status === "active");

  if (active.length === 0) return "";

  return active
    .map((g) => {
      const monthInfo = g.roadmap
        ? `currently on Month ${
            g.roadmap.months.find((m) => m.status === "current")?.index || "?"
          } of ${g.roadmap.months.length}`
        : "roadmap not generated yet";

      return `- "${g.title}" (${g.category}), ${g.timeline} timeline, ${
        g.progress || 0
      }% progress, ${monthInfo}`;
    })
    .join("\n");
}



export default function AICoach() {

  const { user } = useContext(AuthContext);
  const { goals } = useContext(GoalContext);

  const [messages,setMessages] = useState([]);
  const [input,setInput] = useState("");
  const [sending,setSending] = useState(false);
  const [loadingHistory,setLoadingHistory] = useState(true);

  const scrollRef = useRef(null);



  useEffect(()=>{
    if(user) loadHistory();
  },[user]);



  useEffect(()=>{
    scrollRef.current?.scrollIntoView({
      behavior:"smooth"
    });
  },[messages]);



  async function loadHistory(){

    setLoadingHistory(true);

    const {data,error}=await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id",user.id)
      .order("created_at",{ascending:true});


    if(!error){
      setMessages(data);
    }

    setLoadingHistory(false);

  }





  async function handleSend(e){

    e.preventDefault();

    const text=input.trim();

    if(!text || sending) return;


    setInput("");

    setSending(true);



    const userMessage={
      role:"user",
      content:text
    };


    const nextMessages=[
      ...messages,
      userMessage
    ];


    setMessages(nextMessages);



    await supabase
    .from("chat_messages")
    .insert({
      user_id:user.id,
      role:"user",
      content:text
    });




    try{


      const res=await fetch(`
        ${WORKER_URL}/chat`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({

            messages:
            nextMessages.map(m=>({
              role:m.role,
              content:m.content
            })),

            goalsContext:
            buildGoalsContext(goals)

          })
        }
      );


      const {reply}=await res.json();



      setMessages(prev=>[
        ...prev,
        {
          role:"assistant",
          content:reply
        }
      ]);



      await supabase
      .from("chat_messages")
      .insert({
        user_id:user.id,
        role:"assistant",
        content:reply
      });



    }catch(err){

      setMessages(prev=>[
        ...prev,
        {
          role:"assistant",
          content:
          "Sorry, something went wrong. Try again."
        }
      ]);

    }


    setSending(false);

  }





return (

<div
className="w-full space-y-6"
>


{/* HERO */}

<section
className="rounded-2xl p-4"
style={{
background:
"linear-gradient(135deg, rgba(255,138,61,.12), rgba(110,168,254,.08), var(--color-bg-elev))",

border:
"1px solid var(--color-line)",

boxShadow:
"var(--shadow-card)"
}}
>


<span
className="inline-flex rounded-full px-3 py-1 text-xs mb-3"
style={{
background:"rgba(255,138,61,.12)",
color:"var(--color-primary)"
}}
>
🤖 AI COACH
</span>



<h1
className="text-xl font-bold mb-2"
style={{
fontFamily:"'Space Grotesk',sans-serif"
}}
>
Your AI Guide For Every Step 🚀
</h1>



<p
className="text-sm leading-6"
style={{
color:"var(--color-ink-dim)"
}}
>
Ask questions, get advice, and receive guidance
for your goals, learning path, and career decisions.
</p>


</section>






{/* CHAT BOX */}
<div
className="rounded-3xl p-4 flex flex-col gap-4 min-h-[380px]"
style={{
background:
"var(--color-bg-elev)",

border:
"1px solid var(--color-line)",

boxShadow:
"var(--shadow-card)"
}}
>



<div
className="flex-1 overflow-y-auto space-y-4"
>


{
loadingHistory ?

<p
className="text-sm text-center mt-20"
style={{
color:"var(--color-ink-dim)"
}}
>
Loading...
</p>


:

messages.length===0?


<div
className="text-center mt-20"
>

<div className="text-4xl mb-3">
✨
</div>

<p
className="text-sm"
style={{
color:"var(--color-ink-dim)"
}}
>
Ask about your goals, roadmap,
or next career step.
</p>

</div>


:

messages.map((m,i)=>(


<div
key={i}
className={`flex ${
m.role==="user"
?"justify-end"
:"justify-start"
}`}
>


<div
className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7"
style={

m.role==="user"

?

{
background:
"linear-gradient(135deg,var(--color-primary),var(--color-primary-light))",

color:"#111"
}

:

{
background:
"var(--color-bg-elev2)",

border:
"1px solid var(--color-line)"
}

}
>

{m.content}

</div>


</div>


))


}



{
sending &&

<div
className="rounded-2xl px-4 py-3 text-sm w-fit"
style={{
background:
"var(--color-bg-elev2)",

color:
"var(--color-ink-dim)"
}}
>
Thinking...
</div>

}



<div ref={scrollRef}/>


</div>





<form
onSubmit={handleSend}
className="flex gap-3"
>


<input

value={input}

onChange={(e)=>setInput(e.target.value)}

placeholder="Ask your AI coach..."

className="flex-1 rounded-full px-5 py-3 text-sm outline-none"

style={{

background:
"var(--color-bg)",

color:
"var(--color-ink)",

border:
"1px solid var(--color-line)"

}}

/>



<button

disabled={sending || !input.trim()}

className="rounded-full px-6 py-3 font-semibold"

style={{

background:
"linear-gradient(135deg,var(--color-primary),var(--color-primary-light))",

color:"#111"

}}

>

Send

</button>


</form>



</div>


</div>

);

}