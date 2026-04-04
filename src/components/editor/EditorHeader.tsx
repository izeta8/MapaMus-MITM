import { Tournament } from '@/types';
import { XCircle } from 'lucide-react';

interface EditorHeaderProps {
  data: Tournament;
  setData: (data: Tournament) => void;
  onCancel: () => void;
}

export default function EditorHeader({ data, setData, onCancel }: EditorHeaderProps) {
  const statusConfig = {
    revision_pending: { label: 'REVISIÓN', color: 'bg-amber-100 text-amber-700 border-amber-200', header: 'bg-amber-50/50' },
    planned: { label: 'PUBLICADO', color: 'bg-green-100 text-green-700 border-green-200', header: 'bg-green-50/50' },
    finished: { label: 'FINALIZADO', color: 'bg-gray-100 text-gray-700 border-gray-200', header: 'bg-gray-50/50' },
    canceled: { label: 'CANCELADO', color: 'bg-red-100 text-red-700 border-red-200', header: 'bg-red-50/50' },
  };

  const currentStatus = statusConfig[data.status as keyof typeof statusConfig] || statusConfig.revision_pending;

  return (
    <div className={`p-6 border-b border-gray-100 flex justify-between items-center ${currentStatus.header}`}>
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">
              {data.status === 'revision_pending' ? 'Revisando Pendiente' : 'Editando Registro'}
            </h2>
            <select 
              className={`px-3 py-1 rounded-full text-[10px] font-black border outline-none appearance-none cursor-pointer hover:opacity-80 transition-opacity ${currentStatus.color}`}
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value as any })}
            >
              <option value="planned">PLANIFICADO</option>
              <option value="revision_pending">REVISIÓN</option>
              <option value="finished">FINALIZADO</option>
              <option value="canceled">CANCELADO</option>
            </select>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
            <span>ID: {data.id}</span>
            <span>•</span>
            <span>Creado: {new Date(data.created_at).toLocaleDateString('es-ES')}</span>
          </div>
        </div>
      </div>
      <button onClick={onCancel} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
        <XCircle size={24} />
      </button>
    </div>
  );
}
