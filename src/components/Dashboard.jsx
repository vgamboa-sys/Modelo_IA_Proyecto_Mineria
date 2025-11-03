import React, { useMemo, useState, useEffect } from "react";
import Header from "./Header";
import AlertCard, { colorMap } from "./AlertCard"; // Asegúrate de que colorMap se exporta desde AlertCard
import FilterButton from "./Filter"; // Asumiendo que tienes este componente
import AlertModal from "./AlertModal"; // Tu nuevo modal de alertas
import SismosWidget from "./SismosWidget"; // Tu widget de sismos

import {
  ChevronDownIcon,
  ExclamationTriangleIcon, // Icono para Alta
  ShieldExclamationIcon, // Icono para Media
  ShieldCheckIcon, // Icono para Baja
} from "@heroicons/react/24/solid";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender, // ¡Importante para renderizar encabezados y celdas!
} from "@tanstack/react-table";

// Configuración para iconos y colores de severidad en el acordeón
const severityConfig = {
  Alta: {
    icon: ExclamationTriangleIcon,
    color: colorMap.Alta?.sevtext || "text-red-700",
  },
  Media: {
    icon: ShieldExclamationIcon,
    color: colorMap.Media?.sevtext || "text-yellow-700",
  },
  Baja: {
    icon: ShieldCheckIcon,
    color: colorMap.Baja?.sevtext || "text-green-700",
  },
};

function Dashboard() {
  const [selectedTableSev, setSelectedTableSev] = useState("Todas");
  const severityOptions = ["Todas", "Alta", "Media", "Baja"];
  const [openSection, setOpenSection] = useState(null); // Para el acordeón
  const [selectedAlert, setSelectedAlert] = useState(null); // Para el modal de detalles

  const [alertData, setAlertData] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [errorAlerts, setErrorAlerts] = useState(null);

  // --- EFECTO PARA CARGAR ALERTAS DE LA API ---
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoadingAlerts(true);
        setErrorAlerts(null); // Limpiar errores anteriores

        const response = await fetch(
          "https://dorsolumbar-elvera-conterminously.ngrok-free.dev/datos/alertas",
          {
            headers: {
              "ngrok-skip-browser-warning": "true", // Para evitar la advertencia de ngrok
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Mapea los datos de la API al formato que usa tu frontend
        const mappedAlerts = (data || []).map((alert) => ({
          id: alert.id,
          severity: alert.tipo_severidad, // 'tipo_severidad' de la API -> 'severity' del frontend
          severityText: `Severidad ${alert.tipo_severidad}`, // Texto para la tarjeta
          title: alert.titulo, // 'titulo' de la API -> 'title' del frontend
          timestamp: new Date(alert.fecha).toLocaleString("es-CL"), // 'fecha' de la API -> 'timestamp' del frontend, formateado
          description: alert.descripcion, // 'descripcion' de la API -> 'description' del frontend
          protocolo: alert.protocolo, // 'protocolo' de la API -> 'protocolo' del frontend
        }));

        setAlertData(mappedAlerts); // Guarda los datos mapeados
        console.log("Alertas cargadas y mapeadas:", mappedAlerts);
      } catch (e) {
        console.error("Error al obtener alertas:", e);
        setErrorAlerts("No se pudieron cargar las alertas.");
      } finally {
        setLoadingAlerts(false);
      }
    };

    fetchAlerts();
  }, []); // El array vacío asegura que se ejecuta solo una vez al montar el componente

  // --- FILTRADO DE DATOS PARA LA TABLA ---
  const dataFiltrada = useMemo(() => {
    if (selectedTableSev === "Todas") return alertData;
    return alertData.filter((alert) => alert.severity === selectedTableSev);
  }, [selectedTableSev, alertData]);

  // --- DEFINICIÓN DE COLUMNAS DE LA TABLA ---
  const columnas = useMemo(
    () => [
      {
        header: "Tipo de Criticidad", // Encabezado visible
        accessorKey: "severity", // Propiedad de los datos a mostrar
        cell: ({ row }) => ( // Renderizado personalizado para la celda de severidad
          <span
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(
              row.original.severity
            )}`}
          >
            {row.original.severity}
          </span>
        ),
      },
      { header: "Descripción", accessorKey: "title" }, // Columna simple
      { header: "Fecha y Hora", accessorKey: "timestamp" }, // Columna simple
    ],
    []
  );

  // --- HOOK DE REACT-TABLE ---
  const tabla = useReactTable({
    data: dataFiltrada,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8, // Número de filas por página
        pageIndex: 0, // Página inicial
      },
    },
    autoResetPageIndex: true, // Resetear la página a la primera cuando cambian los datos (ej. al filtrar)
  });

  // --- FUNCIÓN PARA OBTENER CLASES DE BADGE SEGÚN SEVERIDAD ---
  const getBadgeClasses = (sev) => {
    const c = colorMap[sev] || { bg: "bg-gray-100", text: "text-gray-800" };
    return `${c.bg} ${c.text}`;
  };

  // --- LÓGICA PARA AGRUPAR ALERTAS POR SEVERIDAD PARA EL ACORDEÓN ---
  const severityOrder = ["Alta", "Media", "Baja"]; // Orden específico

  const groupedAlerts = severityOrder.reduce((acc, sev) => {
    acc[sev] = alertData.filter((a) => a.severity === sev);
    return acc;
  }, {});

  const hasSystemAlerts = alertData.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y Localización */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="order-1 sm:order-0">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              Alertas
            </h1>
            <p className="md:mt-3 mt-1 text-gray-600">
              Alertas activas y su nivel de criticidad.
            </p>
          </div>
          <div className="flex flex-col bg-gray-300 rounded-xl shadow-sm p-3 mb-4 md:mb-0 w-full max-w-5/6 md:max-w-1/4 mx-auto md:mx-0">
            <div className="flex items-center justify-center mb-0">
              <img
                src="/location.png"
                className="h-7 w-7 text-gray-500 mr-2"
                alt="Ícono de ubicación"
              />
              <span className="font-bold text-lg mb-1">Mina Collahuasi</span>
            </div>
            <div className="flex flex-col text-sm text-center">
              <div>Comuna de Pica, Región de Tarapacá, Chile</div>
              <div className="font-semibold text-green-700 mt-1">Operativa</div>
            </div>
          </div>
        </div>

        {/* Sección Grilla de alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loadingAlerts ? (
              <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
                Cargando alertas...
              </div>
            ) : errorAlerts ? (
              <div className="mt-6 bg-red-100 p-6 rounded-xl shadow-sm border border-red-300 text-center text-red-700">
                {errorAlerts}
              </div>
            ) : !hasSystemAlerts ? (
              <div className="mt-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
                  No existen alertas en el sistema.
                </div>
              </div>
            ) : (
              // Tu lógica de acordeón existente
              <div className="space-y-4 mt-4">
                {severityOrder.map((sev) => {
                  const items = groupedAlerts[sev] || [];
                  if (items.length === 0) return null;

                  const isOpen = openSection === sev;
                  const IconComponent =
                    severityConfig[sev]?.icon || ExclamationTriangleIcon;
                  const iconColor =
                    severityConfig[sev]?.color || "text-gray-700";
                  const colors = colorMap[sev] || {};

                  return (
                    <div
                      key={sev}
                      className={`rounded-xl shadow-sm border border-gray-200 overflow-hidden 
                        ${colors.cardbackground || "bg-white"}
                      `}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenSection(isOpen ? null : sev)}
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-black/5
                          ${colors.cardheader || ""}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-6 w-6 ${iconColor}`} />
                          <span
                            className={`text-xl font-semibold ${iconColor}`}
                          >
                            {sev}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${colors.text} ${colors.alertnumber}`}
                          >
                            {items.length}{" "}
                            {items.length > 1 ? "alertas" : "alerta"}
                          </span>
                          <ChevronDownIcon
                            className={`h-6 w-6 text-gray-500 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? "block" : "hidden"
                        }`}
                      >
                        <div className="p-4 border-t border-gray-200 max-h-96 overflow-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((alert, index) => (
                              <AlertCard
                                key={`${alert.title}-${index}`}
                                severity={alert.severity}
                                severityText={alert.severityText}
                                title={alert.title}
                                timestamp={alert.timestamp}
                                onShowDetails={() => setSelectedAlert(alert)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Widget de Sismos (No cambia) */}
          <div className="lg:col-span-1">
            <SismosWidget />
          </div>

          {/* Tabla Reporte de Alertas (Corregida) */}
          <div className="lg:col-span-full flex justify-center">
            <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reporte de Alertas
                </h2>
                <FilterButton
                  options={severityOptions}
                  selected={selectedTableSev}
                  onSelect={setSelectedTableSev}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-500">
                    {tabla.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="text-white text-center text-xs font-medium uppercase tracking-wider"
                      >
                        {headerGroup.headers.map((header) => (
                          <th key={header.id} scope="col" className="px-4 py-3">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tabla.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            colSpan="1"
                            className="px-4 py-4 text-sm text-center text-gray-500"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Controles de paginación */}
              <div className="flex justify-center gap-1 sm:space-x-2 p-4 border-t border-gray-200">
                {/* Botón de inicio */}
                <button
                  onClick={() => tabla.setPageIndex(0)}
                  disabled={!tabla.getCanPreviousPage()}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                >
                  {"<<"}
                </button>
                {/* Botón Anterior */}
                <button
                  onClick={() => tabla.previousPage()}
                  disabled={!tabla.getCanPreviousPage()}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                >
                  <span className="hidden sm:inline">Anterior</span>
                  <span className="inline sm:hidden">{"<"}</span>
                </button>
                {/* Número de Páginas (Centrado entre los botones en móvil) */}
                <span className="flex items-center text-sm px-2 sm:mr-4">
                  Página {tabla.getState().pagination.pageIndex + 1} de{" "}
                  {tabla.getPageCount()}
                </span>
                {/* Botón Siguiente */}
                <button
                  onClick={() => tabla.nextPage()}
                  disabled={!tabla.getCanNextPage()}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <span className="inline sm:hidden">{">"}</span>
                </button>
                {/* Botón de fin */}
                <button
                  onClick={() => tabla.setPageIndex(tabla.getPageCount() - 1)}
                  disabled={!tabla.getCanNextPage()}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                >
                  {">>"}
                </button>
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