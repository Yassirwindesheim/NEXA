"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/TokenContext";
// Assuming StatusIcon was either a custom component or a simple utility. 
// We will define a basic version of it locally.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

// --- Interfaces based on the Backend Schemas ---

interface WorkorderListItem {
    id: string;
    customer: string;
    vehicle: string;
    status: string;
}

interface PortalTask {
    name: string;
    status: string;
}

interface PortalWO {
    id: string;
    vehicle: string;
    customer: string;
    complaint: string | null;
    status: string;
    progress_pct: number; // Directly from the backend
    tasks: PortalTask[];
}

// --- Helper Components & Styles ---

const statusStyle = (s: string) =>
    s === "Afgerond"
        ? "bg-green-100 text-green-700 border-green-200"
        : s === "Bezig"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-gray-100 text-gray-600 border-gray-200";

// Simple Status Icon implementation for completeness
const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
    const baseClasses = "w-4 h-4";
    if (status === "Afgerond") {
        return <svg className={`${baseClasses} text-green-600`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 13.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
    }
    if (status === "Bezig") {
        return <svg className={`${baseClasses} text-amber-600`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-6h2v6zm0-8H9V6h2v2z" /></svg>;
    }
    return <svg className={`${baseClasses} text-gray-400`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v3a1 1 0 01-2 0V9z" /></svg>;
};

// =========================================================================
// PORTAL PAGE COMPONENT
// =========================================================================

export default function PortalPage() {
    const { token, isAuthReady } = useAuth();
    
    const [fetchedWorkorders, setFetchedWorkorders] = useState<WorkorderListItem[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [currentWorkorder, setCurrentWorkorder] = useState<PortalWO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Data Fetching Logic ---

    // 1. Fetch list of all workorders for the dropdown
    useEffect(() => {
        if (!isAuthReady || !token) {
            if (isAuthReady) setError("Niet geautoriseerd. Gelieve in te loggen.");
            setLoading(false);
            return;
        }

        const fetchWorkorderList = async () => {
            setError(null);
            try {
                // NOTE: We assume a /workorders endpoint exists to get the dropdown list
                const response = await fetch(`${API_BASE_URL}/workorders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Kon lijst met werkorders niet laden.");

                const list: WorkorderListItem[] = await response.json();
                setFetchedWorkorders(list);

                // Set the initial selected ID
                if (list.length > 0 && selectedId === "") {
                    setSelectedId(list[0].id);
                }
                
            } catch (err: any) {
                setError(err.message || "Fout bij het laden van werkorders.");
            }
        };

        fetchWorkorderList();
    }, [isAuthReady, token, selectedId]);

    // 2. Fetch detailed data for the selected workorder
    const fetchWorkorderDetail = useCallback(async (id: string) => {
        if (!id || !token) return;

        setLoading(true);
        setError(null);
        setCurrentWorkorder(null);

        try {
            const response = await fetch(`${API_BASE_URL}/portal/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 404) {
                 throw new Error(`Werkorder #${id} niet gevonden.`);
            }
            if (!response.ok) {
                throw new Error("Kon werkorderdetails niet laden.");
            }

            const woDetail: PortalWO = await response.json();
            setCurrentWorkorder(woDetail);
            
        } catch (err: any) {
            setError(err.message || "Fout bij het laden van details.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Effect to trigger detail fetch when selectedId changes
    useEffect(() => {
        if (selectedId && token) {
            fetchWorkorderDetail(selectedId);
        } else if (!selectedId && fetchedWorkorders.length > 0) {
             // Handle case where we have a list but no selection is made yet (should be caught by the first effect)
             setSelectedId(fetchedWorkorders[0].id);
        }
    }, [selectedId, token, fetchedWorkorders, fetchWorkorderDetail]);


    // --- Render Logic ---
    
    if (loading && !currentWorkorder) {
        return <div className="p-10 text-center text-lg text-blue-600">Gegevens worden geladen...</div>;
    }

    if (error) {
        return <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl">{error}</div>;
    }

    if (!currentWorkorder) {
         return (
            <div className="p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl">
                Er zijn geen werkorders beschikbaar of geselecteerd.
            </div>
        );
    }
    
    // Now we use currentWorkorder for all display data
    const wo = currentWorkorder;
    const woTasks = wo.tasks;
    const progress = wo.progress_pct;

    return (
        <div className="space-y-6">
            {/* Selectie */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <label className="text-sm text-slate-700 mr-2">Selecteer werkorder:</label>
                <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    disabled={fetchedWorkorders.length === 0}
                >
                    {fetchedWorkorders.map((w) => (
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
                    {wo.complaint && (
                        <p className="text-xs text-slate-400 italic mt-1">
                            Klacht: {wo.complaint}
                        </p>
                    )}
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
                {woTasks.length === 0 ? (
                    <p className="text-sm text-slate-500">Er zijn nog geen taken voor deze werkorder.</p>
                ) : (
                    <ul className="relative space-y-4">
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
                        {woTasks.map((t, index) => (
                            <li key={index} className="relative pl-10">
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
                )}
                <p className="text-xs text-slate-500 mt-4">
                    Persoonlijke gegevens worden om privacyredenen niet getoond.
                </p>
            </div>
        </div>
    );
}