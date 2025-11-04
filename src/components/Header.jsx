import { useState } from 'react';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Función para determinar si una ruta está activa (Falta ver si la pagina sera de una sola vista o no)
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isActive = (route) => pathname === route;

  return (
    <nav className="bg-slate-600 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Título */}
          <div className="shrink-0 flex items-center">
              
            <a href="/" className="flex items-center">
              <img src="/icon.png" alt="SafeMine Logo" className="h-12 w-11" />
              <span className="ml-2 text-xl font-sans text-white sm:inline">SafeMine AI</span>
            </a>
          </div>
          
          {/* Links de Navegación (Desktop) */}
          {/*<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a
              href="/"
              className={`text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/')
                ?'border-white text-orange-400' 
                : 'border-transparent hover:border-white hover:text-orange-400'
              }`}
            >
              Inicio
            </a>
            {/*<a
              href="/reporte"
              className={`text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/reporte')
                ? 'border-white text-orange-400'
                : 'border-transparent hover:border-white hover:text-orange-400'
              }`}
            >
              Reportes
            </a>
          </div>

          {/* Íconos de la derecha (Usuario + Menú Móvil)
          <div className="flex items-center">
            {/* Ícono de Usuario (Siempre visible) 
            {/*<button
              type="button"
              className="p-1 rounded-full text-white hover:text-orange-400"
            >
              <span className="sr-only">Ver perfil</span>
              <UserCircleIcon className="h-7 w-7" aria-hidden="true" />
            </button>

            {/* Botón de Menú Móvil (Solo en 'sm' y más pequeño) 
            <div className="ml-2 sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 text-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú principal</span>
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel del Menú Móvil 
      <div
        className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1 px-2">
          <a
            href="/"
            className={`text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/')
              ? 'border-white text-orange-400'
              : 'border-transparent hover:border-white hover:text-orange-400'
            }`}
          >
            Inicio
          </a>
          {/*<a
            href="/reporte"
            className={`text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/reporte')
              ? 'border-white text-orange-400'
              : 'border-transparent hover:border-white hover:text-orange-400'
            }`}
          >
            Reportes
          </a>*/}
        </div>
      </div>
    </nav>
  );
  
}

export default Header;