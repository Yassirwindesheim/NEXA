import EmployeesPage from "../app/employees/page";
import TasksPage from "../app/tasks/page";
import WorkOrdersPage from "../app/workorders/page";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Operational Overview Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Real-time summary of critical workflows and team performance.</p>
      </header>

      {/* Grid Layout for the Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
        {/* Renders app/workorders/page.tsx content */}
        <div className="col-span-1">
          <WorkOrdersPage />
        </div>

        {/* Renders app/tasks/page.tsx content */}
        <div className="col-span-1">
          <TasksPage />
        </div>

        {/* Renders app/employees/page.tsx content */}
        <div className="col-span-1">
          <EmployeesPage />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
