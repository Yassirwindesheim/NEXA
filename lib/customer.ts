    // /lib/customer.ts

// Define a minimal type for the customer dropdown
export interface CustomerData {
    id: number;
    name: string;
    phone?: string;
    email?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

/**
 * Fetches a list of customers for use in a dropdown (select) field.
 * @param authHeader The Authorization header string (e.g., "Bearer YOUR_TOKEN").
 * @returns A promise resolving to an array of CustomerSelectData.
 */
export async function fetchCustomersForSelect(
    authHeader?: string
): Promise<CustomerData[]> {
    if (!authHeader) {
        // We throw here instead of in fetchApi because this is a specific utility
        throw new Error("Authentication required: No auth header provided"); 
    }

    const url = `${API_BASE_URL}/customers`; 

    const res = await fetch(url, {
        headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch customers: ${res.statusText}`);
    }
    
    return res.json();
}