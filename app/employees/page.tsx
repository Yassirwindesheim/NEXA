"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/TokenContext"; 
// We will manage employee state locally, keeping useAppContext only if needed elsewhere
// import { useAppContext } from "../context/AppContext"; 

// Define the base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

// --- Interfaces based on your FastAPI EmployeeOut Schema ---
interface Employee {
    id: number;
    name: string;
    role: string;
    user_id: number | null; // Based on your EmployeeOut schema
}

// --- Reusable Data Fetcher (Helper) ---
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
            return []; // Return empty array on error
        }
        return await response.json();
    } catch (err) {
        console.error(`Network error fetching ${endpoint}:`, err);
        return [];
    }
};

// =========================================================================
// EMPLOYEES PAGE COMPONENT
// =========================================================================
export default function EmployeesPage() {
    const { token, isAuthReady } = useAuth();
    
    // Local State for Fetched Data
    const [fetchedEmployees, setFetchedEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [role, setRole] = useState("Monteur"); // Default role

    // Function to load ALL employees
    const loadEmployees = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        setError(null);
        
        const employeesData: Employee[] = await fetchData("/employees", token);
        
        if (employeesData.length > 0 || token) { // Check if we got data or if we failed due to auth/network
            setFetchedEmployees(employeesData);
        } else if (!token && isAuthReady) {
            setError("U bent niet ingelogd. Log in om medewerkers te bekijken.");
        }
        
        setLoading(false);
    }, [token, isAuthReady]);

    // --- Data Fetching Effect ---
    useEffect(() => {
        if (!isAuthReady) return;

        if (!token) {
            setError("Niet geautoriseerd. Gelieve in te loggen.");
            setLoading(false);
            return;
        }

        loadEmployees();
    }, [token, isAuthReady, loadEmployees]); 

    // --- API Handlers ---

    const handleAddEmployee = async () => {
        if (!name.trim() || !role || !token) return;

        setIsSubmitting(true);
        setError(null);
        
        try {
            // Note: Your backend requires an Admin user for this POST request.
            // Note 2: We omit user_id as it's optional in EmployeeCreate schema 
            // and often handled separately for linking to an actual user account.
            const payload = {
                name: name.trim(),
                role: role,
                // user_id is omitted assuming it's linked later or not required for creation
            };
            
            const response = await fetch(`${API_BASE_URL}/employees`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 403) {
                throw new Error("Toegang geweigerd: Alleen beheerders (Admin) kunnen nieuwe medewerkers aanmaken.");
            }
            if (!response.ok) {
                console.error("Employee creation failed:", response.status, response.statusText);
                throw new Error(`Fout: ${response.statusText || "Medewerker kon niet worden aangemaakt."}`);
            }

            const newEmployee: Employee = await response.json();
            
            // Update the list and reset the form
            setFetchedEmployees(prev => [newEmployee, ...prev]); 
            setName("");
            setRole("Monteur"); // Reset to default

        } catch (err: any) {
            setError(err.message || "Er is een netwerkfout opgetreden bij het aanmaken.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- UI Rendering ---

    if (loading) {
        return <div className="p-10 text-center text-lg text-blue-600">Medewerkersgegevens worden geladen...</div>;
    }

    if (error) {
        return <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl">{error}</div>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            
            {/* Nieuwe medewerker (Creation Form) */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Nieuwe medewerker</h2>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Naam</label>
                    <input
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Bijv. Sarah"
                        disabled={isSubmitting}
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                    <select
                        className="border border-gray-200 rounded-lg px-3 py-2 w-full text-sm"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isSubmitting}
                    >
                        <option>Monteur</option>
                        <option>Balie</option>
                        <option>Admin</option>
                    </select>
                </div>

                <button
                    className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    onClick={handleAddEmployee}
                    disabled={!name.trim() || isSubmitting}
                >
                    {isSubmitting ? "Bezig..." : "Toevoegen"}
                </button>
            </div>

            {/* Overzicht medewerkers (List) */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-3">
                    Overzicht medewerkers ({fetchedEmployees.length})
                </h2>
                
                {fetchedEmployees.length === 0 ? (
                    <p className="text-sm text-slate-500">Nog geen medewerkers toegevoegd.</p>
                ) : (
                    fetchedEmployees.map((e) => (
                        <div
                            key={e.id}
                            className="flex items-center justify-between border-t first:border-t-0 py-2 text-sm"
                        >
                            <span className="font-medium text-slate-700">{e.name}</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                {e.role}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}