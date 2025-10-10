"use client";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function EmployeesPage() {
  const { employees, addEmployee } = useAppContext();
  const [name, setName] = useState("");
  const [role, setRole] = useState("Monteur");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Nieuwe medewerker</h2>
        <div className="mt-3 space-y-2">
          <label className="block text-sm">Naam</label>
          <input className="border rounded px-3 py-2 w-full" value={name} onChange={e => setName(e.target.value)} />
          <label className="block text-sm">Rol</label>
          <select className="border rounded px-3 py-2 w-full" value={role} onChange={e => setRole(e.target.value)}>
            <option>Monteur</option>
            <option>Balie</option>
            <option>Admin</option>
          </select>
          <button className="mt-2 px-4 py-2 bg-slate-800 text-white rounded" onClick={() => { if (name.trim()) { addEmployee({ name: name.trim(), role }); setName(""); setRole("Monteur"); } }}>Medewerker toevoegen</button>
        </div>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Overzicht medewerkers</h2>
        <div className="mt-3 space-y-2 text-sm">
          {employees.map(e => (
            <div key={e.id} className="flex items-center justify-between border-b py-2">
              <div>
                <div className="font-medium">{e.name}</div>
                <div className="text-xs text-slate-500">ID: {e.id}</div>
              </div>
              <div className="text-sm">{e.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
