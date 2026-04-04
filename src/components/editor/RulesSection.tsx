import { Tournament } from '@/types';
import { XCircle } from 'lucide-react';

interface RulesSectionProps {
  data: Tournament;
  setData: (data: Tournament) => void;
}

export default function RulesSection({ data, setData }: RulesSectionProps) {
  return (
    <div className="space-y-6 pt-10 border-t border-gray-100">
      <div className="flex justify-between items-center">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Reglas del Torneo</label>
        <button 
          onClick={() => {
            const newRules = [...(data.rules || []), ''];
            setData({ ...data, rules: newRules });
          }}
          className="text-[10px] font-black bg-purple-50 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-100 transition-colors"
        >
          + AÑADIR REGLA
        </button>
      </div>

      <div className="space-y-3">
        {data.rules?.map((rule, index) => (
          <div key={index} className="flex gap-3 items-center group">
            <div className="flex-none bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
              {index + 1}
            </div>
            <input 
              type="text"
              placeholder="Ej: Se juega a 40 tantos"
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-purple-300 outline-none transition-all text-black"
              value={rule}
              onChange={(e) => {
                const newRules = [...(data.rules || [])];
                newRules[index] = e.target.value;
                setData({ ...data, rules: newRules });
              }}
            />
            <button 
              onClick={() => {
                const newRules = data.rules?.filter((_, i) => i !== index);
                setData({ ...data, rules: newRules || [] });
              }}
              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
            >
              <XCircle size={18} />
            </button>
          </div>
        ))}

        {(!data.rules || data.rules.length === 0) && (
          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm italic">
            No se han definido reglas específicas
          </div>
        )}
      </div>
    </div>
  );
}
