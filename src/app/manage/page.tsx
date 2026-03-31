'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tournament } from '@/types';
import TournamentList from '@/components/TournamentList';
import TournamentEditor from '@/components/TournamentEditor';
import { Loader2, Search, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';

function ManageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Cargar torneos al inicio y cuando cambien los filtros
  useEffect(() => {
    fetchTournaments();
  }, [statusFilter]);

  async function fetchTournaments() {
    setLoading(true);
    let query = supabase
      .from('tournaments')
      .select('*')
      .order('tournament_date', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query.limit(50);

    if (!error && data) {
      setTournaments(data as Tournament[]);
    }
    setLoading(false);
  }

  // Filtrado local por término de búsqueda
  const filteredTournaments = tournaments.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      loadTournamentById(idFromUrl);
    }
  }, [searchParams]);

  async function loadTournamentById(id: string) {
    const localMatch = tournaments.find(t => t.id === id);
    if (localMatch) {
      setSelectedTournament(localMatch);
      scrollToEditor();
      return;
    }

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setSelectedTournament(data as Tournament);
      scrollToEditor();
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
    // Actualizar URL sin recargar para mantener historial
    const params = new URLSearchParams(window.location.search);
    params.set('id', t.id);
    window.history.replaceState(null, '', `?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-blue-600 flex items-center gap-2 text-sm font-bold mb-2 hover:underline">
              <ArrowLeft size={16} /> VOLVER A PENDIENTES
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Torneos</h1>
            <p className="text-gray-500">Busca y edita cualquier torneo de la base de datos</p>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Buscar por nombre, pueblo o ID..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select 
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-black font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="revision_pending">Pendientes</option>
              <option value="planned">Publicados</option>
              <option value="finished">Finalizados</option>
              <option value="canceled">Cancelados</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
          </div>
        ) : (
          <TournamentList 
            tournaments={filteredTournaments} 
            selectedId={selectedTournament?.id} 
            onSelect={handleSelect} 
          />
        )}

        {selectedTournament && (
          <div className="mt-12">
            <TournamentEditor 
              tournament={selectedTournament}
              onSaved={fetchTournaments}
              onPublished={() => {
                fetchTournaments();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onCancel={() => {
                setSelectedTournament(null);
                const params = new URLSearchParams(window.location.search);
                params.delete('id');
                window.history.replaceState(null, '', `?${params.toString()}`);
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function ManagePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
      <ManageContent />
    </Suspense>
  );
}
