"use client";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function TasksPage() {
  const { tasks, workorders, employees, addTask, updateTaskStatus } = useAppContext();
  const [name, setName] = useState("");
  const [workorderId, setWorkorderId] = useState(workorders[0]?.id ?? "");
  const [assignedId, setAssignedId] = useState(employees[0]?.id ?? 1);
  const [status, setStatus] = useState("To do");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Nieuwe taak</h2>
        <div className="mt-3 space-y-2">
          <label className="block text-sm">Taaknaam</label>
          <input className="border rounded px-3 py-2 w-full" value={name} onChange={e => setName(e.target.value)} />
          <label className="block text-sm">Werkorder</label>
          <select className="border rounded px-3 py-2 w-full" value={workorderId} onChange={e => setWorkorderId(e.target.value)}>
            {workorders.map(w => <option key={w.id} value={w.id}>#{w.id} – {w.vehicle}</option>)}
          </select>
          <label className="block text-sm">Toewijzen aan</label>
          <select className="border rounded px-3 py-2 w-full" value={assignedId} onChange={e => setAssignedId(Number(e.target.value))}>
            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>)}
          </select>
          <label className="block text-sm">Status</label>
          <select className="border rounded px-3 py-2 w-full" value={status} onChange={e => setStatus(e.target.value)}>
            <option>To do</option>
            <option>Bezig</option>
            <option>Afgerond</option>
          </select>
          <button className="mt-2 px-4 py-2 bg-slate-800 text-white rounded" onClick={() => { if (name.trim()) { addTask({ workorderId, name: name.trim(), assignedId, status, time: "-" }); setName(""); } }}>Taak toevoegen</button>
        </div>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Alle taken</h2>
        <div className="mt-3 space-y-2 text-sm">
          {tasks.map(t => (
            <div key={t.id} className="flex items-center justify-between border-b py-2">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-slate-500">WO #{t.workorderId} • {t.assignedId}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded text-white ${t.status === "Afgerond" ? "bg-green-500" : t.status === "Bezig" ? "bg-yellow-500" : "bg-slate-400"}`}>{t.status}</span>
                <button className="px-2 py-1 border rounded" onClick={() => updateTaskStatus(t.id, "To do")}>To do</button>
                <button className="px-2 py-1 border rounded" onClick={() => updateTaskStatus(t.id, "Bezig")}>Bezig</button>
                <button className="px-2 py-1 border rounded" onClick={() => updateTaskStatus(t.id, "Afgerond")}>Klaar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
