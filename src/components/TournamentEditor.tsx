'use client';

import { useState, useEffect } from 'react';
import { Tournament } from '@/types';
import { updateTournament, deleteTournament } from '@/lib/actions';

// Sub-componentes
import EditorHeader from './editor/EditorHeader';
import PosterSection from './editor/PosterSection';
import LocationSection from './editor/LocationSection';
import BasicInfoSection from './editor/BasicInfoSection';
import ModalitySection from './editor/ModalitySection';
import ContactSection from './editor/ContactSection';
import PrizesSection from './editor/PrizesSection';
import RulesSection from './editor/RulesSection';
import ActionFooter from './editor/ActionFooter';

interface TournamentEditorProps {
  tournament: Tournament;
  onSaved: () => void;
  onPublished: () => void;
  onCancel: () => void;
}

const SEA_DEFAULT = { lat: 43.409265, lng: -2.039183 };

const DEFAULT_CONTACT = {
  name: '',
  phone: '',
  is_whatsapp: false,
  instagram: '',
  facebook: '',
  email: ''
};

export default function TournamentEditor({ tournament, onSaved, onPublished, onCancel }: TournamentEditorProps) {
 
  // Inicializamos con valores por defecto si vienen NULL de la DB
  const [data, setData] = useState<Tournament>({
    ...tournament,
    latitude: tournament.latitude || SEA_DEFAULT.lat,
    longitude: tournament.longitude || SEA_DEFAULT.lng,
    contact: { ...DEFAULT_CONTACT, ...tournament.contact }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData({
      ...tournament,
      latitude: tournament.latitude || SEA_DEFAULT.lat,
      longitude: tournament.longitude || SEA_DEFAULT.lng,
      contact: { ...DEFAULT_CONTACT, ...tournament.contact }
    });
  }, [tournament]);

  async function handleSave() {
    setSaving(true);
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

  async function handleDelete() {
    if (!confirm('¿Estás seguro de que quieres eliminar este torneo? Esta acción no se puede deshacer.')) {
      return;
    }
    
    setSaving(true);
    const result = await deleteTournament(data.id);
    
    if (result.success) {
      alert('✅ Torneo eliminado correctamente');
      onCancel(); 
    } else {
      alert('❌ Error al eliminar: ' + result.error);
    }
    setSaving(false);
  }

  return (
    <div id="editor" className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
      
      <EditorHeader data={data} setData={setData} onCancel={onCancel} />

      <PosterSection poster_url={data.poster_url} />

      <div className="p-8 space-y-10">
        
        <LocationSection data={data} setData={setData} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BasicInfoSection data={data} setData={setData} />
          <ModalitySection data={data} setData={setData} />
        </div>

        <ContactSection data={data} setData={setData} />

        <PrizesSection data={data} setData={setData} />

        <RulesSection data={data} setData={setData} />

        <ActionFooter 
          saving={saving} 
          handleDelete={handleDelete} 
          handleSave={handleSave} 
          handlePublish={handlePublish} 
        />

      </div>
    </div>
  );
}
