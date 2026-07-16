import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { supabase } from "../supabaseClient";

export default function Settings() {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });

    setSaving(false);
    if (error) {
      console.error("Failed to update profile:", error.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#0E1526] text-[#EDEFF6] py-12 px-5">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <span className="inline-block font-mono text-xs rounded-full px-3 py-1.5 mb-3 border border-white/20 text-[#F5B342]">
            ⚙️ SETTINGS
          </span>
          <h1 className="font-bold text-3xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Settings
          </h1>
        </div>

        {/* Profile */}
        <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Profile
          </h2>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-mono text-[#9AA5BD] mb-2">
                Full name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm bg-[#1B2540] text-[#EDEFF6] border border-white/10 focus:outline-none focus:border-[#F5B342] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#9AA5BD] mb-2">Email</label>
              <div className="w-full rounded-lg px-4 py-3 text-sm bg-[#1B2540]/50 text-[#9AA5BD] border border-white/10">
                {user?.email}
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="self-start rounded-full px-6 py-2.5 text-sm font-semibold bg-[#F5B342] text-[#1A1305] hover:brightness-110 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Theme */}
        <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-6">
          <h2 className="font-semibold text-lg mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Theme
          </h2>
          <p className="text-sm text-[#9AA5BD]">
            Dark mode is the only theme wired up in the app right now — light mode isn't connected to these pages yet.
          </p>
        </div>

        {/* Language */}
        <div className="rounded-2xl border border-white/10 bg-[#141D33] p-6 mb-8">
          <h2 className="font-semibold text-lg mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Language
          </h2>
          <p className="text-sm text-[#9AA5BD]">
            English only for now — Dari support isn't built into the app yet.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full px-6 py-3 text-sm font-semibold border border-white/20 hover:border-[#FF7A6B] hover:text-[#FF7A6B] transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}