'use client';

import { useState, useEffect } from 'react';
import { Tournament } from '@/types';
import MapPicker from './MapPicker';
import { Save, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TournamentEditorProps {
  tournament: Tournament;
  onSaved: () => void;
  onPublished: () => void;
  onCancel: () => void;
}

export default function TournamentEditor({ tournament, onSaved, onPublished, onCancel }: TournamentEditorProps) {
  const [data, setData] = useState<Tournament>(tournament);
  const [saving, setSaving] = useState(false);

  // Update local state if a new tournament is selected
  useEffect(() => {
    setData(tournament);
  }, [tournament]);

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from('tournaments')
      .update(data)
      .eq('id', data.id);

    if (!error) {
      alert('Cambios guardados');
      onSaved();
    } else {
      alert('Error: ' + error.message);
    }
    setSaving(false);
  }

  async function handlePublish() {
    setSaving(true);
    const { error } = await supabase
      .from('tournaments')
      .update({ ...data, status: 'published' })
      .eq('id', data.id);

    if (!error) {
      alert('Torneo publicado con éxito');
      onPublished();
    } else {
      alert('Error: ' + error.message);
    }
    setSaving(false);
  }

  return (
    <div id="editor" className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Editando: {data.name}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          Cerrar editor
        </button>
      </div>
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Nombre del Torneo</label>
            <input 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
              value={data.name}
              onChange={e => setData({...data, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Fecha (ISO)</label>
            <input 
              type="datetime-local"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none  text-black"
              value={data.tournament_date ? new Date(data.tournament_date).toISOString().slice(0, 16) : ''}
              onChange={e => setData({...data, tournament_date: new Date(e.target.value).toISOString()})}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Ubicación (Texto descriptivo)</label>
            <input 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none  text-black"
              value={data.location}
              onChange={e => setData({...data, location: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider block">Corrección de Coordenadas (Visual)</label>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-inner">
            <MapPicker 
              lat={data.latitude || 43.3183} 
              lng={data.longitude || -1.9812} 
              onPositionChange={(lat, lon) => setData({...data, latitude: lat, longitude: lon})}
            />
          </div>
          <div className="flex gap-6 text-xs font-mono text-gray-500 bg-gray-50 p-2 rounded-md">
            <span>LAT: {data.latitude?.toFixed(6) || 'N/A'}</span>
            <span>LON: {data.longitude?.toFixed(6) || 'N/A'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Reyes</label>
            <select 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
              value={data.kings_modality || ''}
              onChange={e => setData({...data, kings_modality: parseInt(e.target.value)})}
            >
              <option value="">Seleccionar...</option>
              <option value="4">4 Reyes</option>
              <option value="8">8 Reyes</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Tantos</label>
            <input 
              type="number"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-black"
              value={data.points_modality || ''}
              onChange={e => setData({...data, points_modality: parseInt(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Precio Pareja (€)</label>
            <input 
              type="number"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg  text-black"
              value={data.price_per_couple || ''}
              onChange={e => setData({...data, price_per_couple: parseFloat(e.target.value)})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Inscripción</label>
          <textarea 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg  text-black"
            rows={2}
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

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-gray-500">ID: <span className="font-mono text-[10px]">{data.id}</span></div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              <Save size={20} />
              {saving ? '...' : 'Guardar'}
            </button>
            <button 
              onClick={handlePublish}
              disabled={saving}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-12 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 transform hover:-translate-y-1"
            >
              <CheckCircle size={20} />
              {saving ? '...' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
