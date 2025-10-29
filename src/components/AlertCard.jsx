import React from 'react';


export const colorMap = {
  Alta: {
    cardheader: 'bg-red-400',
    cardbackground: 'bg-red-200',
    alertnumber: 'bg-red-200',
    alertbox: 'bg-red-100',


    border: 'border-2 border-red-300',
    text: 'text-red-900',
    button: 'bg-red-200 text-red-800 hover:bg-red-300',
  },
  Media: {
    cardheader: 'bg-yellow-400',
    cardbackground: 'bg-yellow-200',
    alertnumber: 'bg-yellow-200',
    alertbox: 'bg-yellow-100',
    

    border: 'border-2 border-yellow-500',
    text: 'text-yellow-900',
    button: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300',
  },
  Baja: {
    cardheader: 'bg-green-400',
    cardbackground: 'bg-green-200',
    alertnumber: 'bg-green-200',
    alertbox: 'bg-green-100',


    border: 'border-2 border-green-500',
    text: 'text-green-900',
    button: 'bg-green-200 text-green-800 hover:bg-green-300',
  },
  //Equipo: {
    //bg: 'bg-blue-100',
    //border: 'border-blue-200',
    //text: 'text-blue-700',
    //button: 'bg-blue-200 text-blue-800 hover:bg-blue-300',
  //},
};

function AlertCard({ severity, severityText, title, location, timestamp, onShowDetails }) {
  const colors = colorMap[severity] || colorMap.Normal; 

  return (
    <div
      className={`p-5 rounded-xl shadow-sm border ${colors.alertbox} ${colors.border}`}
    >
      <p className={`text-sm font-semibold ${colors.text}`}>{severityText}</p>
      
      <h3 className="text-xl font-bold text-gray-900 mt-1">{title}</h3>
      
      {/*<p className="text-gray-600 text-sm mt-1">{location}</p>*/}
      
      <p className="text-gray-500 text-xs mt-3">{timestamp}</p>
      
      <button
        type="button"
        onClick={onShowDetails} 
        className={`mt-4 w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${colors.button}`}
      >
        Ver Detalles
      </button>
    </div>
  );
}

export default AlertCard;