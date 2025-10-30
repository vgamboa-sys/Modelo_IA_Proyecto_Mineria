import React, { useState, useEffect } from 'react';
import { SignalIcon } from '@heroicons/react/24/solid'; 

function SismosWidget() {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para cargar los datos
    const fetchSismos = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.gael.cloud/general/public/sismos');
        if (!response.ok) {
          throw new Error('No se pudo obtener la información');
        }
        const data = await response.json();
        // Tomamos solo los 5 más recientes o menos si hay menos disponibles, o lo que se necesite
        setSismos(data.slice(0, 3));
        setError(null);
      } catch (err) {
        setError(err.message);
        setSismos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSismos();
  }, []); // 

  //Dar color a la magnitud
  const getMagColor = (magnitud) => {
    const mag = parseFloat(magnitud);
    if (mag >= 5.0) return 'bg-red-500 text-white';
    if (mag >= 4.0) return 'bg-yellow-400 text-gray-900';
    return 'bg-green-500 text-white';
  };

  // Contenido a renderizar
  let content;

  if (loading) {
    content = <p className="text-gray-500 text-center py-4">Cargando sismos...</p>;
  } else if (error) {
    content = <p className="text-red-600 text-center py-4">{error}</p>;
  } else if (sismos.length === 0) {
    content = <p className="text-gray-500 text-center py-4">No hay sismos recientes.</p>;
  } else {
    content = (
      <ul className="divide-y divide-gray-200">
        {sismos.map((sismo, index) => (
          <li key={index} className="flex items-center p-3 space-x-3">
            <div
              className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${getMagColor(
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
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <SignalIcon className="h-6 w-6 text-blue-600 mr-2" />
        Sismos Recientes - Escala Richter (CSN)
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {content}
      </div>
    </div>
  );
}

export default SismosWidget;