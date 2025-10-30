import React from 'react';

function Footer() {
    return (
    <footer className="bg-gray-800 text-gray-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex justify-center items-center">

            <div className="text-center">
            <p className="text-xl">
                &copy; {new Date().getFullYear()} SafeMine AI. Todos los derechos reservados.
            </p>

            <hr className="my-3 border-gray-700" />

            <p className="text-lg">
                Desarrollado por todo el equipo PPJ 14va Generación con mucho cariño ❤
            </p>
            </div>
        </div>
        </div>
    </footer>
    );
    }

export default Footer;
