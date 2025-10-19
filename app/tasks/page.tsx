"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/TokenContext";

// Define the base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

// --- Interfaces based on your FastAPI TaskOut Schema ---
interface Task {
  id: number;
  workorder_id: string;
  name: string;
  assigned_employee_id: number;
  status: string;
  time_spent: string | null;
}

interface WorkOrder {
  id: string;
  vehicle: string;
}

interface Employee {
  id: number;
  name: string;
  role: string;
}

// --- Reusable Data Fetcher ---
const fetchData = async (endpoint: string, token: string | null) => {
  if (!token) return [];
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${endpoint}:`, response.status, response.statusText);
      return [];
    }
    return await response.json();
  } catch (err) {
    console.error(`Network error fetching ${endpoint}:`, err);
    return [];
  }
};

// =========================================================================
// TASKS PAGE COMPONENT
// =========================================================================
export default function TasksPage() {
  const { token, isAuthReady } = useAuth();

  // State for Fetched Data
  const [fetchedTasks, setFetchedTasks] = useState<Task[]>([]);
  const [fetchedWorkorders, setFetchedWorkorders] = useState<WorkOrder[]>([]);
  const [fetchedEmployees, setFetchedEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [workorderId, setWorkorderId] = useState<string>("");
  const [assignedId, setAssignedId] = useState<number>(0);

  // Function to load ALL data
  const loadData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    const [tasksData, workordersData, employeesData] = await Promise.all([
      fetchData("/tasks", token),
      fetchData("/workorders", token),
      fetchData("/employees", token),
    ]);

    // ✅ Normalize tasks shape to array
    const tasksArray = Array.isArray(tasksData)
      ? tasksData
      : tasksData?.items ?? tasksData?.results ?? [];

    if (!Array.isArray(tasksArray)) {
      console.warn("Unexpected /tasks payload:", tasksData);
      setFetchedTasks([]);
    } else {
      setFetchedTasks(tasksArray);
    }

    setFetchedWorkorders(
      workordersData.map((w: any) => ({
        id: w.id.toString(),
        vehicle: w.vehicle,
      }))
    );
    setFetchedEmployees(
      employeesData.map((e: any) => ({
        id: e.id,
        name: e.name,
        role: e.role || "Medewerker",
      }))
    );

    // Set default values for the form dropdowns only if they were empty
    if (workordersData.length > 0 && workorderId === "") {
      setWorkorderId(workordersData[0].id.toString());
    }
    if (employeesData.length > 0 && assignedId === 0) {
      setAssignedId(employeesData[0].id);
    }

    setLoading(false);
  }, [token, workorderId, assignedId]);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!isAuthReady) return;

    if (!token) {
      setError("Niet geautoriseerd. Gelieve in te loggen.");
      setLoading(false);
      return;
    }

    loadData();
  }, [token, isAuthReady, loadData]);

  // --- API Handlers ---

  const handleAddTask = async () => {
    if (!name.trim() || !workorderId || assignedId === 0 || !token) return;

    try {
      const payload = {
        workorder_id: workorderId,
        name: name.trim(),
        assigned_employee_id: assignedId,
        status: "To do",
      };

      console.log("📤 Creating task with payload:", payload);

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Task creation failed:", response.statusText, errorText);
        throw new Error("Taak kon niet worden aangemaakt.");
      }

      // Even if we get a task back, re-fetch to stay consistent
      await loadData();
      setName("");
    } catch (err: any) {
      console.error("❌ Error creating task:", err);
      setError(err.message || "Er is een fout opgetreden bij het aanmaken van de taak.");
    }
  };

  // ✅ Optimistic status update + rollback on error
  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    if (!token) return;

    // Find current task
    const currentIndex = fetchedTasks.findIndex((t) => t.id === taskId);
    if (currentIndex === -1) return;
    const currentTask = fetchedTasks[currentIndex];

    // Skip if same status
    if (currentTask.status === newStatus) return;

    // Optimistic update
    const prevTasks = fetchedTasks;
    const optimistic = [...prevTasks];
    optimistic[currentIndex] = { ...currentTask, status: newStatus };
    setFetchedTasks(optimistic);

    try {
      const payload = {
        workorder_id: currentTask.workorder_id,
        name: currentTask.name,
        assigned_employee_id: currentTask.assigned_employee_id,
        status: newStatus,
      };

      console.log("📤 Updating task", taskId, "to", newStatus, "payload:", payload);

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Status update failed:", response.statusText, errorText);
        throw new Error("Status kon niet worden bijgewerkt.");
      }

      const updatedTask: Task = await response.json();
      setFetchedTasks((cur) => cur.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (err: any) {
      console.error("❌ Error updating status:", err);
      setError(err.message || "Er is een fout opgetreden bij het bijwerken van de status.");
      // Rollback
      setFetchedTasks(prevTasks);
    }
  };

  // --- UI Rendering ---

  if (loading) {
    return <div className="p-10 text-center text-lg text-blue-600">Gegevens worden geladen...</div>;
  }

  if (error && error !== "Niet geautoriseerd. Gelieve in te loggen.") {
    return <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl">{error}</div>;
  }

  // Filter tasks by status for better display
  const todoTasks = fetchedTasks.filter((t) => t.status !== "Afgerond");
  const doneTasks = fetchedTasks.filter((t) => t.status === "Afgerond");

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Nieuwe taak (Task Creation Form) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Nieuwe taak</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">Taaknaam</label>
          <input
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bijv. Remblokken vervangen"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">Werkorder</label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            value={workorderId}
            onChange={(e) => setWorkorderId(e.target.value)}
            disabled={fetchedWorkorders.length === 0}
          >
            {fetchedWorkorders.length > 0 ? (
              fetchedWorkorders.map((w) => (
                <option key={w.id} value={w.id}>
                  #{w.id} – {w.vehicle}
                </option>
              ))
            ) : (
              <option value="">Geen werkorders beschikbaar</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-700 mb-1">Toewijzen aan medewerker</label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
            value={assignedId}
            onChange={(e) => setAssignedId(Number(e.target.value))}
            disabled={fetchedEmployees.length === 0}
          >
            {fetchedEmployees.length > 0 ? (
              fetchedEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.role})
                </option>
              ))
            ) : (
              <option value={0}>Geen medewerkers beschikbaar</option>
            )}
          </select>
        </div>

        <button
          className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          onClick={handleAddTask}
          disabled={!name.trim() || !workorderId || assignedId === 0 || loading}
        >
          Taak toevoegen
        </button>
      </div>

      {/* Overzicht taken (Task List) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Openstaande taken ({todoTasks.length})</h2>

        {todoTasks.length === 0 ? (
          <p className="text-slate-500">Er zijn geen openstaande taken.</p>
        ) : (
          todoTasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between border-t first:border-t-0 py-2 text-sm">
              <div>
                <p className="font-medium text-slate-700">{t.name}</p>
                <p className="text-xs text-slate-500">WO #{t.workorder_id}</p>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`px-2 py-1 text-xs rounded text-white ${
                    t.status === "Afgerond" ? "bg-green-500" : t.status === "Bezig" ? "bg-amber-500" : "bg-gray-400"
                  }`}
                >
                  {t.status}
                </span>

                {/* ➕ Nu met 3 knoppen, met disabling als status al zo is */}
                <button
                  className="px-2 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50"
                  disabled={t.status === "To do"}
                  onClick={() => handleUpdateStatus(t.id, "To do")}
                >
                  To do
                </button>
                <button
                  className="px-2 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50"
                  disabled={t.status === "Bezig"}
                  onClick={() => handleUpdateStatus(t.id, "Bezig")}
                >
                  Bezig
                </button>
                <button
                  className="px-2 py-1 border rounded text-xs hover:bg-gray-50 disabled:opacity-50"
                  disabled={t.status === "Afgerond"}
                  onClick={() => handleUpdateStatus(t.id, "Afgerond")}
                >
                  Klaar
                </button>
              </div>
            </div>
          ))
        )}

        {/* Afgeronde taken met terugzet-knoppen */}
        {doneTasks.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-md font-semibold text-slate-600 mb-2">Afgeronde taken ({doneTasks.length})</h3>
            {doneTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-1 text-sm">
                <div className="flex items-center gap-2">
                  <p className="line-through">{t.name}</p>
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">{t.status}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
                    onClick={() => handleUpdateStatus(t.id, "Bezig")}
                  >
                    Terug naar “Bezig”
                  </button>
                  <button
                    className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
                    onClick={() => handleUpdateStatus(t.id, "To do")}
                  >
                    Terug naar “To do”
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
