import React, { useState, useEffect } from 'react';
import { ArrowPathIcon, SignalIcon } from '@heroicons/react/24/solid'; 

function SismosWidget() {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para cargar los datos
    const fetchSismos = async () => {                           //http://44.206.67.3:8000/datos/api/alertas/sismos nueva api de sismos    //https://api.gael.cloud/general/public/sismos api vieja
      try {
        setLoading(true);
        //Nuevo
        const API_BASE  = import.meta.env.VITE_API_URL || '';
        const endpoint = '/datos/api/alertas/sismos'
        const fullUrl = API_BASE + endpoint;

        const response = await fetch(fullUrl);

        //const response = await fetch('/datos/api/alertas/sismos');
        if (!response.ok) {
          throw new Error('No se pudo obtener la información');
        }
        const rawData = await response.json();
        //Acceder al arreglo sismos
        const sismosArray = rawData.sismos;

        if(!Array.isArray(sismosArray)){
          throw new Error("No hay arreglo de sismos")
        }

        const formattedData = sismosArray.map(item => ({
          Magnitud: item.magnitud.toFixed(1),
          RefGeografica: item.lugar,
          Fecha: item.fecha,
          Profundidad: item.profundidad_km,
        }));

        // Tomamos solo los 3 más recientes o menos si hay menos disponibles, o lo que se necesite
        setSismos(formattedData.slice(0,3));
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
    <div className="mt-3">
      <div className="flex flex-col items-center justify-center sm:items-start sm:justify-start mb-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center">
          <SignalIcon className="h-6 w-6 text-blue-600 mr-2" />
          Sismos Recientes (CSN)
        </h2>
      </div>
      
      <div className="flex items:start text-sm text-gray-700 mb-4">
        <div>
          <div><span className='font-bold'>CSN:</span> Centro Sismológico Nacional</div>
          <a className='font-bold'>Escala de Ritcher</a>
        </div>
        {/*
        <div className="ml-8 shrink-0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-full text-xs transition duration-150 ease-in-out">
            Ver Leyenda 
          </button>
        </div>*/}

      </div>
      <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-hidden">
        {content}
        {/*Leyenda */}
        {/*<div className="justify-end items-end shrink-0 text-xs mb-4 space-y-1">
          <div className="font-bold md:hidden">
            <button className="border-2 border-amber-200  bg-blue-400 text-white">Leyenda</button></div>
            <div className="">
              <div/>N: Norte
              <div/>S: Sur
              <div/>E: Este (East)
              <div/>W: Oeste(West)
              <div/>NE: Noreste
              <div/>SE: Sureste
              <div/>NO: Noroeste
              <div/>SO: Suroeste
              <div/>KM: Kilómetros
              <div/>Prof: Profundidad
            </div>

        </div>*/}
      </div>
    </div>
  );
}

export default SismosWidget;