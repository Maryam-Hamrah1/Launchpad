import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export default function SignUp() {

  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [submitting,setSubmitting] = useState(false);



  async function handleSubmit(e){

    e.preventDefault();

    setError("");
    setSubmitting(true);


    const {error:signUpError}=await signUp(email,password,fullName);


    setSubmitting(false);


    if(signUpError){
      setError(signUpError);
      return;
    }


    navigate("/dashboard");

  }





  return (

    <div
      className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
      style={{
        background:`
        radial-gradient(circle at 20% 20%, rgba(255,138,61,.18), transparent 35%),
        radial-gradient(circle at 80% 75%, rgba(110,168,254,.15), transparent 35%),
        var(--color-bg)`
        
      }}
    >



      {/* Glow */}

      <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-30 bg-primary/30 top-16 left-10"></div>

      <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-20 bg-accent/30 bottom-10 right-10"></div>





      <div className="w-full max-w-sm relative z-10">





        <div className="text-center mb-10">

          <h1
            className="text-4xl font-bold tracking-tight mb-3"
            style={{
              color:"var(--color-ink)",
              fontFamily:"'Space Grotesk',sans-serif"
            }}
          >
            Create your account
          </h1>


          <p
            className="text-sm"
            style={{
              color:"var(--color-ink-dim)"
            }}
          >
            Start turning your goals into roadmaps.
          </p>


        </div>







        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 space-y-5 border backdrop-blur-xl"
          style={{
            backgroundColor:"color-mix(in srgb, var(--color-bg-elev) 85%, transparent)",
            borderColor:"var(--color-line)",
            boxShadow:"var(--shadow-card)"
          }}
        >




          {error && (

            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                color:"var(--color-danger)",
                background:"rgba(255,107,107,.1)",
                border:"1px solid rgba(255,107,107,.25)"
              }}
            >
              {error}
            </div>

          )}







          <div>

            <label
              htmlFor="fullName"
              className="block text-xs font-mono mb-2"
              style={{color:"var(--color-ink-dim)"}}
            >
              Full name
            </label>


            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e)=>setFullName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition focus:ring-2"
              style={{
                backgroundColor:"var(--color-bg-elev2)",
                color:"var(--color-ink)",
                borderColor:"var(--color-line)"
              }}
            />


          </div>







          <div>

            <label
              htmlFor="email"
              className="block text-xs font-mono mb-2"
              style={{color:"var(--color-ink-dim)"}}
            >
              Email
            </label>


            <input
              type="email"
              id="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition focus:ring-2"
              style={{
                backgroundColor:"var(--color-bg-elev2)",
                color:"var(--color-ink)",
                borderColor:"var(--color-line)"
              }}
            />

          </div>







          <div>


            <label
              htmlFor="password"
              className="block text-xs font-mono mb-2"
              style={{color:"var(--color-ink-dim)"}}
            >
              Password
            </label>


            <input
              type="password"
              id="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition focus:ring-2"
              style={{
                backgroundColor:"var(--color-bg-elev2)",
                color:"var(--color-ink)",
                borderColor:"var(--color-line)"
              }}
            />


          </div>







          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full py-3.5 text-sm font-semibold transition hover:scale-[1.02] hover:brightness-110 disabled:opacity-50 mt-2"
            style={{
              background:"linear-gradient(135deg,var(--color-primary),var(--color-primary-light))",
              color:"#1A1305",
              boxShadow:"0 8px 25px rgba(255,138,61,.25)"
            }}
          >

            {submitting ? "Creating account..." : "Sign Up"}

          </button>




        </form>







        <p
          className="text-center text-sm mt-7"
          style={{color:"var(--color-ink-dim)"}}
        >

          Already have an account?{" "}


          <Link
            to="/login"
            className="font-semibold hover:underline"
            style={{color:"var(--color-primary)"}}
          >
            Log in
          </Link>


        </p>




      </div>


    </div>

  );
}