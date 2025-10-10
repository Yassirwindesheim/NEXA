"use client";

import { useAppContext } from "./context/AppContext";
const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-block px-2 py-1 text-xs rounded ${className}`}>
    {children}
  </span>
);


export default function HomePage() {
  const { workorders, tasks } = useAppContext();
  const wo = workorders[0];
  const woTasks = tasks.filter(t => t.workorderId === wo.id);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Werkorder #{wo.id} – {wo.vehicle}</h2>
        <p className="text-sm text-slate-500">Status: <Badge className="bg-amber-500 text-white">{wo.status}</Badge></p>
        <p className="text-sm mt-2"><strong>Klant:</strong> {wo.customer} – {wo.phone}</p>
        <p className="text-sm"><strong>Binnenkomst:</strong> {wo.received}</p>
        <p className="text-sm"><strong>Oplevering:</strong> {wo.due}</p>
        <p className="text-sm"><strong>Klacht:</strong> {wo.complaint}</p>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm">
        <h3 className="font-medium mb-3">Takenlijst</h3>
        {woTasks.map(t => (
          <div key={t.id} className="flex items-center justify-between border-b py-2">
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-xs text-slate-500">Toegewezen aan ID: {t.assignedId}</p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 text-xs rounded text-white ${t.status === "Afgerond" ? "bg-green-500" : t.status === "Bezig" ? "bg-yellow-500" : "bg-slate-400"}`}>
                {t.status}
              </span>
              <div className="text-xs text-slate-400">{t.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
