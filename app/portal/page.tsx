"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export default function PortalPage() {
  const { workorders, tasks } = useAppContext();
  const [selected, setSelected] = useState(workorders[0]?.id ?? "");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const i = setInterval(() => setLastUpdated(new Date()), 30000);
    return () => clearInterval(i);
  }, []);

  const wo = workorders.find(w => w.id === selected) ?? workorders[0];
  const woTasks = tasks.filter(t => t.workorderId === wo.id);
  const progress = Math.round((woTasks.filter(t => t.status === "Afgerond").length / Math.max(1, woTasks.length)) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Werkorder:</label>
        <select className="border rounded px-3 py-2" value={selected} onChange={e => setSelected(e.target.value)}>
          {workorders.map(w => <option key={w.id} value={w.id}>#{w.id} – {w.customer} – {w.vehicle}</option>)}
        </select>
        <div className="ml-auto text-sm text-slate-500">Laatst bijgewerkt: {lastUpdated.toLocaleString()}</div>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">NEXA Klantportaal</h2>
          <p className="text-sm text-slate-500">Werkorder #{wo.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block bg-slate-800 text-white px-2 py-1 rounded">{wo.status}</span>
          <button className="px-3 py-2 border rounded" onClick={() => window.print()}>Download PDF</button>
        </div>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-slate-500">Klant</p>
          <div className="font-medium">{wo.customer}</div>
        </div>
        <div>
          <p className="text-sm text-slate-500">Voertuig</p>
          <div className="font-medium">{wo.vehicle}</div>
        </div>
        <div>
          <p className="text-sm text-slate-500">Omschrijving</p>
          <div className="font-medium">{wo.complaint}</div>
        </div>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm">
        <h3 className="font-medium mb-3">Werkzaamheden ({progress}%)</h3>
        <ul className="space-y-3 text-sm">
          {woTasks.map(t => (
            <li key={t.id} className="flex items-start justify-between">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-slate-500">Status: {t.status}</div>
              </div>
              <div className="text-xs text-slate-400">{t.time}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
