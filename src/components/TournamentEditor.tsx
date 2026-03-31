'use client';

import { useState, useEffect } from 'react';
import { Tournament } from '@/types';
import MapPicker from './MapPicker';
import { Save, CheckCircle, XCircle } from 'lucide-react';
import { updateTournament } from '@/lib/actions';

interface TournamentEditorProps {
  tournament: Tournament;
  onSaved: () => void;
  onPublished: () => void;
  onCancel: () => void;
}

const SEA_DEFAULT = { lat: 43.409265, lng: -2.039183 };

export default function TournamentEditor({ tournament, onSaved, onPublished, onCancel }: TournamentEditorProps) {
  // Inicializamos con valores por defecto si vienen NULL de la DB
  const [data, setData] = useState<Tournament>({
    ...tournament,
    latitude: tournament.latitude || SEA_DEFAULT.lat,
    longitude: tournament.longitude || SEA_DEFAULT.lng
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData({
      ...tournament,
      latitude: tournament.latitude || SEA_DEFAULT.lat,
      longitude: tournament.longitude || SEA_DEFAULT.lng
    });
  }, [tournament]);

  async function handleSave() {
    setSaving(true);
    console.log('Intentando guardar datos:', data);
    const result = await updateTournament(data);

    if (result.success) {
      alert('✅ Cambios guardados correctamente en la base de datos');
      onSaved();
    } else {
      console.error('ERROR AL GUARDAR:', result.error);
      alert('❌ ERROR AL GUARDAR: ' + result.error);
    }
    setSaving(false);
  }

  async function handlePublish() {
    setSaving(true);
    const publishedData = { ...data, status: 'planned' as any };
    const result = await updateTournament(publishedData);

    if (result.success) {
      alert('✅ Torneo publicado con éxito');
      onPublished();
    } else {
      alert('❌ Error: ' + result.error);
    }
    setSaving(false);
  }

  return (
    <div id="editor" className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">EDITANDO REGISTRO</h2>
          <p className="text-xs text-gray-500 font-mono">{data.id}</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
          <XCircle size={24} />
        </button>
      </div>

      <div className="p-8 space-y-10">
        {/* Visualización del Póster */}
        {data.poster_url && (
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cartel del Torneo</label>
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group">
              <img
                src={data.poster_url}
                alt="Cartel del torneo"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <a
                href={data.poster_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm backdrop-blur-[2px]"
              >
                VER IMAGEN COMPLETA
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 space-y-10">
        {/* Sección de Mapa y Buscador */}
        <div className="space-y-4">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Localización Geográfica</label>
          <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner">
            <MapPicker
              lat={data.latitude}
              lng={data.longitude}
              onPositionChange={(lat, lon) => setData({ ...data, latitude: lat, longitude: lon })}
            />
          </div>
          <div className="flex gap-4 justify-center">
            <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-mono text-gray-600 border border-gray-200">
              LAT: {data.latitude?.toFixed(6)}
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-mono text-gray-600 border border-gray-200">
              LON: {data.longitude?.toFixed(6)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <input
                  type="number"
                  className="w-full px-2 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none text-black text-center font-bold"
                  value={data.points_modality || ''}
                  onChange={e => setData({ ...data, points_modality: parseInt(e.target.value) })}
                />
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
        </div>

        {/* Footer de Acciones */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-black hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 active:scale-95"
          >
            <Save size={20} />
            {saving ? 'GUARDANDO...' : 'GUARDAR'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-50 transform hover:-translate-y-1 active:scale-95"
          >
            <CheckCircle size={20} />
            {saving ? 'PUBLICANDO...' : 'PUBLICAR'}
          </button>
        </div>
      </div>
    </div>
  );
}
