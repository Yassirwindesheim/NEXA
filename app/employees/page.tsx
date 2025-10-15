"use client";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function EmployeesPage() {
  const { employees, addEmployee } = useAppContext();
  const [name, setName] = useState("");
  const [role, setRole] = useState("Monteur");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Nieuwe medewerker */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Nieuwe medewerker
        </h2>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Naam
          </label>
          <input
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bijv. Sarah"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Rol
          </label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Monteur</option>
            <option>Balie</option>
            <option>Admin</option>
          </select>
        </div>

        <button
          className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            if (name.trim()) {
              addEmployee({ name: name.trim(), role });
              setName("");
              setRole("Monteur");
            }
          }}
        >
          Toevoegen
        </button>
      </div>

      {/* Overzicht medewerkers */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          Overzicht medewerkers
        </h2>
        {employees.length === 0 && (
          <p className="text-sm text-slate-500">
            Nog geen medewerkers toegevoegd.
          </p>
        )}
        {employees.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between border-t first:border-t-0 py-2 text-sm"
          >
            <span className="font-medium text-slate-700">{e.name}</span>
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-slate-600 border border-gray-200">
              {e.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
