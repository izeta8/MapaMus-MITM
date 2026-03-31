'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tournament } from '@/types';
import TournamentList from '@/components/TournamentList';
import TournamentEditor from '@/components/TournamentEditor';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'revision_pending')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTournaments(data as Tournament[]);
    }
    setLoading(false);
  }

  const handleSelect = (t: Tournament) => {
    setSelectedTournament(t);
    setTimeout(() => {
      document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    console.log(t)
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando torneos...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MapaMus MITM</h1>
            <p className="text-gray-500">Panel de revisión de torneos scrapper</p>
          </div>
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            {tournaments.length} pendientes
          </div>
        </div>

        {/* List Component */}
        <TournamentList 
          tournaments={tournaments} 
          selectedId={selectedTournament?.id} 
          onSelect={handleSelect} 
        />

        {/* Editor Component */}
        {selectedTournament && (
          <TournamentEditor 
            tournament={selectedTournament}
            onSaved={fetchTournaments}
            onPublished={() => {
              setSelectedTournament(null);
              fetchTournaments();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCancel={() => setSelectedTournament(null)}
          />
        )}
      </div>
    </main>
  );
}
