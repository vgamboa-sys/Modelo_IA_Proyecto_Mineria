import React from 'react';

// Objeto para mapear la severidad a las clases de Tailwind
const colorMap = {
  Alta: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    button: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
  Media: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    button: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  },
  Baja: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    button: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  },
  Normal: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    button: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
};

function AlertCard({ severity, severityText, title, location, timestamp }) {
  // Obtener las clases de color correctas, con un fallback 'Normal'
  const colors = colorMap[severity] || colorMap.Normal;

  return (
    <div
      className={`p-5 rounded-xl shadow-sm border ${colors.bg} ${colors.border}`}
    >
      <p className={`text-sm font-semibold ${colors.text}`}>{severityText}</p>
      
      <h3 className="text-xl font-bold text-gray-900 mt-1">{title}</h3>
      
      <p className="text-gray-600 text-sm mt-1">{location}</p>
      
      <p className="text-gray-500 text-xs mt-3">{timestamp}</p>
      
      <button
        type="button"
        className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${colors.button}`}
      >
        Ver Detalles
      </button>
    </div>
  );
}

export default AlertCard;