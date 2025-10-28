import React, { useState } from "react";
import Header from "./Header";
import AlertCard, { colorMap } from "./AlertCard";
import FilterButton from "./Filter";
import AlertModal from "./AlertModal";
import SismosWidget from "./SismosWidget";

/* Datos de ejemplo para las alertas que despues se cambiaran por la api*/
const alertData = [
  {
    severity: "Alta",
    severityText: "Peligro",
    title: "Riesgo de Inundación",
    location: "Planta de Producción A",
    timestamp: "15 de Abril, 2024 - 08:30 AM",
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
  {
    severity: "Equipo",
    severityText: "Equipo de Seguridad",
    title: "Recuerda usar el equipo adecuado",
    location: "Planta de Producción C",
    timestamp: "15 de Abril, 2024 - 03:00 PM",
  },
];

function Dashboard() {
  const [selectedSeverity, setSelectedSeverity] = useState("Todas");
  const severityOptions = ["Todas", "Alta", "Media", "Baja", "Equipo"];
  const [selectedAlert, setSelectedAlert] = useState(null);

  const getBadgeClasses = (sev) => {
    const c = colorMap[sev] || { bg: "bg-gray-100", text: "text-gray-800" };
    return `${c.bg} ${c.text}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Alertas
        </h1>
        <p className="mt-1 text-gray-600">
          Alertas activas y su nivel de criticidad.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="lg:col-span-3">
            {/* Filtro para las alertas */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <FilterButton
                label="Criticidad"
                options={severityOptions}
                selected={selectedSeverity}
                onSelect={setSelectedSeverity}
              />
            </div>

            {/* Tarjetas de alertas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {alertData
                .filter(
                  (alert) =>
                    selectedSeverity === "Todas" ||
                    alert.severity === selectedSeverity
                )
                .map((alert) => (
                  <AlertCard
                    key={alert.title}
                    severity={alert.severity}
                    severityText={alert.severityText}
                    title={alert.title}
                    timestamp={alert.timestamp}
                    onShowDetails={() => setSelectedAlert(alert)}
                  />
                ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <SismosWidget />
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Reporte de Alertas
              </h2>

              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-500">
                        <tr className="text-white text-left text-xs font-medium uppercase tracking-wider">
                          <th scope="col" className="px-4 py-3">
                            Criticidad
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Título
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Fecha y Hora
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {alertData.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-4 text-sm text-center text-gray-500"
                            >
                              No hay alertas para mostrar
                            </td>
                          </tr>
                        ) : (
                          alertData.map((alert) => (
                            <tr key={alert.title} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`inline-flex items-center px-8 py-0.5 rounded-es-xs text-xs font-medium ${getBadgeClasses(
                                    alert.severity
                                  )}`}
                                >
                                  {alert.severityText}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                {alert.title}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {alert.timestamp}
                              </td>
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

      <AlertModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
}

export default Dashboard;
