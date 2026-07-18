import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const cardStyle = {
  background: "var(--color-bg-elev)",
  border: "1px solid var(--color-line)",
  boxShadow: "var(--shadow-card)",
};
const dimStyle = { color: "var(--color-ink-dim)" };
const headingFont = { fontFamily: "'Space Grotesk', sans-serif" };
const fieldClass =
  "w-full rounded-2xl px-5 py-4 text-sm placeholder-[color:var(--color-ink-dim)] transition-all focus:outline-none";

function fieldStyle() {
  return {
    background: "var(--color-bg)",
    color: "var(--color-ink)",
    border: "1px solid var(--color-line)",
  };
}

function Logo({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="12.5" stroke="var(--color-primary)" strokeWidth="1.3" />
      <path d="M15 7 L15 23 M7 15 L23 15" stroke="var(--color-line-strong)" strokeWidth="1" />
      <circle cx="15" cy="15" r="2.6" fill="var(--color-primary)" />
    </svg>
  );
}

export default function SignUp() {
  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    const { error: signUpError } = await signUp(email, password, fullName);

    setSubmitting(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}
    >
      {/* ambient glow */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl -top-40 -left-40 pointer-events-none"
        style={{ background: "color-mix(in srgb, var(--color-primary) 12%, transparent)" }}
      />
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl -bottom-40 -right-40 pointer-events-none"
        style={{ background: "color-mix(in srgb, var(--color-accent) 10%, transparent)" }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div
          className="flex justify-center items-center gap-2.5 font-bold text-[25px] px-2 mb-7"
          style={{ ...headingFont, color: "var(--color-ink)" }}
        >
          <Logo className="w-10 h-10" />
          Launchpad
        </div>

        <div style={{ borderBottom: "1px solid var(--color-line)" }} />

        {/* Header */}
        <div className="text-center mt-10 mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3" style={headingFont}>
            Create your account
          </h1>
          <p className="text-sm" style={dimStyle}>
            Start turning your goals into roadmaps.
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="rounded-3xl p-7 space-y-5" style={cardStyle}>
          {error && (
            <div
              className="rounded-2xl px-4 py-3 text-sm"
              style={{
                color: "var(--color-danger)",
                background: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                border: "1px solid var(--color-danger)",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-xs font-mono mb-2" style={dimStyle}>
              Full name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Your name"
              className={fieldClass}
              style={fieldStyle()}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-mono mb-2" style={dimStyle}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className={fieldClass}
              style={fieldStyle()}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-mono mb-2" style={dimStyle}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className={fieldClass}
              style={fieldStyle()}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full py-3.5 text-sm font-semibold transition hover:brightness-110 disabled:opacity-50 mt-2"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
              color: "#111",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-7" style={dimStyle}>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
