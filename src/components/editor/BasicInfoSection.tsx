import { Tournament } from '@/types';

interface BasicInfoSectionProps {
  data: Tournament;
  setData: (data: Tournament) => void;
}

export default function BasicInfoSection({ data, setData }: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nombre del Evento</label>
        <input
          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-bold"
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Dirección / Bar (Texto)</label>
        <input
          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
          value={data.location}
          onChange={e => setData({ ...data, location: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Fecha y Hora</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-black text-sm"
            value={data.tournament_date ? new Date(data.tournament_date).toISOString().slice(0, 16) : ''}
            onChange={e => setData({ ...data, tournament_date: new Date(e.target.value).toISOString() })}
          />
        </div>
        <div className="col-span-1 space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Precio</label>
          <input
            type="number"
            className="w-full px-2 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-black font-bold text-center"
            value={data.price_per_couple || ''}
            onChange={e => setData({ ...data, price_per_couple: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}
