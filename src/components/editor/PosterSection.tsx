'use client';

import { useState } from 'react';
import { Pin } from 'lucide-react';

interface PosterSectionProps {
  poster_url: string | null;
}

export default function PosterSection({ poster_url }: PosterSectionProps) {
  const [isSticky, setIsSticky] = useState(false);

  if (!poster_url) return null;

  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${
        isSticky 
          ? 'sticky top-0 z-[60] bg-transparent backdrop-blur-sm py-2' 
          : 'p-8 pb-4'
      }`}
    >
      <div className={`mx-auto transition-all duration-300 ${isSticky ? 'max-w-56 md:max-w-60' : 'max-w-96'} relative`}>
        {!isSticky && (
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center mb-2">
            Cartel del Torneo
          </label>
        )}
        
        <div className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group`}>
          <img
            src={poster_url}
            alt="Cartel del torneo"
            className="object-cover w-full h-full"
          />
          
          <a
            href={poster_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-[10px] backdrop-blur-[2px]"
          >
            VER COMPLETO
          </a>
        </div>

        {/* Botón para Stickear - Fuera del contenedor de imagen para que no se oculte */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSticky(!isSticky);
          }}
          className={`absolute -top-1 -right-1 p-2.5 rounded-full transition-all duration-300 z-[70] border-2 ${
            isSticky 
              ? 'bg-blue-600 text-white shadow-xl scale-110 border-blue-400' 
              : 'bg-white text-gray-400 hover:text-blue-500 shadow-md border-gray-100'
          }`}
          title={isSticky ? "Desprender imagen" : "Fijar imagen arriba"}
        >
          <Pin size={18} className={isSticky ? 'rotate-45' : ''} fill={isSticky ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
