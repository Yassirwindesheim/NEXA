"use client";
import { useAppContext } from "./context/AppContext";

export default function DashboardPage() {
  const { workorders, tasks } = useAppContext();
  const wo = workorders[0];
  const woTasks = tasks.filter(t => t.workorderId === wo.id);
  const progress = Math.round(
    (woTasks.filter(t => t.status === "Afgerond").length / Math.max(1, woTasks.length)) * 100
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Actieve werkorder */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          Actieve werkorder – #{wo.id}
        </h2>
        <p className="text-sm text-slate-500">{wo.vehicle} • {wo.customer}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-amber-500 text-white">
            {wo.status}
          </span>
          <span className="text-xs text-slate-500">
            Oplevering: {wo.due}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-1">Voortgang</p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Snelle taken */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="font-medium text-slate-800 mb-3">Snelle taken</h3>
        {woTasks.slice(0, 3).map(t => (
          <div
            key={t.id}
            className="flex items-center justify-between border-t first:border-t-0 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-slate-700">{t.name}</p>
              <p className="text-xs text-slate-500">Toegewezen aan ID: {t.assignedId}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded text-white ${
                t.status === "Afgerond"
                  ? "bg-green-500"
                  : t.status === "Bezig"
                  ? "bg-amber-500"
                  : "bg-gray-400"
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>

      {/* Werkorders overzicht */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:col-span-2">
        <h3 className="font-semibold text-slate-800 mb-3">Werkorders</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {workorders.map(w => (
            <div
              key={w.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
            >
              <div className="font-semibold text-slate-700">#{w.id}</div>
              <div className="text-sm text-slate-500">{w.customer}</div>
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded-full text-white ${
                  w.status === "In behandeling"
                    ? "bg-amber-500"
                    : "bg-gray-500"
                }`}
              >
                {w.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
