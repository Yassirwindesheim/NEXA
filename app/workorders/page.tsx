"use client";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function WorkordersPage() {
  const { workorders, addWorkorder } = useAppContext();
  const [form, setForm] = useState({
    id: "",
    vehicle: "",
    customer: "",
    phone: "",
    received: "",
    due: "",
    complaint: "",
  });

  const labels: Record<string, string> = {
    id: "Werkorder ID",
    vehicle: "Voertuig",
    customer: "Klantnaam",
    phone: "Telefoonnummer",
    received: "Binnenkomst datum",
    due: "Verwachte oplevering",
    complaint: "Klachtomschrijving",
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Nieuwe werkorder */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Nieuwe werkorder</h2>

        {Object.entries(form).map(([k, v]) => (
          <div key={k} className="mb-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {labels[k]}
            </label>
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
              value={v}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
          </div>
        ))}

        <button
          className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            if (!form.id || !form.customer || !form.vehicle) return;
            addWorkorder({ ...form, status: "Nieuw" });
            setForm({
              id: "",
              vehicle: "",
              customer: "",
              phone: "",
              received: "",
              due: "",
              complaint: "",
            });
          }}
        >
          Werkorder aanmaken
        </button>
      </div>

      {/* Overzicht */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Alle werkorders</h2>
        {workorders.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between border-t first:border-t-0 py-2 text-sm"
          >
            <div>
              <div className="font-medium text-slate-700">
                #{w.id} – {w.vehicle}
              </div>
              <div className="text-xs text-slate-500">{w.customer}</div>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full text-white ${
                w.status === "In behandeling" ? "bg-amber-500" : "bg-gray-500"
              }`}
            >
              {w.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
