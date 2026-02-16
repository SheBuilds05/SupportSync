import { Outlet } from "react-router-dom";
import { Sidebar } from "./UserSidebar";

export const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-slate-50 min-h-screen">
        <Outlet /> {/* This is where the specific pages will render */}
      </main>
    </div>
  );
};