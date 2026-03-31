'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tournament } from '@/types';
import TournamentList from '@/components/TournamentList';
import TournamentEditor from '@/components/TournamentEditor';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar lista de pendientes
  useEffect(() => {
    fetchTournaments();
  }, []);

  // 2. Manejar el Query Param ?id=... de forma independiente y robusta
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      loadTournamentById(idFromUrl);
    }
  }, [searchParams]);

  async function fetchTournaments() {
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

  async function loadTournamentById(id: string) {
    // Primero miramos si ya está en nuestra lista local para ahorrar una petición
    const localMatch = tournaments.find(t => t.id === id);
    if (localMatch) {
      setSelectedTournament(localMatch);
      scrollToEditor();
      return;
    }

    // Si no está en la lista (porque quizás no es 'revision_pending'), lo buscamos en la DB
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setSelectedTournament(data as Tournament);
      scrollToEditor();
    } else if (error) {
      console.error("Error cargando torneo por ID:", error.message);
    }
  }

  const scrollToEditor = () => {
    setTimeout(() => {
      document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleSelect = (t: Tournament) => {
    setSelectedTournament(t);
    scrollToEditor();
    // Actualizar URL sin recargar
    const params = new URLSearchParams(window.location.search);
    params.set('id', t.id);
    window.history.replaceState(null, '', `?${params.toString()}`);
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MapaMus MITM</h1>
            <p className="text-gray-500">Panel de revisión de torneos scrapper</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/manage" 
              className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              GESTIONAR TODOS
            </Link>
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              {tournaments.length} pendientes
            </div>
          </div>
        </div>

        {/* Lista de torneos pendientes */}
        <TournamentList 
          tournaments={tournaments} 
          selectedId={selectedTournament?.id} 
          onSelect={handleSelect} 
        />

        {/* Editor (se muestra si hay un torneo seleccionado, ya sea por clic o por URL) */}
        {selectedTournament && (
          <div className="mt-12">
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
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
