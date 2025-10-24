import React from 'react';
import Header from './Header';
import AlertCard from './AlertCard';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

// Datos de ejemplo para las alertas
const alertData = [
  {
    severity: 'Alta',
    severityText: 'Alta Severidad',
    title: 'Riesgo de Inundación',
    location: 'Planta de Producción A',
    timestamp: '15 de Abril, 2024 - 08:30 AM',
  },
  {
    severity: 'Media',
    severityText: 'Severidad Media',
    title: 'Alerta de Vientos Fuertes',
    location: 'Almacén B',
    timestamp: '15 de Abril, 2024 - 11:00 AM',
  },
  {
    severity: 'Baja',
    severityText: 'Baja Severidad',
    title: 'Ola de Calor',
    location: 'Oficinas Centrales',
    timestamp: '14 de Abril, 2024 - 02:15 PM',
  },
  {
    severity: 'Normal',
    severityText: 'Situación Normal',
    title: 'Sin Alertas Activas',
    location: 'Centro de Datos',
    timestamp: 'Actualizado: 15 de Abril, 2024 - 03:00 PM',
  },
];

// Componente de filtro reutilizable
function FilterButton({ label }) {
  return (
    <button
      className="flex w-full sm:w-auto items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
    >
      {label}
      <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 text-gray-400" />
    </button>
  );
}


function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y Subtítulo */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard de Alertas Climáticas
        </h1>
        <p className="mt-1 text-gray-600">
          Alertas activas y su nivel de severidad.
        </p> 

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 my-6">
          <FilterButton label="Severidad" />
          <FilterButton label="Tipo de Alerta" />
          <FilterButton label="Ubicación" />
        </div>

        {/* Grilla de Alertas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {alertData.map((alert) => (
            <AlertCard
              key={alert.title}
              severity={alert.severity}
              severityText={alert.severityText}
              title={alert.title}
              location={alert.location}
              timestamp={alert.timestamp}
            />
          ))}
        </div>

        {/* Sección del Mapa o lo que sea*/}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mapa de Alertas</h2>
          <div className="bg-gray-200 rounded-lg h-64 sm:h-96 flex items-center justify-center">
            <p className="text-gray-500 px-4 text-center">
              [Aquí iría tu componente de mapa]
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;