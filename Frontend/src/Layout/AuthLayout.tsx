import { Outlet } from "react-router-dom";
import LeftSection from "../Auth/LeftSection";

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <LeftSection />
        <section className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-10 sm:px-10 lg:w-1/2">
          <div className="w-full max-w-107.5">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}