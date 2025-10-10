"use client";
import React, { useState } from "react";
import { useAppContext, StatusIcon } from "../context/AppContext";

export default function PortalPage() {
  const { workorders, tasks } = useAppContext();
  const [selected, setSelected] = useState(workorders[0]?.id ?? "");
  const wo = workorders.find(w => w.id === selected) ?? workorders[0];
  const woTasks = tasks.filter(t => t.workorderId === wo.id);
  const progress = Math.round(
    (woTasks.filter(t => t.status === "Afgerond").length / Math.max(1, woTasks.length)) * 100
  );

  const statusColor = (status: string) => {
    switch (status) {
      case "Afgerond":
        return "bg-green-100 text-green-700 border-green-400";
      case "Bezig":
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
      default:
        return "bg-slate-100 text-slate-600 border-slate-300";
    }
  };

  return (
    <div className="space-y-5">
      {/* Selector */}
      <div className="flex gap-3 items-center">
        <label className="text-sm font-medium">Werkorder:</label>
        <select
          className="border rounded px-3 py-2"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {workorders.map(w => (
            <option key={w.id} value={w.id}>
              #{w.id} – {w.customer} – {w.vehicle}
            </option>
          ))}
        </select>
      </div>

      {/* Header */}
      <div className="rounded-2xl border p-4 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Klantportaal – #{wo.id}</h2>
          <p className="text-sm text-slate-500">Voortgang: {progress}%</p>
        </div>
        <div className="text-sm px-3 py-1 rounded-full bg-slate-800 text-white">{wo.status}</div>
      </div>

      {/* Werkzaamheden met iconen */}
      <div className="rounded-2xl border p-4 shadow-sm">
        <h3 className="text-md font-semibold mb-3">Werkzaamheden</h3>
        <ul className="relative space-y-4">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
          {woTasks.map((t, idx) => (
            <li key={t.id} className="relative pl-10">
              {/* Timeline connector */}
              <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-white ring-2 ring-slate-200">
                <StatusIcon status={t.status} />
              </div>

              {/* Content */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{t.name}</p>
                </div>
                <div
                  className={`flex items-center gap-2 border px-2 py-1 text-xs rounded-full ${statusColor(t.status)}`}
                >
                  <StatusIcon status={t.status} />
                  {t.status}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-xs text-slate-500 mt-5">
          Persoonlijke gegevens worden niet getoond om privacyredenen.
        </p>
      </div>
    </div>
  );
}
