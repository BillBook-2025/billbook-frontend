import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <header className="fixed top-0 w-full bg-white shadow z-10 h-16 flex items-center justify-center">
        헤더
      </header>
      <main className="pt-16 pb-16">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 w-full bg-white shadow z-10 h-16 flex items-center justify-center">
        하단바
      </footer>
    </div>
  );
}
