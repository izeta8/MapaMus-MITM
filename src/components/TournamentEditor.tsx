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
 
  console.log(tournament)

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

  const statusConfig = {
    revision_pending: { label: 'REVISIÓN', color: 'bg-amber-100 text-amber-700 border-amber-200', header: 'bg-amber-50/50' },
    planned: { label: 'PUBLICADO / PLANIFICADO', color: 'bg-green-100 text-green-700 border-green-200', header: 'bg-green-50/50' },
    published: { label: 'PUBLICADO', color: 'bg-green-100 text-green-700 border-green-200', header: 'bg-green-50/50' },
    finished: { label: 'FINALIZADO', color: 'bg-gray-100 text-gray-700 border-gray-200', header: 'bg-gray-50/50' },
    canceled: { label: 'CANCELADO', color: 'bg-red-100 text-red-700 border-red-200', header: 'bg-red-50/50' },
  };

  const currentStatus = statusConfig[data.status as keyof typeof statusConfig] || statusConfig.revision_pending;

  return (
    <div id="editor" className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
      <div className={`p-6 border-b border-gray-100 flex justify-between items-center ${currentStatus.header}`}>
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">
                {data.status === 'revision_pending' ? 'Revisando Pendiente' : 'Editando Registro'}
              </h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${currentStatus.color}`}>
                {currentStatus.label}
              </span>
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
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest text-black">Tantos</label>
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
        </div>

        {/* SECCIÓN DE PREMIOS */}
        <div className="space-y-6 pt-10 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Premios y Recompensas</label>
            <button 
              onClick={() => {
                const newPrizes = [...(data.prizes || []), { rank: (data.prizes?.length || 0) + 1, description: '', cash: 0, tags: [] }];
                setData({ ...data, prizes: newPrizes });
              }}
              className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
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

        {/* SECCIÓN DE REGLAS */}
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
