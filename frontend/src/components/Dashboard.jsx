import React, { useState } from 'react';
import Header from './Header';
import AlertCard from './AlertCard';
//import { ChevronDownIcon } from '@heroicons/react/20/solid';
import FilterButton from './Filter';

// Datos de ejemplo para las alertas
const alertData = [
  {
    severity: 'Alta',
    severityText: 'Peligro',
    title: 'Riesgo de Inundación',
    location: 'Planta de Producción A',
    timestamp: '15 de Abril, 2024 - 08:30 AM',
  },
  {
    severity: 'Media',
    severityText: 'Precaución',
    title: 'Alerta de Vientos Fuertes',
    location: 'Almacén B',
    timestamp: '15 de Abril, 2024 - 11:00 AM',
  },
  {
    severity: 'Baja',
    severityText: 'Seguro',
    title: 'Clima Estable',
    location: 'Mina 2',
    timestamp: '14 de Abril, 2024 - 02:15 PM',
  },
  {
    severity: 'Equipo',
    severityText: 'Equipo de Seguridad',
    title: 'Recuerda usar el equipo adecuado',
    //location: 'Planta de Producción C',
    timestamp: 'Actualizado: 15 de Abril, 2024 - 03:00 PM',
  },
];



function Dashboard() {
  const [selectedSeverity, setSelectedSeverity] = useState('Todas');
  const severityOptions = ['Todas', 'Alta', 'Media', 'Baja', 'Equipo'];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y Subtítulo */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Alertas
        </h1>
        <p className="mt-1 text-gray-600">
          Alertas activas y su nivel de criticidad.
        </p> 

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 my-6">
          <FilterButton 
            label="Criticidad" 
            options={severityOptions}
            selected={selectedSeverity}
            onSelect={setSelectedSeverity}
            />
          {/*<FilterButton label="Tipo de Alerta" /> Creo que los filtros severidad y tipo de alerta es lo mismo*/}
          <FilterButton label="Ubicación" />
        </div>

        {/* Grilla de Alertas */}
        {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>*/}
        {/* Grilla de Alertas Filtradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {alertData.filter((alert) => 
          selectedSeverity === 'Todas' || alert.severity === selectedSeverity
          ).map((alert) => (
            <AlertCard
              key={alert.title}
              severity={alert.severity}
              severityText={alert.severityText}
              title={alert.title}
              /*location={alert.location}*/
              timestamp={alert.timestamp}
            />
          ))}
        </div>

        {/* Sección del Mapa o lo que sea*/}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Historico de Alertas</h2>
          <div className="bg-gray-200 rounded-lg h-64 sm:h-96 flex items-center justify-center">
            <p className="text-gray-500 px-4 text-center">
              [Aquí iría el componente del historico de eventos o alertas por usuario]
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;