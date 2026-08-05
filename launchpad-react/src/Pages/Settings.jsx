import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { ThemeContext } from "../components/ThemeContext";
import { Settings as SettingsIcon, Moon, Sun, UserPlus, RefreshCw, Trash2, AlertTriangle, X } from "lucide-react";


function SettingCard({ title, children }) {
  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: "var(--color-bg-elev)",
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <h2
        className="text-lg font-semibold mb-5"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}


export default function Settings() {

  const { user, signOut, knownAccounts, deleteAccount } = useContext(AuthContext);
  const { isLight, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const otherAccounts = knownAccounts.filter((a) => a.email !== user?.email);

  async function logout(){

    await signOut();
    navigate("/login");

  }

  async function switchTo(email) {
    await signOut();
    navigate("/login", { state: { email } });
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");

    const result = await deleteAccount();

    setDeleting(false);

    if (result.error) {
      setDeleteError(result.error);
      return;
    }

    navigate("/signup");
  }





  return (
    <>

    <div
      className="w-full space-y-6"
      style={{
        color:"var(--color-ink)"
      }}
    >



      {/* Hero */}

      <div
        className="rounded-3xl p-7"
        style={{
          background:
          "linear-gradient(135deg,rgba(255,138,61,.12),rgba(110,168,254,.08),var(--color-bg-elev))",

          border:"1px solid rgba(255,138,61,.18)",

          boxShadow:"var(--shadow-card)"
        }}
      >

        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs mb-4"
          style={{
            background:"rgba(255,138,61,.12)",
            color:"var(--color-primary)",
            border:"1px solid rgba(255,138,61,.18)"
          }}
        >
          <SettingsIcon size={13} /> SETTINGS
        </span>


        <h1
          className="text-3xl font-bold mb-2"
          style={{
            fontFamily:"'Space Grotesk',sans-serif"
          }}
        >
          Account Settings
        </h1>


        <p
          className="text-sm"
          style={{
            color:"var(--color-ink-dim)"
          }}
        >
          Manage your profile, preferences, and Launchpad experience.
        </p>


      </div>



      {/* Accounts */}


      <SettingCard title="Profile">

        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,var(--color-primary),var(--color-primary-light))",
              color: "#111",
            }}
          >
            {(user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">
              {user?.user_metadata?.full_name || "User"}
            </div>
            <div className="text-sm" style={{ color: "var(--color-ink-dim)" }}>
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/signup")}
          className="w-full rounded-xl px-5 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 mb-2"
          style={{
            border: "1px solid var(--color-line)",
            color: "var(--color-ink)",
          }}
        >
          <UserPlus size={16} /> Switch Account
        </button>

        {otherAccounts.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs" style={{ color: "var(--color-ink-dim)" }}>
              Switch account
            </p>
            {otherAccounts.map((a) => (
              <button
                key={a.email}
                onClick={() => switchTo(a.email)}
                className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-line)",
                }}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "var(--color-bg-elev2)" }}
                  >
                    {a.fullName.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate">{a.email}</span>
                </span>
                <RefreshCw size={14} style={{ color: "var(--color-ink-dim)" }} />
              </button>
            ))}
          </div>
        )}

      </SettingCard>



      {/* Appearance */}


      <SettingCard title="Appearance">


        <div className="flex items-center justify-between">


          <div>

            <h3 className="font-medium">
              Theme
            </h3>


            <p
              className="text-sm mt-1"
              style={{
                color:"var(--color-ink-dim)"
              }}
            >
              Choose your preferred interface style.
            </p>


          </div>



          <button
            onClick={toggleTheme}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
            style={{
              background:"var(--color-bg)",
              border:"1px solid var(--color-line)"
            }}
          >

            {
              isLight
              ?
              <><Moon size={15}/> Dark</>
              :
              <><Sun size={15}/> Light</>
            }

          </button>


        </div>


      </SettingCard>







      {/* Notifications */}


      <SettingCard title="Notifications">


        <div className="space-y-4">


          {
            [
              "Goal reminders",
              "Weekly progress updates",
              "AI Coach suggestions"
            ].map(item=>(

              <label
                key={item}
                className="flex items-center justify-between"
              >

                <span className="text-sm">
                  {item}
                </span>


                <input
                  type="checkbox"
                  defaultChecked
                />

              </label>


            ))
          }


        </div>


      </SettingCard>







      {/* Preferences */}


      <SettingCard title="Preferences">


        <div className="space-y-4 text-sm">


          <div
            className="flex justify-between"
          >

            <span
              style={{
                color:"var(--color-ink-dim)"
              }}
            >
              Language
            </span>

            <span>
              English
            </span>

          </div>




          <div
            className="flex justify-between"
          >

            <span
              style={{
                color:"var(--color-ink-dim)"
              }}
            >
              Roadmap View
            </span>

            <span>
              Monthly
            </span>

          </div>


        </div>


      </SettingCard>







      {/* Account */}


      <SettingCard title="Account">

        <div className="flex flex-wrap gap-3">
          <button
            onClick={logout}
            className="rounded-xl px-6 py-3 text-sm font-semibold"
            style={{
              border:"1px solid var(--color-line)",
              color:"var(--color-ink)"
            }}
          >
            Log Out
          </button>

          <button
            onClick={() => setConfirmingDelete(true)}
            className="rounded-xl px-6 py-3 text-sm font-semibold inline-flex items-center gap-2"
            style={{
              border:"1px solid var(--color-danger)",
              color:"var(--color-danger)"
            }}
          >
            <Trash2 size={15} /> Delete Account
          </button>
        </div>


      </SettingCard>




    </div>


    {confirmingDelete && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div
          className="rounded-3xl p-7 max-w-sm w-full"
          style={{
            background: "var(--color-bg-elev)",
            border: "1px solid var(--color-danger)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex justify-center mb-4"><AlertTriangle size={40} style={{ color: "var(--color-danger)" }} /></div>

          <h2 className="text-lg font-bold text-center mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
            Delete your account?
          </h2>

          <p className="text-sm text-center mb-6" style={{ color: "var(--color-ink-dim)" }}>
            This permanently deletes your account and all your goals. This can't be undone.
          </p>

          {deleteError && (
            <div
              className="rounded-xl px-4 py-3 text-sm mb-4"
              style={{
                color: "var(--color-danger)",
                background: "color-mix(in srgb, var(--color-danger) 10%, transparent)",
                border: "1px solid var(--color-danger)",
              }}
            >
              {deleteError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setConfirmingDelete(false); setDeleteError(""); }}
              disabled={deleting}
              className="flex-1 rounded-xl px-5 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2"
              style={{ border: "1px solid var(--color-line)", color: "var(--color-ink)" }}
            >
              <X size={15} /> Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex-1 rounded-xl px-5 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2"
              style={{ background: "var(--color-danger)", color: "#fff" }}
            >
              <Trash2 size={15} /> {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    )}

    </>
  );
}