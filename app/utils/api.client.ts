// This utility should be used in client components ("use client")

import { getAccessToken, removeAccessToken } from "./auth.client";

// Define the base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

/**
 * A centralized utility to fetch data from the API.
 * * It automatically includes the Authorization header and handles 401 Unauthorized errors 
 * by clearing the token and forcing a page reload/redirect.
 * * @param endpoint The API endpoint (e.g., "/workorders").
 * @param options Standard Fetch API options.
 * @returns The Response object from the fetch call.
 * @throws {Error} If a network error, 401, or other non-OK status occurs.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = getAccessToken();
    
    // Default headers, merge with any custom headers
    const headers = {
        "Content-Type": "application/json",
        // Only add Authorization header if a token exists
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...options.headers,
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // 🛑 Centralized 401 handling
        if (response.status === 401) {
            // Remove the invalid token from storage and cookie
            removeAccessToken();
            console.error(`401 Unauthorized from endpoint ${endpoint}. Forcing re-login.`);
            
            // Show the user an error, then force a reload. 
            // The AuthProvider's useEffect will see the missing token and handle navigation.
            
            // Throw a specific error to halt the calling component's execution
            const authError = new Error("Sessie verlopen. U wordt uitgelogd.");
            
            // Use setTimeout for the reload to give the calling component's state a chance to update 
            // with the error message before the page refreshes.
            setTimeout(() => {
                 window.location.reload(); 
            }, 500);
            
            throw authError;
        }
        
        // Handle generic non-OK statuses (400, 500, etc.)
        if (!response.ok) {
            let errorDetail = response.statusText;
            try {
                 // Try to read a more descriptive error from the response body
                 const errorJson = await response.json();
                 errorDetail = errorJson.detail || errorDetail;
            } catch (e) {
                // Ignore parsing error if response is not JSON
            }
            throw new Error(`API Fout (${response.status}): ${errorDetail}`);
        }

        return response;
        
    } catch (error) {
        // Re-throw specific errors (like the session expired error)
        if (error instanceof Error) {
            throw error;
        }
        // Handle network errors (e.g., server offline, CORS issue)
        console.error(`Netwerkfout voor ${endpoint}:`, error);
        throw new Error("Netwerk- of serverfout. Controleer de verbinding.");
    }
}