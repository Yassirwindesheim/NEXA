"use client";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function TasksPage() {
  const { tasks, workorders, employees, addTask, updateTaskStatus } = useAppContext();
  const [name, setName] = useState("");
  const [workorderId, setWorkorderId] = useState(workorders[0]?.id ?? "");
  const [assignedId, setAssignedId] = useState(employees[0]?.id ?? 1);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Nieuwe taak */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Nieuwe taak</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Taaknaam
          </label>
          <input
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bijv. Remblokken vervangen"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Werkorder
          </label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            value={workorderId}
            onChange={(e) => setWorkorderId(e.target.value)}
          >
            {workorders.map((w) => (
              <option key={w.id} value={w.id}>
                #{w.id} – {w.vehicle}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Toewijzen aan medewerker
          </label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            value={assignedId}
            onChange={(e) => setAssignedId(Number(e.target.value))}
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.role})
              </option>
            ))}
          </select>
        </div>

        <button
          className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            if (name.trim()) {
              addTask({
                workorderId,
                name: name.trim(),
                assignedId,
                status: "To do",
                time: "-",
              });
              setName("");
            }
          }}
        >
          Taak toevoegen
        </button>
      </div>

      {/* Overzicht taken */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Alle taken</h2>
        {tasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between border-t first:border-t-0 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-slate-700">{t.name}</p>
              <p className="text-xs text-slate-500">WO #{t.workorderId}</p>
            </div>
            <div className="flex items-center gap-1">
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
              <button
                className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
                onClick={() => updateTaskStatus(t.id, "Bezig")}
              >
                Bezig
              </button>
              <button
                className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
                onClick={() => updateTaskStatus(t.id, "Afgerond")}
              >
                Klaar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
