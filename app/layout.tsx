import "./globals.css";

import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/TokenContext";
import Link from "next/link";
import { User } from "lucide-react";
import LogoutButton from "../components/LoginOutButton";

export const metadata = {
  title: "NEXA Werkplaats",
  description: "Dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 text-slate-900">
        {/* ✅ AuthProvider moet ALLES omwikkelen */}
        <AuthProvider>
          <AppProvider>
            {/* TOPBAR */}
            <header className="bg-gray-100 border-b shadow-sm sticky top-0 z-50">
              <nav className="w-full flex items-center justify-between px-6 py-3">
                <div className="text-xl font-extrabold tracking-tight">
                  <span className="text-slate-800">Auto</span>{" "}
                  <span className="text-slate-500">Crown</span>
                </div>

                {/* Profielmenu */}
                <div className="relative group">
                  <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 hover:shadow transition">
                    <User className="w-5 h-5 text-slate-700" />
                  </button>
                  <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg w-40 text-sm">
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-50"
                    >
                      Profiel
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-50"
                    >
                      Instellingen
                    </Link>
                    <div className="block px-4 py-2">
                      <LogoutButton />
                    </div>
                  </div>
                </div>
              </nav>
            </header>

            <div className="min-h-[calc(100vh-56px)] grid grid-cols-1 md:grid-cols-[240px_1fr]">
              {/* SIDEBAR */}
              <aside className="hidden md:flex md:flex-col w-60 border-r bg-gray-100 p-4 sticky top-[56px] h-[calc(100vh-56px)]">
                <input
                  placeholder="Zoeken…"
                  className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none"
                />
                <nav className="mt-4 flex flex-col gap-1">
                  <Link href="/" className="px-3 py-2 rounded-lg hover:bg-white text-sm transition">
                    Dashboard
                  </Link>
                  <Link href="/workorders" className="px-3 py-2 rounded-lg hover:bg-white text-sm transition">
                    Werkorders
                  </Link>
                  <Link href="/tasks" className="px-3 py-2 rounded-lg hover:bg-white text-sm transition">
                    Taken
                  </Link>
                  <Link href="/employees" className="px-3 py-2 rounded-lg hover:bg-white text-sm transition">
                    Medewerkers
                  </Link>
                  <Link href="/portal" className="px-3 py-2 rounded-lg hover:bg-white text-sm transition">
                    Klantportaal
                  </Link>
                </nav>
              </aside>

              {/* CONTENT */}
              <main className="bg-white w-full px-6 py-5 rounded-tl-2xl shadow-sm">
                {children}
              </main>
            </div>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}