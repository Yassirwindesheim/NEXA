"use client";
import React, { createContext, useContext, useState } from "react";
import { CheckCircle, Clock, Wrench } from "lucide-react";

export type Employee = { id: number; name: string; role: string };
export type Workorder = {
  id: string;
  vehicle: string;
  customer: string;
  phone?: string;
  received?: string;
  due?: string;
  complaint?: string;
  status?: string;
};
export type Task = {
  id: number | string;
  workorderId: string;
  name: string;
  assignedId: number;
  status: string;
  time?: string;
};

type AppContextType = {
  employees: Employee[];
  workorders: Workorder[];
  tasks: Task[];
  addEmployee: (e: Omit<Employee, "id">) => void;
  addWorkorder: (w: Workorder) => void;
  addTask: (t: Omit<Task, "id">) => void;
  updateTaskStatus: (taskId: number | string, status: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "Piet", role: "Monteur" },
    { id: 2, name: "Ali", role: "Monteur" },
    { id: 3, name: "Balie", role: "Balie" },
  ]);

  const [workorders, setWorkorders] = useState<Workorder[]>([
    {
      id: "2025-014",
      vehicle: "Volkswagen Golf 2018",
      customer: "Jan de Vries",
      phone: "0612345678",
      received: "01-10-2025",
      due: "02-10-2025",
      complaint: "Remmen piepen bij het remmen",
      status: "In behandeling",
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, workorderId: "2025-014", name: "Inspectie remsysteem", assignedId: 1, status: "Afgerond", time: "30 min" },
    { id: 2, workorderId: "2025-014", name: "Remblokken controleren", assignedId: 2, status: "Bezig", time: "20 min" },
    { id: 3, workorderId: "2025-014", name: "Nieuwe remblokken monteren", assignedId: 1, status: "To do", time: "-" },
  ]);

  const addEmployee = (e: Omit<Employee, "id">) => setEmployees(p => [...p, { ...e, id: Date.now() }]);
  const addWorkorder = (w: Workorder) => setWorkorders(p => [w, ...p]);
  const addTask = (t: Omit<Task, "id">) => setTasks(p => [{ ...t, id: Date.now() }, ...p]);
  const updateTaskStatus = (id: number | string, status: string) =>
    setTasks(p => p.map(t => (t.id === id ? { ...t, status } : t)));

  return (
    <AppContext.Provider value={{ employees, workorders, tasks, addEmployee, addWorkorder, addTask, updateTaskStatus }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

/* Extra: helper voor status-iconen */
export const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === "Afgerond") return <CheckCircle className="w-4 h-4 text-green-600" />;
  if (status === "Bezig") return <Clock className="w-4 h-4 text-yellow-500" />;
  return <Wrench className="w-4 h-4 text-slate-400" />;
};
