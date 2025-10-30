import React from 'react';

export const colorMap = {
  Alta: {
    cardheader: 'bg-red-400',
    cardbackground: 'bg-red-300',
    alertnumber: 'bg-red-200',
    bg: 'bg-red-100', 
    border: 'border-2 border-red-400',
    text: 'text-red-900',
    sevtext: 'text-black',
    button: 'bg-red-200 text-red-800 hover:bg-red-300',
  },
  Media: {
    cardheader: 'bg-yellow-400',
    cardbackground: 'bg-yellow-300',
    alertnumber: 'bg-yellow-200',
    bg: 'bg-yellow-100', 
    border: 'border-2 border-yellow-400',
    text: 'text-yellow-900',
    sevtext: 'text-black',
    button: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300',
  },
  Baja: {
    cardheader: 'bg-green-400',
    cardbackground: 'bg-green-300',
    alertnumber: 'bg-green-200',
    bg: 'bg-green-100',
    border: 'border-2 border-green-400',
    text: 'text-green-900',
    sevtext: 'text-black',
    button: 'bg-green-200 text-green-800 hover:bg-green-300',
  },
};

function AlertCard({ severity, severityText, title, timestamp, onShowDetails }) {
  const colors = colorMap[severity] || colorMap.Baja;

  return (
    <div
      className={`p-5 rounded-xl shadow-sm ${colors.bg} ${colors.border}`}
    >
      <p className={`text-sm font-semibold ${colors.text}`}>{severityText}</p>
      
      <h3 className="text-xl font-bold text-gray-900 mt-1">{title}</h3>
            
      <p className="text-gray-500 text-xs mt-3">{timestamp}</p>
      
      {/*Boton alineado a la derecha*/}
      <div className='flex justify-end'>
        <button
          type="button"
          onClick={onShowDetails}
          className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${colors.button}`}
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
}

export default AlertCard;