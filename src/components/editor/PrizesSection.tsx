import { Tournament } from '@/types';
import { XCircle } from 'lucide-react';

interface PrizesSectionProps {
  data: Tournament;
  setData: (data: Tournament) => void;
}

export default function PrizesSection({ data, setData }: PrizesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <button 
          onClick={() => {
            const newPrizes = [...(data.prizes || []), { rank: (data.prizes?.length || 0) + 1, description: '', cash: 0, tags: [] }];
            setData({ ...data, prizes: newPrizes });
          }}
          className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          + AÑADIR PREMIO
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.prizes?.map((prize, index) => (
          <div key={index} className="relative flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 items-start md:items-center group">
            <button 
              onClick={() => {
                const newPrizes = data.prizes?.filter((_, i) => i !== index);
                setData({ ...data, prizes: newPrizes || [] });
              }}
              className="absolute top-3 right-3 md:mt-0 p-2 text-gray-300 hover:text-red-500 transition-colors"
            >
              <XCircle size={20} />
            </button>
            
            <div className="w-16">
              <label className="text-[10px] font-black text-gray-400 block mb-1">PUESTO</label>
              <input 
                type="number"
                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-sm font-bold text-center text-black"
                value={prize.rank}
                onChange={(e) => {
                  const newPrizes = [...(data.prizes || [])];
                  newPrizes[index].rank = parseInt(e.target.value);
                  setData({ ...data, prizes: newPrizes });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-[10px] font-black text-gray-400 block mb-1">DESCRIPCIÓN</label>
              <input 
                type="text"
                placeholder="Ej: Cordero + Trofeo"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black"
                value={prize.description}
                onChange={(e) => {
                  const newPrizes = [...(data.prizes || [])];
                  newPrizes[index].description = e.target.value;
                  setData({ ...data, prizes: newPrizes });
                }}
              />
            </div>
            <div className="w-24">
              <label className="text-[10px] font-black text-gray-400 block mb-1">METÁLICO</label>
              <input 
                type="number"
                placeholder="€"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-blue-600 text-black"
                value={prize.cash}
                onChange={(e) => {
                  const newPrizes = [...(data.prizes || [])];
                  newPrizes[index].cash = parseFloat(e.target.value);
                  setData({ ...data, prizes: newPrizes });
                }}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-[10px] font-black text-gray-400 block mb-1">TAGS (separar por comas)</label>
              <input 
                type="text"
                placeholder="Especial, Local..."
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black"
                value={prize.tags?.join(', ') || ''}
                onChange={(e) => {
                  const newPrizes = [...(data.prizes || [])];
                  newPrizes[index].tags = e.target.value.split(',').map(t => t.trim()).filter(t => t !== '');
                  setData({ ...data, prizes: newPrizes });
                }}
              />
            </div>
          </div>
        ))}
        
        {(!data.prizes || data.prizes.length === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm italic">
            No hay premios definidos para este torneo
          </div>
        )}
      </div>
    </div>
  );
}
