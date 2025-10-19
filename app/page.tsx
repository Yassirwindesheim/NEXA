

import Dashboard from "../components/Dashboard";
// Dit bestand mag GEEN 'async' bevatten en GEEN directe data-fetch (fetchWorkorders) aanroepen.
export default function WorkordersPage() {
    return (
        <div className="workorders-container p-4">
            {/* Hier kan een titel staan, de rest wordt door de Client Component afgehandeld */}
            <h1 className="text-3xl font-bold mb-6">Werkbonnen Overzicht</h1>
            
            {/* Dit laadt uw client component in, dat de inlogstatus controleert */}
            <Dashboard />
        </div>
    );
}