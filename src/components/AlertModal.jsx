import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

function AlertModal({ alert, onClose }) {
  if (!alert) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
      onClick={onClose} 
    >
      <div
        className="relative z-50 mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        onClick={handleContentClick}
      >
        {/* Botón de Cerrar (Esquina) */}
        <button
          type="button"
          className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white transition hover:bg-gray-900"
          onClick={onClose}
        >
          <span className="sr-only">Cerrar</span>
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Contenido del Modal */}
        <h3 className="text-2xl font-bold text-gray-900">{alert.title}</h3>
        <p className="mt-1 text-sm text-gray-600">
          {alert.location} - <span className="text-gray-500">{alert.timestamp}</span>
        </p>

        <hr className="my-4" />

        {/* Aquí va la "información adicional" */}
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Reportado por:</strong> Centro de Control A
          </p>
          <p>
            <strong>Protocolo de Acción:</strong> {alert.severity === 'Alta' ? 'Evacuación Inmediata' : 'Monitoreo y Precaución'}.
          </p>
          <p>
            <strong>Descripción:</strong>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            posuere erat a ante. Pellentesque ultrices, dui eget
            ultricies, felis nisl varius, vitae...
          </p>
        </div>


      </div>
    </div>
  );
}

export default AlertModal;