import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { ThemeContext } from "../components/ThemeContext";
import { supabase } from "../supabaseClient";


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

  const { user, signOut } = useContext(AuthContext);
  const { isLight, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();


  const [fullName,setFullName] = useState(
    user?.user_metadata?.full_name || ""
  );

  const [bio,setBio] = useState("");

  const [saving,setSaving] = useState(false);
  const [saved,setSaved] = useState(false);



  async function saveProfile(e){

    e.preventDefault();

    setSaving(true);
    setSaved(false);


    const {error} = await supabase.auth.updateUser({
      data:{
        full_name:fullName,
        bio
      }
    });


    setSaving(false);


    if(!error){

      setSaved(true);

      setTimeout(()=>{
        setSaved(false);
      },2000);

    }

  }



  async function logout(){

    await signOut();
    navigate("/login");

  }




  return (

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
          className="inline-flex rounded-full px-3 py-1 text-xs mb-4"
          style={{
            background:"rgba(255,138,61,.12)",
            color:"var(--color-primary)",
            border:"1px solid rgba(255,138,61,.18)"
          }}
        >
          ⚙️ SETTINGS
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





      {/* Profile */}


      <SettingCard title="Profile">


        <form
          onSubmit={saveProfile}
          className="space-y-5"
        >


          <div>

            <label
              className="text-xs block mb-2"
              style={{
                color:"var(--color-ink-dim)"
              }}
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
              style={{
                color:"var(--color-ink-dim)"
              }}
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
              style={{
                color:"var(--color-ink-dim)"
              }}
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




          <button
            disabled={saving}
            className="rounded-xl px-6 py-3 font-semibold text-sm"
            style={{
              background:"var(--color-primary)",
              color:"#111"
            }}
          >

            {
              saving
              ?
              "Saving..."
              :
              saved
              ?
              "Saved ✓"
              :
              "Save Changes"
            }

          </button>



        </form>


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
            className="rounded-xl px-5 py-2.5 text-sm font-semibold"
            style={{
              background:"var(--color-bg)",
              border:"1px solid var(--color-line)"
            }}
          >

            {
              isLight
              ?
              "🌙 Dark"
              :
              "☀️ Light"
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


        <button
          onClick={logout}
          className="rounded-xl px-6 py-3 text-sm font-semibold"
          style={{
            border:"1px solid var(--color-danger)",
            color:"var(--color-danger)"
          }}
        >
          Log Out
        </button>


      </SettingCard>




    </div>

  );
}