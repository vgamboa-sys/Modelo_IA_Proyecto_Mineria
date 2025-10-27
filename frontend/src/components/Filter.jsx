import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function FilterButton({
    label,
    options = ['Todas'],
    selected = 'Todas',
    onSelect = () => {},
    }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Cierra el menú al hacer click fuera o al presionar Escape
    useEffect(() => {
    function handleClickOutside(e) {
        if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        }
    }
    function handleKeyDown(e) {
        if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
    };
    }, []);

    return (
    <div className="relative" ref={ref}>
        <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full sm:w-auto items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
        <span>
            {label}: <strong className="ml-2">{selected}</strong>
        </span>
        <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 text-gray-400" />
        </button>

        {open && (
        <ul className="absolute z-20 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg py-1">
            {options.map((opt) => (
            <li key={opt}>
                <button
                onClick={() => {
                    onSelect(opt);
                    setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                    opt === selected ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
                }`}
                >
                {opt}
                </button>
            </li>
            ))}
        </ul>
        )}
    </div>
    );
}