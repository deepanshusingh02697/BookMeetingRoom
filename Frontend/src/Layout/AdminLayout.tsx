import { Outlet } from "react-router-dom";

import Header from "../Component/Header";
import AdminLeftSide from "../Admin/AdminLeftSide";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="flex min-h-[calc(100vh-60px)]">
        <div className="w-[300px] shrink-0 border-r border-gray-200 bg-white">
          <AdminLeftSide />
        </div>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}