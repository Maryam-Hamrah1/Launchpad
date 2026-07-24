import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { GraduationCap, BookOpen, PlayCircle, FileText, Wrench, Link2, Library } from "lucide-react";

const TYPE_ICONS = {
  Course: GraduationCap,
  Book: BookOpen,
  YouTube: PlayCircle,
  Documentation: FileText,
  "Project Idea": Wrench,
};


export default function Resources() {

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");



  useEffect(() => {
    loadResources();
  }, []);



  async function loadResources() {

    setLoading(true);

    const { data, error } = await supabase
      .from("resources")
      .select(
        "id,title,type,category,level,is_free,price_note,url,description"
      )
      .order("category", {
        ascending:true
      });


    if(error){
      console.error(error.message);
    }
    else{
      setResources(data);
    }


    setLoading(false);

  }




  if(loading){

    return(

      <div
        className="flex items-center justify-center min-h-[400px]"
        style={{
          color:"var(--color-ink-dim)"
        }}
      >
        Loading...
      </div>

    );

  }




  const categories=[
    "all",
    ...new Set(resources.map(r=>r.category))
  ];



  const filtered =
  resources.filter(r=>{

    if(
      categoryFilter !== "all" &&
      r.category !== categoryFilter
    )
    return false;


    if(
      priceFilter==="free" &&
      !r.is_free
    )
    return false;


    if(
      priceFilter==="paid" &&
      r.is_free
    )
    return false;


    return true;

  });





return (

<div
className="w-full space-y-8"
>



{/* HERO */}

<section
className="rounded-3xl p-6"
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
className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs mb-4"
style={{

background:
"rgba(255,138,61,.12)",

color:
"var(--color-primary)"

}}
>
<Library size={13} /> RESOURCE LIBRARY
</span>



<h1
className="text-3xl font-bold mb-3"
style={{
fontFamily:
"'Space Grotesk',sans-serif"
}}
>
Grow Your Skills With The Right Resources
</h1>



<p
className="text-sm max-w-2xl leading-7"
style={{
color:
"var(--color-ink-dim)"
}}
>
Discover courses, books, videos, documentation,
and project ideas to support your learning journey.
</p>



</section>







{/* FILTERS */}


<div
className="flex flex-col lg:flex-row justify-between gap-4"
>



<div className="flex flex-wrap gap-2">

{
categories.map(c=>(

<button

key={c}

onClick={()=>
setCategoryFilter(c)
}

className="rounded-full px-4 py-2 text-xs font-semibold transition"

style={

categoryFilter===c

?

{
background:
"var(--color-primary)",

color:"#111"
}

:

{
border:
"1px solid var(--color-line)",

color:
"var(--color-ink-dim)"
}

}

>

{
c==="all"
?
"All Categories"
:
c
}

</button>


))

}

</div>





<div className="flex gap-2">


{
[
{
key:"all",
label:"All"
},
{
key:"free",
label:"Free"
},
{
key:"paid",
label:"Paid"
}

].map(opt=>(


<button

key={opt.key}

onClick={()=>
setPriceFilter(opt.key)
}

className="rounded-full px-4 py-2 text-xs font-semibold"

style={

priceFilter===opt.key

?

{
background:
"var(--color-success)",

color:"#06251d"
}

:

{
border:
"1px solid var(--color-line)",

color:
"var(--color-ink-dim)"
}

}

>

{opt.label}

</button>


))

}


</div>



</div>








{/* CARDS */}


{
filtered.length===0 ?


<p
className="text-sm"
style={{
color:
"var(--color-ink-dim)"
}}
>
No resources match these filters.
</p>


:


<div
className="grid md:grid-cols-2 gap-5"
>


{
filtered.map(r=>(


<div

key={r.id}

className="rounded-2xl p-5 transition"

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
className="flex justify-between items-start mb-4"
>

<div className="text-2xl">
{
(() => {
  const TypeIcon = TYPE_ICONS[r.type] || Link2;
  return <TypeIcon size={22} />;
})()
}
</div>



<span

className="text-[10px] rounded-full px-2 py-1"

style={

r.is_free

?{
border:
"1px solid var(--color-success)",

color:
"var(--color-success)"
}

:

{
border:
"1px solid var(--color-line)",

color:
"var(--color-ink-dim)"
}

}

>

{
r.is_free
?
"FREE"
:
"PAID"
}

</span>


</div>





<h3

className="font-semibold text-lg mb-2"

style={{

fontFamily:
"'Space Grotesk',sans-serif"

}}

>

{r.title}

</h3>





<div

className="text-xs mb-3"

style={{
color:
"var(--color-ink-dim)"
}}

>

{r.type} · {r.category}

{
r.level &&
 `· ${r.level}`
}

</div>





<p

className="text-sm leading-6 mb-4"

style={{

color:
"var(--color-ink-dim)"

}}

>

{r.description}

</p>





{
r.price_note &&

<p

className="text-xs italic mb-4"

style={{
color:
"var(--color-ink-dim)"
}}

>

{r.price_note}

</p>

}





{
r.url &&

<a

href={r.url}

target="_blank"

rel="noopener noreferrer"

className="text-sm font-semibold"

style={{

color:
"var(--color-primary)"

}}

>

Visit →

</a>

}



</div>


))

}


</div>


}



</div>


);

}