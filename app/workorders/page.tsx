// WorkOrdersPage.tsx (Complete Code)
"use client";
import React, { useState, useEffect, useCallback } from "react";
// Import workorder utilities
import { 
    WorkorderOutData, 
    WorkorderCreateData, 
    fetchWorkorders, 
    createWorkorder 
} from "../../lib/workorder";
// 🔑 Import new customer utilities
import { CustomerData, fetchCustomersForSelect } from "../../lib/customer"; 

import { useAuth } from "../context/TokenContext"; 

// --- Constants ---
const EMPTY_WORKORDER_FORM: WorkorderCreateData = {
    customer_id: 0, 
    vehicle: "",
    complaint: "",
    status: "Nieuw",
    received: new Date().toISOString().substring(0, 10), 
    due: new Date().toISOString().substring(0, 10), 
};


// ---------------------------------------------------------------------
// 1. WORK ORDER CREATION MODAL COMPONENT (UPDATED FOR DROPDOWN)
// ---------------------------------------------------------------------

const CreateWorkorderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WorkorderCreateData) => Promise<void>;
    customers: CustomerData[]; 
    isCustomersLoading: boolean; 
}> = ({ isOpen, onClose, onSubmit, customers, isCustomersLoading }) => {
    
    const [formData, setFormData] = useState<WorkorderCreateData>(EMPTY_WORKORDER_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    // Reset form data and error when the modal opens/closes
    useEffect(() => {
        if (isOpen) {
            // Set the customer_id to the first customer's ID if available, otherwise 0
            const defaultCustomerId = customers.length > 0 ? customers[0].id : 0;
            setFormData({ 
                ...EMPTY_WORKORDER_FORM,
                customer_id: defaultCustomerId
            });
            setLocalError(null);
        }
    }, [isOpen, customers]); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            // Convert the value from the select element to an integer for customer_id
            [name]: name === 'customer_id' ? parseInt(value) || 0 : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setIsSubmitting(true);
        try {
            // Validate that a customer has been selected (ID > 0)
            if (!formData.customer_id || formData.customer_id === 0) {
                setLocalError("Klant is verplicht. Selecteer een klant uit de lijst.");
                return;
            }
            
            await onSubmit(formData);
            onClose(); 
        } catch (error: any) {
            console.error("Creation failed:", error);
            setLocalError(error.message || "Er is een onbekende fout opgetreden bij het aanmaken.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-slate-800">Nieuwe Werkorder Aanmaken</h3>
                {localError && (
                    <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {localError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* 🔑 DROPDOWN FOR CUSTOMER_ID */}
                    <div>
                        <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Klant</label>
                        <select
                            id="customer_id"
                            name="customer_id"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white"
                            value={formData.customer_id || 0} 
                            onChange={handleChange}
                            required
                            disabled={isCustomersLoading} 
                        >
                            <option value={0} disabled>
                                {isCustomersLoading ? 'Klanten laden...' : 'Selecteer een klant'}
                            </option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} (ID: {customer.id})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Voertuig</label>
                        <input 
                            name="vehicle"
                            type="text" 
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md" 
                            value={formData.vehicle} 
                            onChange={handleChange} 
                            required 
                            placeholder="Kenteken of beschrijving"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Klacht</label>
                        <textarea 
                            name="complaint"
                            rows={3}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md" 
                            value={formData.complaint || ''} 
                            onChange={handleChange} 
                            placeholder="Beschrijf de klacht of het probleem"
                        />
                    </div>
                    
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Ontvangen Datum</label>
                            <input 
                                name="received"
                                type="date" 
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md" 
                                value={formData.received} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Verval Datum (Due)</label>
                            <input 
                                name="due"
                                type="date" 
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md" 
                                value={formData.due} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                            Annuleren
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting || isCustomersLoading} 
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Aanmaken...' : 'Werkorder Aanmaken'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ---------------------------------------------------------------------
// 2. MAIN WORKORDERS COMPONENT (UPDATED TO LOAD CUSTOMERS)
// ---------------------------------------------------------------------

export default function WorkOrdersPage() {
    const [workOrders, setWorkOrders] = useState<WorkorderOutData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    
    // 🔑 New state for customers
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [customersError, setCustomersError] = useState<string | null>(null);

    const { isAuthReady, isAuthenticated, token } = useAuth();

    // 🔑 NEW: Function to load customers
    const loadCustomers = useCallback(async () => {
        const authHeader = token ? `Bearer ${token}` : undefined;
        if (!isAuthReady || !isAuthenticated || !authHeader) return;

        setCustomersLoading(true);
        setCustomersError(null);
        try {
            const data = await fetchCustomersForSelect(authHeader);
            setCustomers(data);
        } catch (err: any) {
            console.error("Customers Fetch Error:", err.message);
            setCustomersError("Klanten konden niet geladen worden. " + err.message);
        } finally {
            setCustomersLoading(false);
        }
    }, [isAuthReady, isAuthenticated, token]);


    // READ: Centralized fetch function for workorders
    const loadWorkorders = useCallback(async () => {
        const authHeader = token ? `Bearer ${token}` : undefined;

        if (!isAuthReady || !isAuthenticated || !authHeader) return;

        setLoading(true);
        setError(null);
        try {
            const data = await fetchWorkorders(null, authHeader); 
            setWorkOrders(data);
        } catch (err: any) {
            console.error("Fetch Error:", err.message);
            setError(err.message); 
        } finally {
            setLoading(false);
        }
    }, [isAuthReady, isAuthenticated, token]);

    // CREATE: Handle new work order submission
    const handleCreateWorkorder = async (payload: WorkorderCreateData) => {
        const authHeader = token ? `Bearer ${token}` : undefined;
        if (!authHeader) throw new Error("Authentication token is missing.");

        try {
            const newWorkorder = await createWorkorder(payload, authHeader);
            setWorkOrders(prev => [newWorkorder, ...prev]);
        } catch (err: any) {
            throw err; 
        }
    };

    // --- Effects & UI Logic ---
    useEffect(() => {
        loadWorkorders();
        loadCustomers(); // Fetch customers on mount
    }, [loadWorkorders, loadCustomers]); 

    // Handlers for the modal
    const handleOpenCreateModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Combine loading and error states for main UI
    const finalLoading = loading; // We only check workorder loading for the main view
    const finalError = error || customersError; // Display customer error even if main list loads


    // Loading State
    if (finalLoading) {
        return (
            <div className="flex items-center justify-center p-10 bg-white shadow-xl rounded-xl">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg text-slate-700">Werkorders laden...</span>
            </div>
        );
    }

    // Error State
    if (finalError) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                <h2 className="text-xl font-semibold mb-2">Fout</h2>
                <p>{finalError}</p>
            </div>
        );
    }

    // Main View
    return (
        <div className="p-6 bg-white shadow-xl rounded-xl">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h1 className="text-2xl font-bold text-slate-800">Overzicht Werkorders ({workOrders.length})</h1>
                <button 
                    onClick={handleOpenCreateModal} 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center space-x-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Nieuwe Werkorder</span>
                </button>
            </div>
            
            {workOrders.length === 0 ? (
                <div className="p-10 text-center bg-gray-50 border border-gray-200 rounded-xl">
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Geen Werkorders Gevonden</h2>
                    <p className="text-slate-600">Gebruik de knop hierboven om een nieuwe werkorder aan te maken.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voertuig</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ontvangen</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {workOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.vehicle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td> 
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            order.status === 'Afgerond' ? 'bg-green-100 text-green-800' :
                                            order.status === 'In behandeling' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800' 
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.received).toLocaleDateString('nl-NL')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Work Order Creation Modal (Passing customer props) */}
            <CreateWorkorderModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateWorkorder}
                customers={customers}
                isCustomersLoading={customersLoading}
            />
        </div>
    );
}