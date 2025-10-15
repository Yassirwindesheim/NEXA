"use client";
import React, { useState } from "react";
import { useAppContext, StatusIcon } from "../context/AppContext";

const statusStyle = (s: string) =>
  s === "Afgerond"
    ? "bg-green-100 text-green-700 border-green-200"
    : s === "Bezig"
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-gray-100 text-gray-600 border-gray-200";

export default function PortalPage() {
  const { workorders, tasks } = useAppContext();
  const [selected, setSelected] = useState(workorders[0]?.id ?? "");
  const wo = workorders.find((w) => w.id === selected) ?? workorders[0];
  const woTasks = tasks.filter((t) => t.workorderId === wo.id);
  const progress = Math.round(
    (woTasks.filter((t) => t.status === "Afgerond").length /
      Math.max(1, woTasks.length)) *
      100
  );

  return (
    <div className="space-y-6">
      {/* Selectie */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <label className="text-sm text-slate-700 mr-2">Selecteer werkorder:</label>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {workorders.map((w) => (
            <option key={w.id} value={w.id}>
              #{w.id} – {w.customer} – {w.vehicle}
            </option>
          ))}
        </select>
      </div>

      {/* Info header */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Klantportaal – Werkorder #{wo.id}
          </h2>
          <p className="text-sm text-slate-500">
            {wo.customer} • {wo.vehicle}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-sm text-white bg-slate-800">
          {wo.status}
        </span>
      </div>

      {/* Voortgang */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-700 mb-2">
          Voortgang: <span className="font-medium">{progress}%</span>
        </p>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Werkzaamheden */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Werkzaamheden
        </h3>
        <ul className="relative space-y-4">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
          {woTasks.map((t) => (
            <li key={t.id} className="relative pl-10">
              <div className="absolute left-0 top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-white ring-2 ring-gray-200">
                <StatusIcon status={t.status} />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium text-slate-700">{t.name}</p>
                <span
                  className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs border ${statusStyle(
                    t.status
                  )}`}
                >
                  <StatusIcon status={t.status} /> {t.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-4">
          Persoonlijke gegevens worden om privacyredenen niet getoond.
        </p>
      </div>
    </div>
  );
}
