import React, { useMemo, useState } from "react";
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
//instalar para la paginación
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel, //Necesario para la paginacion
} from '@tanstack/react-table';
//import { SignalIcon } from "@heroicons/react/24/outline";

/* Datos de ejemplo pa cambiar dps con la api siono loko */
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
    severity: "Alta",
    severityText: "Peligro",
    title: "Riesgo de Derrumbe 2",
    location: "Planta de Producción F",
    timestamp: "15 de Octubre, 2024 - 00:30 AM",
  },
    {
    severity: "Alta",
    severityText: "Peligro",
    title: "Riesgo de Derrumbe 3",
    location: "Planta de Producción F",
    timestamp: "15 de Octubre, 2024 - 00:30 AM",
  },
    {
    severity: "Alta",
    severityText: "Peligro",
    title: "Riesgo de Derrumbe 4",
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
    severity: "Media",
    severityText: "Precaución",
    title: "Alerta de Vientos Fuertes 2",
    location: "Almacén B",
    timestamp: "15 de Abril, 2024 - 11:00 AM",
  },
  {
    severity: "Media",
    severityText: "Precaución",
    title: "Alerta de Vientos Fuertes 3",
    location: "Almacén B",
    timestamp: "15 de Abril, 2024 - 11:00 AM",
  },
  {
    severity: "Media",
    severityText: "Precaución",
    title: "Alerta de Vientos Fuertes 4",
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
    severity: "Baja",
    severityText: "Seguro",
    title: "Clima Estable 2",
    location: "Mina 2",
    timestamp: "14 de Abril, 2024 - 02:15 PM",
  },
  {
    severity: "Baja",
    severityText: "Seguro",
    title: "Clima Estable 3",
    location: "Mina 2",
    timestamp: "14 de Abril, 2024 - 02:15 PM",
  },
];

const severityConfig = {
  Alta: { 
    icon: ExclamationTriangleIcon, 
    color: colorMap.Alta?.sevtext || 'text-red-700' 
  },
  Media: { 
    icon: ShieldExclamationIcon, 
    color: colorMap.Media?.sevtext || 'text-yellow-700'
  },
  Baja: { 
    icon: ShieldCheckIcon, 
    color: colorMap.Baja?.sevtext || 'text-green-700'
  },
};


function Dashboard() {
  // Estado para el filtro de criticidad
  const [selectedTableSev, setSelectedTableSev] = useState("Todas");
  // Opciones de criticidad para el filtro
  const severityOptions = ["Todas", "Alta", "Media", "Baja"];
  // Estado para secciones colapsables
  const [openSection, setOpenSection] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  //Filtrado de datos
  const dataFiltrada = useMemo(() => {
    if (selectedTableSev === "Todas") return alertData;
    return alertData.filter(alert => alert.severity === selectedTableSev);
  },[selectedTableSev]);

  //Logica de la tabla
  const columnas = useMemo(() => [
    {
      header: 'Tipo de Criticidad',
      accessorKey: 'severity', //Misma de la clave del objeto de alertData
      cell: ({row}) => (
        <span
        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(
            row.original.severity
          )}`}
        >
          {row.original.severity}
        </span>
      ),
    },
    {header: 'Descripción', accessorKey: 'title' },
    {header: 'Fecha y Hora', accessorKey: 'timestamp' },
  ],[]);
  
  //Inicializacion del hook
  const tabla = useReactTable({
    data: dataFiltrada,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    //Limite de elementos mostrados en la tabla
    initialState: {
      pagination: {
        pageSize: 8,
        pageIndex: 0,
      },
    },
    //Resetear paginacion de la tabla
    autoResetPageIndex: true,
  });

  const getBadgeClasses = (sev) => {
    const c = colorMap[sev] || { bg: "bg-gray-100", text: "text-gray-800" };
    return `${c.bg} ${c.text}`;
  };

  //Filtro para las tarjetas de alerta
  const severityOrder = ["Alta", "Media", "Baja"];

  // Filtrar alertas según el filtro seleccionado
  const groupedAlerts = severityOrder.reduce((acc, sev) => {
    acc[sev] = alertData.filter((a) => a.severity === sev);
    return acc;
  }, {});

  const hasSystemAlerts = alertData.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="order-1 sm:order-0">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Alertas</h1>
            <p className="md:mt-3 mt-1 text-gray-600">Alertas activas y su nivel de criticidad.</p>
          </div>
          
          {/*Info de inicio Localización*/}
          <div class="flex flex-col bg-gray-300 rounded-xl shadow-sm p-3 mb-4 md:mb-0 w-full max-w-5/6 md:max-w-1/4 mx-auto md:mx-0 md:mr-15">
            <div class="flex items-center justify-center mb-0">
              <img src="/location.png" class="h-7 w-7 text-gray-500 mr-2" alt="Ícono de ubicación" />
              <span class="font-bold text-lg mb-1">Mina Collahuasi</span>
            </div>
            
            <div class="flex flex-col text-sm text-center"> 
                <div>Comuna de Pica, Región de Tarapacá, Chile</div>
                <div class="font-semibold text-green-700 mt-1">Operativa</div>
            </div>
          </div>
        </div>
        
        {/*Seccion Grilla de alertas*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!hasSystemAlerts ? (
              <div className="mt-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
                  No existen alertas en el sistema.
                </div>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {severityOrder.map((sev) => {
                  const items = groupedAlerts[sev] || [];
                  if (items.length === 0) return null;

                  const isOpen = openSection === sev;
                  const IconComponent = severityConfig[sev]?.icon || ExclamationTriangleIcon;
                  const iconColor = severityConfig[sev]?.color || 'text-gray-700';
                  
                  const colors = colorMap[sev] || {};

                  return (
                    <div
                      key={sev}
                    
                      className={`rounded-xl shadow-sm border border-gray-200 overflow-hidden 
                        ${colors.cardbackground || 'bg-white'}
                      `}
                    >
                      <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : sev)}
                      className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-black/15
                        ${colors.cardheader || ''}
                      `}
                    >
                      {/* --- GRUPO IZQUIERDO: Icono y Título --- */}
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-6 w-6 ${iconColor}`} />
                        <span className={`text-xl font-semibold ${iconColor}`}>
                          {sev}
                        </span>
                        {/* El span del contador que estaba aquí ya no va */}
                      </div>

                      {/* --- GRUPO DERECHO: Contador de alertas y Flecha --- */}
                      <div className="flex items-center gap-3"> {/* Nuevo div para agrupar */}
                        <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${colors.text} ${colors.alertnumber}`}>
                          {items.length} {items.length > 1 ? "alertas" : "alerta"}
                        </span>
                        <ChevronDownIcon
                          className={`h-6 w-6 text-gray-500 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                      
                      {/* --- Contenido Colapsable --- */}
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? 'block' : 'hidden'
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
            
          {/* Widget de Sismos */}  
          <div className="lg:col-span-1">
            <SismosWidget />
          </div>
          
          {/* Tabla Reporte de Alertas + Botón para filtro */}
          <div className="lg:col-span-full flex justify-center">
            <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-start mb-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mr-8 mr-12">Reporte de Alertas</h2>

                {/* Filtro alineado con texto */}
                <FilterButton
                  label="Criticidad"
                  options={severityOptions}
                  selected={selectedTableSev}
                  onSelect={setSelectedTableSev}
                />
              </div>

              <div className="w-full">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border border-gray-200 rounded-lg">

                    {/*Tabla*/}
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-500">
                        {tabla.getHeaderGroups().map(headerGroup =>(
                          <tr key={headerGroup.id} 
                            className="text-white text-center text-xs font-medium uppercase tracking-wider">
                            {headerGroup.headers.map(header=> (
                              <th key={header.id} scope="col" className="px-4 py-3">
                                {/*Renderiza el encabezado*/}
                                {header.isPlaceholder
                                  ? null
                                  : header.column.columnDef.header}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/*Renderizar filas paginadas*/}
                        {tabla.getRowModel().rows.map(row =>(
                          <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                              <td key={cell.id} colSpan="1" className="px-4 py-4 text-sm text-center text-gray-500">
                                {/*Renderiza el contenido de la celda*/}
                                {cell.column.columnDef.cell(cell)
                                  ? cell.column.columnDef.cell(cell)
                                  : cell.getValue() }
                              </td>
                            ))}
                          </tr>
                        ))}
                        </tbody>
                      </table>

                    {/*Controles de paginacion*/}
                    <div className="flex justify-center gap-1 sm:space-x-2 p-4 border-t border-gray-200">
                        
                        {/* Botón de inicio */}
                        <button
                            onClick={() => tabla.setPageIndex(0)}
                            disabled={!tabla.getCanPreviousPage()}
                            className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                        >
                            {'<<'}
                        </button>
                        
                        {/* Botón Anterior */}
                        <button
                            onClick={() => tabla.previousPage()}
                            disabled={!tabla.getCanPreviousPage()}
                            className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                        >
                            {/* Mostrar 'Anterior' en desktop, '<' en móvil */}
                            <span className="hidden sm:inline">Anterior</span>
                            <span className="inline sm:hidden">{'<'}</span>
                        </button>
                        
                        {/* Número de Páginas (Centrado entre los botones en móvil) */}
                        <span className="flex items-center text-sm px-2 sm:mr-4">
                            Página {tabla.getState().pagination.pageIndex + 1} de {tabla.getPageCount()}
                        </span>

                        {/* Botón Siguiente */}
                        <button
                            onClick={() => tabla.nextPage()}
                            disabled={!tabla.getCanNextPage()}
                            className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                        >
                            {/* Mostrar 'Siguiente' en desktop, '>' en móvil */}
                            <span className="hidden sm:inline">Siguiente</span>
                            <span className="inline sm:hidden">{'>'}</span>
                        </button>

                        {/* Botón de fin */}
                        <button
                            onClick={() => tabla.setPageIndex(tabla.getPageCount() - 1)}
                            disabled={!tabla.getCanNextPage()}
                            className="px-2 py-0.5 sm:px-3 sm:py-1 border rounded disabled:opacity-50 text-gray-600 hover:bg-gray-100 text-sm"
                        >
                            {'>>'}
                        </button>
                    </div>

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




