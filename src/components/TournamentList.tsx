'use client';

import { Tournament } from '@/types';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

interface TournamentListProps {
  tournaments: Tournament[];
  selectedId?: string;
  onSelect: (tournament: Tournament) => void;
}

export default function TournamentList({ tournaments, selectedId, onSelect }: TournamentListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 md:mb-12">
      {/* Vista de Tabla (Escritorio) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Torneo</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Ubicación</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fecha</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tournaments.map((t) => (
              <tr 
                key={t.id} 
                className={`cursor-pointer hover:bg-blue-50 transition-colors ${selectedId === t.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                onClick={() => onSelect(t)}
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono uppercase">{t.id}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{t.location}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(t.tournament_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4 text-right">
                    <ChevronRight className="inline-block text-gray-300" size={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de Lista/Cards (Móvil) */}
      <div className="md:hidden divide-y divide-gray-100">
        {tournaments.map((t) => (
          <div 
            key={t.id}
            className={`p-4 active:bg-blue-50 transition-colors flex justify-between items-center ${selectedId === t.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
            onClick={() => onSelect(t)}
          >
            <div className="space-y-1 pr-2 overflow-hidden">
                <h3 className="font-bold text-gray-900 truncate">{t.name}</h3>
                <div className="flex items-center text-xs text-gray-500 truncate">
                    <MapPin size={12} className="mr-1 shrink-0" />
                    <span className="truncate">{t.location}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={12} className="mr-1 shrink-0" />
                    <span>{new Date(t.tournament_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                </div>
            </div>
            <ChevronRight className="text-gray-300 shrink-0" size={20} />
          </div>
        ))}
      </div>

      {tournaments.length === 0 && (
        <div className="px-6 py-12 text-center text-gray-500 italic">
          No hay torneos esperando revisión
        </div>
      )}
    </div>
  );
}
