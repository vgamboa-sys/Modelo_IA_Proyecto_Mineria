import React, { useState, useEffect } from 'react';
import { SignalIcon } from '@heroicons/react/24/solid';

function SismosWidget() {
    // ESTADO PARA LOS DATOS DE SISMOS
    const [sismos, setSismos] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ESTADO CORREGIDO PARA LA LEYENDA
    const [isLegendOpen, setIsLegendOpen] = useState(false);

    // FUNCIÓN CORREGIDA PARA LA LEYENDA
    const toggleLegend = () => {
        setIsLegendOpen(!isLegendOpen);
    };

    // Función para dar color a la magnitud
    const getMagColor = (magnitud) => {
        const mag = parseFloat(magnitud);
        if (mag >= 5.0) return 'bg-red-500 text-white';
        if (mag >= 4.0) return 'bg-yellow-400 text-gray-900';
        return 'bg-green-500 text-white';
    };

    useEffect(() => {
        const fetchSismos = async () => {
            setLoading(true);
            setError(null);
            // ... (Lógica de fetch, mapeo y setSismos es correcta)
            try {
                const response = await fetch('https://dorsolumbar-elvera-conterminously.ngrok-free.dev/datos/api/alertas/sismos', {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
                }

                const rawData = await response.json(); 
                const sismosArray = rawData.sismos;

                if (!Array.isArray(sismosArray)) {
                    throw new Error("Formato de datos no esperado: no se encontró el arreglo 'sismos'.");
                }

                const formattedData = sismosArray.map(item => ({
                    Magnitud: parseFloat(item.magnitud).toFixed(1),
                    RefGeografica: item.lugar,
                    Fecha: item.fecha,
                    Profundidad: item.profundidad_km,
                }));
                
                setSismos(formattedData.slice(0, 3)); 
                
            } catch (e) {
                console.error("Error al obtener sismos:", e);
                setError(`Error al cargar datos.`);
                setSismos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSismos();
    }, []);

    // Contenido a renderizar
    let content;
    // ... (La lógica de renderizado de content es correcta)
    if (loading) {
        content = <p className="text-gray-600 text-center py-4">Cargando sismos...</p>;
    } else if (error) {
        content = <p className="text-red-500 text-center py-4 text-sm">{error}</p>;
    } else if (sismos.length === 0) {
        content = <p className="text-gray-600 text-center py-4 text-sm">No se encontraron sismos recientes.</p>;
    } else {
        content = (
            <ul className="divide-y divide-gray-200">
                {sismos.map((sismo, index) => (
                    <li key={index} className="flex items-center p-3 space-x-3">
                        <div
                            className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${getMagColor(
                                sismo.Magnitud
                            )}`}
                        >
                            {sismo.Magnitud}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {sismo.RefGeografica}
                            </p>
                            <p className="text-xs text-gray-500">
                                {sismo.Fecha} | Prof: {sismo.Profundidad} km
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center">
                    <SignalIcon className="h-6 w-6 text-blue-600 mr-2" />
                    Sismos Recientes
                </h2>
            </div>
            
            {/* Contenedor principal para la información y el botón */}
            <div className="flex justify-between items-start text-sm text-gray-700 mb-2">
                <div>
                    <div><span className='font-bold'>Fuente:</span> Centro Sismológico Nacional (CSN)</div>
                    <div><span className='font-bold'>Escala de Medición:</span> Escala de Richter</div>
                </div>
                
                {/* Botón de Leyenda */}
                <div className="shrink-0">
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-full text-xs transition duration-150 ease-in-out"
                        onClick={toggleLegend}
                    >
                        {isLegendOpen ? 'Ocultar Leyenda' : 'Ver Leyenda'}
                    </button>
                </div>
            </div>

            {/* ✅ Nuevo Contenedor de Leyenda que ocupa todo el ancho y está en el flujo */}
            <div 
                // Usamos la misma lógica condicional, pero sin 'absolute' o 'z-index'
                // Las clases 'w-full' y 'p-3' garantizan el rectángulo
                className={`w-full transition-all duration-300 ${isLegendOpen ? 'block' : 'hidden'}`}
            >
                {/* Contenido de la Leyenda */}
                <div className='p-2 bg-gray-100 rounded-lg shadow-inner border border-gray-200 text-gray-700 text-sm'>
                    <ul className=" ml-4 space-y-0.5 grid grid-cols-2 sm:grid-cols-3">
                        <li><span className='font-bold'>N:</span> Norte | <span className='font-bold'>S:</span> Sur</li>
                        <li><span className='font-bold'>E:</span> Este | <span className='font-bold'>W:</span> Oeste</li>
                        <li><span className='font-bold'>NE:</span> Noreste</li>
                        <li><span className='font-bold'>SE:</span> Sureste</li>
                        <li><span className='font-bold'>NO:</span> Noroeste</li>
                        <li><span className='font-bold'>SO:</span> Suroeste</li>
                        <li><span className='font-bold'>KM:</span> Kilómetros</li>
                        <li><span className='font-bold'>Prof:</span> Profundidad</li>
                    </ul>
                </div>
            </div>

            {/* Este div se correrá hacia abajo cuando la leyenda se despliegue */}
            <div className="flex bg-white rounded-xl overflow-hidden overflow-x-hidden">
                {content}
            </div>
            
        </div>
    );
}

export default SismosWidget;