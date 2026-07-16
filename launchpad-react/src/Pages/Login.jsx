import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: signInError } = await signIn(email, password);

    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E1526] text-[#EDEFF6] px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-bold text-3xl mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-sm text-[#9AA5BD]">Log in to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-[#FF7A6B] bg-[#FF7A6B]/10 px-4 py-3 text-sm text-[#FF7A6B]">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-mono text-[#9AA5BD] mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 text-sm bg-[#1B2540] text-[#EDEFF6] placeholder-[#9AA5BD] border border-white/10 focus:outline-none focus:border-[#F5B342] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-mono text-[#9AA5BD] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 text-sm bg-[#1B2540] text-[#EDEFF6] placeholder-[#9AA5BD] border border-white/10 focus:outline-none focus:border-[#F5B342] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full px-6 py-3.5 text-sm font-semibold bg-[#F5B342] text-[#1A1305] hover:brightness-110 transition disabled:opacity-50 mt-2"
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-[#9AA5BD] text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold" style={{ color: "#F5B342" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
