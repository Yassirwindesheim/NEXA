import "./globals.css";
import React from "react";
import Link from "next/link";
import { AppProvider } from "./context/AppContext";
import { Home, Users, ClipboardList, FolderKanban, Globe } from "lucide-react";

export const metadata = {
  title: "NEXA Werkplaats",
  description: "Dashboard en werkplaatsbeheer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/employees", label: "Medewerkers", icon: Users },
    { href: "/tasks", label: "Taken", icon: ClipboardList },
    { href: "/workorders", label: "Werkorders", icon: FolderKanban },
    { href: "/portal", label: "Klantportaal", icon: Globe },
  ];

  return (
    <html lang="nl">
      <body className="bg-white text-slate-900">
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            {/* NAVBAR */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-50">
              <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                <h1 className="text-xl font-bold tracking-tight">NEXA Werkplaats</h1>
                <div className="flex gap-2">
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-1 px-3 py-2 text-sm rounded-md hover:bg-slate-100 transition"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}
                </div>
              </nav>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 w-full px-16 py-4">{children}</main>

          </div>
        </AppProvider>
      </body>
    </html>
  );
}
