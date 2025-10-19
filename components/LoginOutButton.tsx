"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/context/TokenContext';

const LogoutButton: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    if (!isAuthenticated) {
        return null; // Don't show the button if not logged in
    }

    const handleLogout = () => {
        logout();
        // Redirect to login page after logout
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full text-left text-red-600 hover:bg-red-50 transition"
            title="Uitloggen"
        >
            Uitloggen
        </button>
    );
};

export default LogoutButton;