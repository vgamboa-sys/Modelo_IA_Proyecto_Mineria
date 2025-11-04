import React, { useMemo, useState, useEffect } from "react";
import Header from "./Header";
import AlertCard, { colorMap } from "./AlertCard";
import FilterButton from "./Filter";
import AlertModal from "./AlertModal";
import SismosWidget from "./SismosWidget";
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

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

// Intervalo de refresco en milisegundos (ej. 60000 ms = 1 minuto)
const REFRESH_INTERVAL_MS = 60000;

function Dashboard() {
  // Estado para el filtro de criticidad
  const [selectedTableSev, setSelectedTableSev] = useState("Todas"); // Opciones de criticidad para el filtro
  const severityOptions = ["Todas", "Alta", "Media", "Baja"]; // Estado para secciones colapsables (usando Set para múltiples secciones abiertas)
  const [openSections, setOpenSections] = useState(new Set());
  const [selectedAlert, setSelectedAlert] = useState(null); // Estados para datos de API

  const [recentAlertData, setRecentAlertData] = useState([]);
  const [fullAlertHistory, setFullAlertHistory] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [errorAlerts, setErrorAlerts] = useState(null); // Función para agregar o eliminar una severidad del Set

  const toggleSection = (sev) => {
    setOpenSections((prevOpenSections) => {
      const newSet = new Set(prevOpenSections);
      if (newSet.has(sev)) {
        newSet.delete(sev);
      } else {
        newSet.add(sev);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchAllAlerts = async () => {
      setLoadingAlerts(true);
      setErrorAlerts(null);

      try {
        // --- 1. Cargar ALERTA RECIENTES PARA LAS TARJETAS (Últimas 3H, 3 por categoría) ---
        const severitiesToFetch = ["Alta", "Media", "Baja"];
        const recentAlertPromises = severitiesToFetch.map(async (sev) => {
          const url = `https://dorsolumbar-elvera-conterminously.ngrok-free.dev/datos/alertas/3H?limit=3&severidad=${sev}`;
          const response = await fetch(url, {
            headers: { "ngrok-skip-browser-warning": "true" },
          });
          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status} for recent alerts of severity ${sev}`
            );
          }
          return response.json();
        });

        const allRecentResults = await Promise.all(recentAlertPromises);
        const combinedRecentAlerts = allRecentResults.flat();
        const mappedRecentAlerts = (combinedRecentAlerts || []).map(
          (alert) => ({
            id: alert.id,
            severity: alert.tipo_severidad,
            severityText: `Severidad ${alert.tipo_severidad}`,
            title: alert.titulo,
            timestamp: new Date(alert.fecha).toLocaleString("es-CL"),
            description: alert.descripcion,
            protocolo: alert.protocolo,
          })
        );
        setRecentAlertData(mappedRecentAlerts); // console.log("Alertas recientes cargadas (últimas 3H por severidad):", mappedRecentAlerts); // Descomentar para debug // --- 2. Cargar HISTORIAL COMPLETO PARA LA TABLA ---
        const fullHistoryResponse = await fetch(
          "https://dorsolumbar-elvera-conterminously.ngrok-free.dev/datos/alertas",
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );

        if (!fullHistoryResponse.ok) {
          throw new Error(
            `HTTP error! status: ${fullHistoryResponse.status} for full history`
          );
        }

        const fullHistoryData = await fullHistoryResponse.json();
        const mappedFullHistory = (fullHistoryData || []).map((alert) => ({
          id: alert.id,
          severity: alert.tipo_severidad,
          severityText: `Severidad ${alert.tipo_severidad}`,
          title: alert.titulo,
          timestamp: new Date(alert.fecha).toLocaleString("es-CL"),
          description: alert.descripcion,
          protocolo: alert.protocolo,
        }));
        setFullAlertHistory(mappedFullHistory); // console.log("Historial completo de alertas cargado:", mappedFullHistory);
      } catch (e) {
        console.error("Error al obtener alertas:", e);
        setErrorAlerts(
          `No se pudieron cargar todas las alertas. Detalles: ${e.message}`
        );
      } finally {
        setLoadingAlerts(false);
      }
    };

    fetchAllAlerts();
  }, []); // --- FILTRADO DE DATOS PARA LA TABLA

  const dataFiltradaTabla = useMemo(() => {
    if (selectedTableSev === "Todas") return fullAlertHistory;
    return fullAlertHistory.filter(
      (alert) => alert.severity === selectedTableSev
    );
  }, [selectedTableSev, fullAlertHistory]); // --- DEFINICIÓN DE COLUMNAS DE LA TABLA ---

  const columnas = useMemo(
    () => [
      {
        header: "Tipo de Criticidad",
        accessorKey: "severity",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(
              row.original.severity
            )}`}
          >
            {row.original.severity}
          </span>
        ),
      },
      { header: "Descripción", accessorKey: "title" },
      { header: "Fecha y Hora", accessorKey: "timestamp" },
      {
        header: "Acciones",
        id: "acciones",
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedAlert(row.original)}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Ver Detalles
          </button>
        ),
      },
    ],
    []
  );

  const tabla = useReactTable({
    data: dataFiltradaTabla,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
        pageIndex: 0,
      },
    },
    autoResetPageIndex: true,
  });

  const getBadgeClasses = (sev) => {
    const c = colorMap[sev] || { bg: "bg-gray-100", text: "text-gray-800" };
    return `${c.bg} ${c.text}`;
  };

  const severityOrder = ["Alta", "Media", "Baja"];

  const groupedRecentAlerts = severityOrder.reduce((acc, sev) => {
    acc[sev] = recentAlertData.filter((a) => a.severity === sev);
    return acc;
  }, {});

  const hasRecentAlerts = recentAlertData.length > 0;
  const hasFullHistory = fullAlertHistory.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 relative">
            <Header />     {" "}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
               {" "}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                   {" "}
          <div className="order-1 sm:order-0">
                       {" "}
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                            Alertas            {" "}
            </h1>
                       {" "}
            <p className="md:mt-3 mt-1 text-gray-600">
                            Alertas activas y su nivel de criticidad.          
               {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <div className="flex flex-col bg-gray-300 rounded-xl shadow-sm p-3 mb-4 md:mb-0 w-full max-w-5/6 md:max-w-1/4 mx-auto md:mx-0">
                       {" "}
            <div className="flex items-center justify-center mb-0">
                           {" "}
              <img
                src="/location.png"
                className="h-7 w-7 text-gray-500 mr-2"
                alt="Ícono de ubicación"
              />
                           {" "}
              <span className="font-bold text-lg mb-1">Mina Collahuasi</span>   
                     {" "}
            </div>
                       {" "}
            <div className="flex flex-col text-sm text-center">
                            <div>Comuna de Pica, Región de Tarapacá, Chile</div>
                           {" "}
              <div className="font-semibold text-green-700 mt-1">Operativa</div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Sección Grilla de alertas */}       {" "}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   {" "}
          <div className="lg:col-span-2">
                       {" "}
            {loadingAlerts ? (
              <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
                                Cargando alertas recientes...              {" "}
              </div>
            ) : errorAlerts ? (
              <div className="mt-6 bg-red-100 p-6 rounded-xl shadow-sm border border-red-300 text-center text-red-700">
                                {errorAlerts}             {" "}
              </div>
            ) : !hasRecentAlerts ? (
              <div className="mt-6">
                               {" "}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
                                    No existen alertas recientes en el sistema
                  (últimas 3 horas).                {" "}
                </div>
                             {" "}
              </div>
            ) : (
              // Tu lógica de acordeón existente
              <div className="space-y-4 mt-4">
                               {" "}
                {severityOrder.map((sev) => {
                  const items = groupedRecentAlerts[sev] || [];
                  if (items.length === 0) return null;

                  const isOpen = openSections.has(sev);
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
                                           {" "}
                      <button
                        type="button"
                        onClick={() => toggleSection(sev)}
                        className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-black/20
                          ${colors.cardheader || ""}
                        `}
                      >
                                               {" "}
                        <div className="flex items-center gap-3">
                                                   {" "}
                          <IconComponent className={`h-6 w-6 ${iconColor}`} /> 
                                                 {" "}
                          <span
                            className={`text-xl font-semibold ${iconColor}`}
                          >
                                                        {sev}                   
                                 {" "}
                          </span>
                                                 {" "}
                        </div>
                                               {" "}
                        <div className="flex items-center gap-3">
                                                   {" "}
                          <span
                            className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${colors.text} ${colors.alertnumber}`}
                          >
                                                        {items.length}          
                                             {" "}
                            {items.length > 1 ? "alertas" : "alerta"}           
                                         {" "}
                          </span>
                                                   {" "}
                          <ChevronDownIcon
                            className={`h-6 w-6 text-gray-500 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                                                 {" "}
                        </div>
                                             {" "}
                      </button>
                                           {" "}
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? "block" : "hidden"
                        }`}
                      >
                                               {" "}
                        <div className="p-4 border-t border-gray-200 max-h-96 overflow-auto">
                                                   {" "}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                       {" "}
                            {items.map((alert, index) => (
                              <AlertCard
                                key={`${alert.id}-${index}`}
                                severity={alert.severity}
                                severityText={alert.severityText}
                                title={alert.title}
                                timestamp={alert.timestamp}
                                onShowDetails={() => setSelectedAlert(alert)}
                              />
                            ))}
                                                     {" "}
                          </div>
                                                 {" "}
                        </div>
                                             {" "}
                      </div>
                                         {" "}
                    </div>
                  );
                })}
                             {" "}
              </div>
            )}
                     {" "}
          </div>
                    {/* Widget de Sismos */}         {" "}
          <div className="lg:col-span-1">
                        <SismosWidget />         {" "}
          </div>
                    {/* Tabla Reporte de Alertas  */}         {" "}
          <div className="lg:col-span-full flex justify-center">
                       {" "}
            <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
                           {" "}
              <div className="flex justify-between items-center mb-4">
                               {" "}
                <h2 className="text-xl font-semibold text-gray-900">
                                    Historial de Alertas                {" "}
                </h2>
                               {" "}
                <FilterButton
                  label="Criticidad"
                  options={severityOptions}
                  selected={selectedTableSev}
                  onSelect={setSelectedTableSev}
                />
                             {" "}
              </div>
                           {" "}
              <div className="overflow-x-auto">
                               {" "}
                {loadingAlerts ? (
                  <div className="p-4 text-center text-gray-500">
                                        Cargando historial de alertas...        
                             {" "}
                  </div>
                ) : errorAlerts && !hasFullHistory ? (
                  <div className="p-4 bg-red-100 text-red-700 text-center">
                                        Error al cargar el historial de alertas.
                                     {" "}
                  </div>
                ) : !hasFullHistory ? (
                  <div className="p-4 text-center text-gray-500">
                                        No hay historial completo de alertas
                    disponible.                  {" "}
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                                       {" "}
                    <thead className="bg-gray-500">
                                           {" "}
                      {tabla.getHeaderGroups().map((headerGroup) => (
                        <tr
                          key={headerGroup.id}
                          className="text-white text-center text-xs font-medium uppercase tracking-wider"
                        >
                                                   {" "}
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              scope="col"
                              className="px-4 py-3"
                            >
                                                           {" "}
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                                         {" "}
                            </th>
                          ))}
                                                 {" "}
                        </tr>
                      ))}
                                         {" "}
                    </thead>
                                       {" "}
                    <tbody className="bg-white divide-y divide-gray-200">
                                           {" "}
                      {tabla.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                                                   {" "}
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              colSpan="1"
                              className="px-4 py-4 text-sm text-center text-gray-500"
                            >
                                                           {" "}
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                                                         {" "}
                            </td>
                          ))}
                                                 {" "}
                        </tr>
                      ))}
                                         {" "}
                    </tbody>
                                     {" "}
                  </table>
                )}
                             {" "}
              </div>
                            {/* Controles de paginación */}             {" "}
              {hasFullHistory && (
                <div className="flex justify-center gap-1 sm:space-x-2 p-4 border-t border-gray-200">
                                    {/* Botón de inicio */}                 {" "}
                  <button
                    onClick={() => tabla.setPageIndex(0)}
                    disabled={!tabla.getCanPreviousPage()}
                    className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                  >
                                        {"<<"}                 {" "}
                  </button>
                                    {/* Botón Anterior */}                 {" "}
                  <button
                    onClick={() => tabla.previousPage()}
                    disabled={!tabla.getCanPreviousPage()}
                    className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                  >
                                       {" "}
                    <span className="hidden sm:inline">Anterior</span>         
                              <span className="inline sm:hidden">{"<"}</span>   
                                 {" "}
                  </button>
                                   {" "}
                  {/* Número de Páginas (Centrado entre los botones en móvil) */}
                                   {" "}
                  <span className="flex items-center text-sm px-2 sm:mr-4">
                                        Página{" "}
                    {tabla.getState().pagination.pageIndex + 1} de              
                          {tabla.getPageCount()}                 {" "}
                  </span>
                                    {/* Botón Siguiente */}                 {" "}
                  <button
                    onClick={() => tabla.nextPage()}
                    disabled={!tabla.getCanNextPage()}
                    className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                  >
                                       {" "}
                    <span className="hidden sm:inline">Siguiente</span>         
                              <span className="inline sm:hidden">{">"}</span>   
                                 {" "}
                  </button>
                                    {/* Botón de fin */}                 {" "}
                  <button
                    onClick={() => tabla.setPageIndex(tabla.getPageCount() - 1)}
                    disabled={!tabla.getCanNextPage()}
                    className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                  >
                                        {">>"}                 {" "}
                  </button>
                                 {" "}
                </div>
              )}
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </main>
           {" "}
      <AlertModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
         {" "}
    </div>
  );
}

export default Dashboard;
