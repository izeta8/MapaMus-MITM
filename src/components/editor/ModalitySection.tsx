import { Tournament } from '@/types';

interface ModalitySectionProps {
  data: Tournament;
  setData: (data: Tournament) => void;
}

export default function ModalitySection({ data, setData }: ModalitySectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Reyes</label>
          <select
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-black font-bold"
            value={data.kings_modality || ''}
            onChange={e => setData({ ...data, kings_modality: parseInt(e.target.value) })}
          >
            <option value="">Desconocido</option>
            <option value="4">4 Reyes</option>
            <option value="8">8 Reyes</option>
          </select>
        </div>
        <div className="col-span-1 space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tantos</label>
          <select 
            className="w-full px-2 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-black text-center font-bold"
            value={data.points_modality || ''}
            onChange={e => setData({...data, points_modality: e.target.value ? parseInt(e.target.value) : null})}
          >
            <option value="">-</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Detalles de Inscripción</label>
        <textarea
          className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-black"
          rows={4}
          value={data.registration_info?.in_person_details || ''}
          onChange={e => setData({
            ...data,
            registration_info: {
              ...(data.registration_info || { in_app_enabled: false, in_person_details: '' }),
              in_person_details: e.target.value
            }
          })}
        />
      </div>
    </div>
  );
}
