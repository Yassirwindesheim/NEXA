import "./../styles/globals.css";
import React from "react";

export const metadata = { title: "NEXA Dashboard", description: "Werkorder systeem" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <div className="min-h-screen flex">
          <aside className="w-64 bg-white border-r p-4 hidden md:block">
            <h1 className="text-xl font-semibold mb-4">NEXA</h1>
            <nav className="space-y-2">
              <a className="block px-2 py-1 rounded hover:bg-gray-100" href="/">Dashboard</a>
              <a className="block px-2 py-1 rounded hover:bg-gray-100" href="/employees">Medewerkers</a>
              <a className="block px-2 py-1 rounded hover:bg-gray-100" href="/workorders">Werkorders</a>
              <a className="block px-2 py-1 rounded hover:bg-gray-100" href="/tasks">Taken</a>
              <a className="block px-2 py-1 rounded hover:bg-gray-100" href="/portal/EXAMPLE-ID">Klantportaal</a>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}