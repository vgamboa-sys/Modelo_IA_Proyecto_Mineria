import React, { useState, useEffect } from 'react';
import { SignalIcon } from '@heroicons/react/24/solid';

// Define la URL completa de la API (temporalmente con ngrok)

function SismosWidget() {
    // Usaremos 'sismos' para almacenar los datos YA FORMATEADOS
    const [sismos, setSismos] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para dar color a la magnitud (Sacada del useEffect)
    const getMagColor = (magnitud) => {
        const mag = parseFloat(magnitud);
        if (mag >= 5.0) return 'bg-red-500 text-white';
        if (mag >= 4.0) return 'bg-yellow-400 text-gray-900';
        return 'bg-green-500 text-white';
    };

    useEffect(() => {
        const fetchSismos = async () => {
            // 1. Iniciar carga
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('https://dorsolumbar-elvera-conterminously.ngrok-free.dev/datos/api/alertas/sismos', {
                    headers: {
                        // Header de Ngrok (temporal)
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                
                // 2. Manejo de errores HTTP
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
                }

                // 3. Obtener el JSON (SOLO UNA VEZ)
                const rawData = await response.json(); 

                // 4. Acceder y validar el arreglo de sismos
                const sismosArray = rawData.sismos;

                if (!Array.isArray(sismosArray)) {
                    throw new Error("Formato de datos no esperado: no se encontró el arreglo 'sismos'.");
                }

                // 5. Mapear y normalizar el formato (formattedData)
                const formattedData = sismosArray.map(item => ({
                    Magnitud: parseFloat(item.magnitud).toFixed(1), // Aseguramos el formato
                    RefGeografica: item.lugar,
                    Fecha: item.fecha,
                    Profundidad: item.profundidad_km,
                }));
                
                // Tomamos solo los 3 más recientes
                setSismos(formattedData.slice(0, 3)); 
                
            } catch (e) {
                // 6. Captura de cualquier error
                console.error("Error al obtener sismos:", e);
                setError(`Error al cargar datos: ${e.message}`);
                setSismos([]);
            } finally {
                // 7. Finalizar carga
                setLoading(false);
            }
        };

        fetchSismos();

        // Limpieza de código que estaba fuera del fetch y del return
    }, []); // El array vacío asegura que se ejecute solo al montar

    // Contenido a renderizar
    let content;

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
            
            {/* ... (Tu sección de información CSN/Ritcher) ... */}
            <div className="flex items:start text-sm text-gray-700">
                <div>
                    <div><span className='font-bold'>Fuente:</span> Centro Sismológico Nacional (CSN)</div>
                    <div><span className='font-bold'>Escala de Medición:</span> Escala de Richter</div>
                </div>

                {/*
        <div className="ml-8 shrink-0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-full text-xs transition duration-150 ease-in-out">
            Ver Leyenda 
          </button>
        </div>*/}

            </div>

            <div className="flex bg-white rounded-xl overflow-hidden overflow-x-hidden">
                {content} {/* Renderiza el contenido dinámico (carga, error, lista) */}
            </div>
            
        </div>
    );
}

export default SismosWidget;