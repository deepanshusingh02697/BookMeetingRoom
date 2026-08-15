import { Outlet } from "react-router-dom";
import Header from "../Component/Header";

export default function EmployeeLayout() {
  return (
    <>
      <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <main className="p-6 pt-8 w-[90%] m-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
}
