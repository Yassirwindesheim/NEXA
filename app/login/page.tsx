"use client";

import React, { useState } from 'react';
// Importeer de useAuth hook. Let op de .tsx extensie voor correcte module resolutie.
import { useAuth } from '../context/TokenContext';

export default function LoginForm() {
    // 1. Haal de login functie en authenticatiestatus op
    const { login, isAuthenticated } = useAuth(); 
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage('');

        if (!username || !password) {
            setStatusMessage('Vul zowel uw gebruikersnaam als wachtwoord in.');
            setIsLoading(false);
            return;
        }

        try {
            // 2. Roep de centrale login functie aan
            const success = await login(username, password);

            if (success) {
                // De token is opgeslagen. De parent component (WorkorderClientComponent) 
                // zal automatisch reageren en de werkbonnen tonen.
                setStatusMessage('Aanmelden succesvol! U wordt doorgestuurd naar het overzicht.');
            } else {
                // Toon de foutmelding van de API
                setStatusMessage('Aanmelden mislukt. Controleer uw gegevens.');
            }
        } catch (error) {
            // Vang netwerkfouten op
            setStatusMessage('Er is een netwerkfout opgetreden. Probeer het later opnieuw.');
        } finally {
            setIsLoading(false);
        }
    };

    // Als de gebruiker is geauthenticeerd (door een andere component), toon het formulier niet
    if (isAuthenticated) {
        return (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                U bent reeds aangemeld.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-8 max-w-sm mx-auto bg-white shadow-xl rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Systeem Aanmelden</h2>
            
            {/* Status Berichten */}
            {statusMessage && (
                <p className={`mb-4 p-3 text-sm rounded ${
                    statusMessage.includes('succesvol') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {statusMessage}
                </p>
            )}

            {/* Gebruikersnaam Veld */}
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Gebruikersnaam</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                    required
                />
            </div>

            {/* Wachtwoord Veld */}
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                    required
                />
            </div>

            {/* Login Knop */}
            <button
                type="submit"
                className={`w-full py-2.5 rounded-lg text-white font-semibold transition duration-200 ${
                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                }`}
                disabled={isLoading}
            >
                {isLoading ? 'Aanmelden...' : 'Log In'}
            </button>
        </form>
    );
}
