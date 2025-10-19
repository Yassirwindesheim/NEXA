// lib/workorder.ts
// Client-side versie: vereist altijd een authHeader parameter

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export interface WorkorderCreateData {
  vehicle: string;
  complaint: string | null;
  status: "Nieuw" | "In behandeling" | "Afgerond";
  received: string;
  due: string;
  customer_id: number;
}

export interface WorkorderOutData extends WorkorderCreateData {
  id: string;
  customer: string;
  phone: string | null;
}

// --------------------------------------------------------------------------
// Fetch All Work Orders - CLIENT SIDE
// --------------------------------------------------------------------------
export async function fetchWorkorders(
  statusFilter: string | null = null,
  authHeader?: string
): Promise<WorkorderOutData[]> {
  if (!authHeader) {
    throw new Error("Authentication required: No auth header provided");
  }

  let url = `${API_BASE_URL}/workorders`;
  if (statusFilter) url += `?status=${encodeURIComponent(statusFilter)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch work orders: ${res.statusText}`);
  }
  return res.json();
}

// --------------------------------------------------------------------------
// Create New Work Order - CLIENT SIDE
// --------------------------------------------------------------------------
export async function createWorkorder(
  data: WorkorderCreateData,
  authHeader?: string
): Promise<WorkorderOutData> {
  if (!authHeader) {
    throw new Error("Authentication required: No auth header provided");
  }

  const res = await fetch(`${API_BASE_URL}/workorders`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(`Failed to create work order: ${JSON.stringify(detail)}`);
  }
  return res.json();
}

// --------------------------------------------------------------------------
// Update Work Order - CLIENT SIDE
// --------------------------------------------------------------------------
export async function updateWorkorder(
  id: string,
  updates: Partial<WorkorderCreateData>,
  authHeader?: string
): Promise<WorkorderOutData> {
  if (!authHeader) {
    throw new Error("Authentication required: No auth header provided");
  }

  const url = `${API_BASE_URL}/workorders/${id}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(`Failed to update work order ${id}: ${JSON.stringify(detail)}`);
  }
  return res.json();
}