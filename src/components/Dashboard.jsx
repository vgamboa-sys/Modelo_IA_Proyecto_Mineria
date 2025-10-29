import React, { useState } from "react";
import Header from "./Header";
import AlertCard, { colorMap } from "./AlertCard";
import FilterButton from "./Filter";
import AlertModal from "./AlertModal";
import SismosWidget from "./SismosWidget";

/* Datos de ejemplo para las alertas (luego se tomaran de la/s API) */
const alertData = [
  {
    severity: "Alta",
    severityText: "Peligro",
    title: "Riesgo de Inundación",
    location: "Planta de Producción A",
    timestamp: "15 de Abril, 2024 - 08:30 AM",
  },
  {
    severity: "Alta",
    severityText: "Peligro",
    title: "Riesgo de Derrumbe",
    location: "Planta de Producción F",
    timestamp: "15 de Octubre, 2024 - 00:30 AM",
  },
  {
    severity: "Media",
    severityText: "Precaución",
    title: "Alerta de Vientos Fuertes",
    location: "Almacén B",
    timestamp: "15 de Abril, 2024 - 11:00 AM",
  },
  {
    severity: "Baja",
    severityText: "Seguro",
    title: "Clima Estable",
    location: "Mina 2",
    timestamp: "14 de Abril, 2024 - 02:15 PM",
  },
];

function Dashboard() {
  const [selectedSeverity, setSelectedSeverity] = useState("Todas");
  const severityOptions = ["Todas", "Alta", "Media", "Baja"];
  const [selectedAlert, setSelectedAlert] = useState(null);

  const getBadgeClasses = (sev) => {
    const c = colorMap[sev] || { bg: "bg-gray-100", text: "text-gray-800" };
    return `${c.bg} ${c.text}`;
  };

  // Filtrado para las tarjetas agrupadas
  const filteredAlerts = alertData.filter(
    (alert) =>
      selectedSeverity === "Todas" || alert.severity === selectedSeverity
  );

  const severityOrder = ["Alta", "Media", "Baja"];
  const groupedAlerts = severityOrder.reduce((acc, sev) => {
    acc[sev] = filteredAlerts.filter((a) => a.severity === sev);
    return acc;
  }, {});

  // Indica si hay alertas en el sistema
  const hasSystemAlerts = alertData.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Alertas</h1>
        <p className="mt-1 text-gray-600">Alertas activas y su nivel de criticidad.</p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="lg:col-span-3">
            {/* Filtros por criticidad*/}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <FilterButton
                label="Criticidad"
                options={severityOptions}
                selected={selectedSeverity}
                onSelect={setSelectedSeverity}
              />
            </div>

            {/* Si no hay alertas en el sistema, sólo mostrar mensaje */}
            {!hasSystemAlerts ? (
              <div className="mt-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
                  No existen alertas en el sistema.
                </div>
              </div>
            ) : (


        <>
        {/* Grilla de Alertas Filtradas primera versión */}
        {/*  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {alertData.filter((alert) => 
          selectedSeverity === 'Todas' || alert.severity === selectedSeverity
          ).map((alert) => (
            <AlertCard
              key={alert.title}
              severity={alert.severity}
              severityText={alert.severityText}
              title={alert.title}
              /*location={alert.location}* /*}
              timestamp={alert.timestamp}
            />
          ))}
        </div>

              
              
              {/*Grilla de Alertas: Mostrar tarjetas agrupadas por severidad (uno debajo de otro)*/}
              <div className="space-y-4 mt-6">
                {severityOrder.map((sev) => {
                  const items = groupedAlerts[sev] || [];
                  if (items.length === 0) return null;
                  return (
                    <div
                      key={sev}
                      className={`rounded-lg border border-gray-200 overflow-hidden  
                        ${colorMap[sev]?.cardbackground || "bg-gray-100"}
                        `}
                    >
                      <div
                        className={`px-4 py-3 flex items-center justify-between ${
                          colorMap[sev]?.cardheader || "bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xl font-semibold ${
                              colorMap[sev]?.text || "text-gray-800"
                            }`}
                          >
                            {sev}
                          </span>
                          <h3 className={`text-sm font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded-md
                          ${colorMap[sev]?.alertnumber || "bg-gray-100"}
                          `}>
                            {items.length} alerta{items.length > 1 ? "s" : ""}
                          </h3>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-80 overflow-auto">
                        {items.map((alert) => (
                          <AlertCard
                            key={alert.title}
                            severity={alert.severity}
                            severityText={alert.severityText}
                            title={alert.title}
                            timestamp={alert.timestamp}
                          />
                        ))}
                        
                      </div>
                    </div>
                  );
                })}
              </div>
              </>
            )}
          </div>

          {/* Widget lateral Sismos */}
          <div className="lg:col-span-1">
            <SismosWidget />
          </div>

          {/* Tabla reporte de alertas */}
            <div className="lg:col-span-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reporte de Alertas</h2>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-500">
                          <tr className="text-white text-left text-xs font-medium uppercase tracking-wider">
                            <th scope="col" className="px-4 py-3">Criticidad</th>
                            <th scope="col" className="px-4 py-3">Título</th>
                            <th scope="col" className="px-4 py-3">Fecha y Hora</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {alertData.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="px-4 py-4 text-sm text-center text-gray-500">
                                No hay alertas para mostrar
                              </td>
                            </tr>
                          ) : (
                            alertData.map((alert) => (
                              <tr key={alert.title} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                  <span
                                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(
                                      alert.severity
                                    )}`}
                                  >
                                    {alert.severityText}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">{alert.title}</td>
                                <td className="px-4 py-4 text-sm text-gray-500">{alert.timestamp}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </main>

      <AlertModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
    </div>
  );
}

export default Dashboard;
