import React, { useEffect, useState } from 'react';
import { BoltIcon } from '@heroicons/react/24/outline'; // Puedes usar cualquier icono de Heroicons que prefieras

function SismosWidget() {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSismos = async () => {
      try {
        const response = await fetch('https://dorsolumbar-elvera-conterminously.ngrok-free.dev/datos/api/alertas/sismos', {
          // --- ¡Esta es la línea clave para Ngrok! ---
          headers: {
            'ngrok-skip-browser-warning': 'true' 
          }
          // ------------------------------------------
        });
        
        // Verifica si la respuesta HTTP fue exitosa
        if (!response.ok) {
          // Si no fue exitosa, lanza un error con el estado HTTP
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Asumiendo que el JSON tiene una propiedad 'sismos' que es un array
        setSismos(data.sismos || []); 

      } catch (e) {
        // Captura cualquier error durante el fetch o el procesamiento del JSON
        console.error("Error al obtener sismos:", e);
        // Establece un mensaje de error amigable para el usuario
        setError("No se pudieron cargar los sismos. Verifica tu conexión o intenta más tarde.");
      } finally {
        // Asegura que el estado de carga siempre se desactive
        setLoading(false);
      }
    };

    fetchSismos();

    // Opcional: Establece un intervalo para actualizar los sismos automáticamente
    // const intervalId = setInterval(fetchSismos, 300000); // Cada 5 minutos (300,000 ms)
    // return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente

  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Sismos Recientes</h2>
        <BoltIcon className="h-6 w-6 text-indigo-600" /> {/* Ícono de ejemplo */}
      </div>

      {loading && (
        <p className="text-gray-600 text-center">Cargando sismos...</p>
      )}

      {error && (
        <p className="text-red-500 text-center text-sm">{error}</p>
      )}

      {!loading && !error && sismos.length === 0 && (
        <p className="text-gray-600 text-center text-sm">No se encontraron sismos recientes.</p>
      )}

      {!loading && !error && sismos.length > 0 && (
        <ul className="space-y-3">
          {sismos.map((sismo, index) => (
            <li key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
              {/* Muestra el lugar solo si existe */}
              {sismo.lugar && <p className="text-sm font-medium text-gray-800">{sismo.lugar}</p>}
              
              <p className="text-xs text-gray-600">
                {/* Muestra Magnitud y Profundidad, usando 'N/D' si no están disponibles */}
                <strong>Magnitud:</strong> {sismo.magnitud || 'N/D'} - 
                <strong> Profundidad:</strong> {sismo.profundidad_km || 'N/D'} km
              </p>
              
              {/* Muestra la fecha solo si existe */}
              {sismo.fecha && <p className="text-xs text-gray-500">{sismo.fecha}</p>}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 text-xs text-gray-500 text-right">
        Fuente: <a href="https://www.sismologia.cl/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">sismologia.cl</a> (Datos procesados por IA)
      </div>
    </div>
  );
}

export default SismosWidget;