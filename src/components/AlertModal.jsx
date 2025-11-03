import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { colorMap } from './AlertCard'; 

function AlertModal({ alert, onClose }) {
  if (!alert) return null; 

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const colors = colorMap[alert.severity] || {};

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80"
      onClick={onClose} 
    >
      {/* Panel del Modal */}
      <div
        className={`relative z-50 mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border-4
          ${colors.border || "border-gray-200"}`} 
        onClick={handleContentClick}
      >
        {/* Botón de Cerrar */}
        <button
          type="button"
          className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white transition hover:bg-gray-900"
          onClick={onClose}
        >
          <span className="sr-only">Cerrar</span>
          <XMarkIcon className="h-5 w-5" />
        </button>


        <h3 className="text-2xl font-bold text-gray-900">{alert.title}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {alert.timestamp}
        </p>

        <hr className="my-4" />

        <div className="space-y-3 text-gray-700">
          
          <p>
            <strong>Protocolo de Acción:</strong> 
            {alert.protocolo || 'Protocolo no especificado.'}
          </p>
          
          <p>
            <strong>Descripción:</strong>
            {alert.description || 'No hay descripción disponible.'}
          </p>
        </div>

      </div>
    </div>
  );
}

export default AlertModal;