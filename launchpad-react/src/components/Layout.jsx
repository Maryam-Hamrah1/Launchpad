import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "var(--color-bg)",
        color: "var(--color-ink)",
      }}
    >

      {/* Sidebar */}
      <Sidebar />


      {/* Right Side */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">


        {/* Topbar */}
        <Topbar />


        {/* Pages */}
        <main
          className="flex-1 overflow-y-auto px-8  py-8"
        >
          <Outlet />
        </main>


      </div>

    </div>
  );
}