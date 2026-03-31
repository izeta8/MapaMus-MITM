'use client';

import { Tournament } from '@/types';

interface TournamentListProps {
  tournaments: Tournament[];
  selectedId?: string;
  onSelect: (tournament: Tournament) => void;
}

export default function TournamentList({ tournaments, selectedId, onSelect }: TournamentListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Torneo</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Ubicación</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Fecha</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Estado</th>
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
                <div className="text-xs text-gray-400 font-mono">{t.id}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{t.location}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(t.tournament_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-bold uppercase">
                  Revisión
                </span>
              </td>
            </tr>
          ))}
          {tournaments.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                No hay torneos esperando revisión
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
