"use client";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function WorkordersPage() {
  const { workorders, addWorkorder } = useAppContext();
  const [id, setId] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [received, setReceived] = useState("");
  const [due, setDue] = useState("");
  const [complaint, setComplaint] = useState("");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Nieuwe werkorder</h2>
        <div className="mt-3 space-y-2">
          <label className="block text-sm">Werkorder ID</label>
          <input className="border rounded px-3 py-2 w-full" value={id} onChange={e => setId(e.target.value)} />
          <label className="block text-sm">Voertuig</label>
          <input className="border rounded px-3 py-2 w-full" value={vehicle} onChange={e => setVehicle(e.target.value)} />
          <label className="block text-sm">Klantnaam</label>
          <input className="border rounded px-3 py-2 w-full" value={customer} onChange={e => setCustomer(e.target.value)} />
          <label className="block text-sm">Telefoon</label>
          <input className="border rounded px-3 py-2 w-full" value={phone} onChange={e => setPhone(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm">Binnenkomst</label>
              <input className="border rounded px-3 py-2 w-full" value={received} onChange={e => setReceived(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Oplevering</label>
              <input className="border rounded px-3 py-2 w-full" value={due} onChange={e => setDue(e.target.value)} />
            </div>
          </div>
          <label className="block text-sm">Klacht</label>
          <input className="border rounded px-3 py-2 w-full" value={complaint} onChange={e => setComplaint(e.target.value)} />
          <button className="mt-2 px-4 py-2 bg-slate-800 text-white rounded" onClick={() => {
            if (!id || !vehicle || !customer) return;
            addWorkorder({ id, vehicle, customer, phone, received, due, complaint, status: "Nieuw" });
            setId(""); setVehicle(""); setCustomer(""); setPhone(""); setReceived(""); setDue(""); setComplaint("");
          }}>Werkorder aanmaken</button>
        </div>
      </div>

      <div className="rounded-2xl border p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Alle werkorders</h2>
        <div className="mt-3 space-y-2 text-sm">
          {workorders.map(w => (
            <div key={w.id} className="flex items-center justify-between border-b py-2">
              <div>
                <div className="font-medium">#{w.id} – {w.vehicle}</div>
                <div className="text-xs text-slate-500">{w.customer} • {w.received} → {w.due}</div>
              </div>
              <div className="text-sm">
                <span className="inline-block bg-amber-500 text-white px-2 py-1 rounded">{w.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
