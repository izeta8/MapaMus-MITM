'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Organizer, Tournament, Contact } from '@/types';
import { 
  X, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  User, 
  ExternalLink, 
  Loader2, 
  Trophy, 
  Users, 
  AlertCircle,
  ChevronRight,
  Settings
} from 'lucide-react';
import Link from 'next/link';

interface OrganizerDetailDrawerProps {
  organizer: Organizer | null;
  onClose: () => void;
  onVerify?: (id: string) => void;
  isVerifying?: boolean;
}

export default function OrganizerDetailDrawer({ 
  organizer, 
  onClose, 
  onVerify, 
  isVerifying = false 
}: OrganizerDetailDrawerProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Escuchar tecla Escape y bloquear scroll del body
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (organizer) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Fetch tournaments
      fetchTournaments();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [organizer]);

  async function fetchTournaments() {
    if (!organizer) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('organizer_id', organizer.id)
        .order('tournament_date', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (err: any) {
      console.error('Error fetching tournaments:', err);
      setError('No se pudieron cargar los torneos del organizador.');
    } finally {
      setLoading(false);
    }
  }

  if (!organizer) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formattedDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const statusConfig = {
    revision_pending: { label: 'REVISIÓN PENDIENTE', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
    planned: { label: 'PUBLICADO', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    published: { label: 'PUBLICADO', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    finished: { label: 'FINALIZADO', color: 'bg-gray-100 text-gray-700 border border-gray-200' },
    canceled: { label: 'CANCELADO', color: 'bg-red-50 text-red-700 border border-red-200' },
  };

  const contactsList: Contact[] = Array.isArray(organizer.contacts) ? organizer.contacts : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full z-50 animate-slide-in">
        {/* Cabecera del Drawer */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            {organizer.logo_url ? (
              <img 
                src={organizer.logo_url} 
                alt={organizer.name} 
                className="w-12 h-12 rounded-xl object-cover bg-white border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                {getInitials(organizer.name)}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{organizer.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                  <Globe size={11} /> /{organizer.slug}
                </span>
                {organizer.is_verified ? (
                  <span className="inline-flex items-center gap-0.5 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    <ShieldCheck size={11} /> Verificado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    <ShieldAlert size={11} /> Pendiente
                  </span>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors outline-none"
            aria-label="Cerrar detalles"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido Desplazable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 divide-y divide-gray-100">
          {/* Sección 1: Información Básica y Dirección */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Información de Registro</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Fecha de alta</span>
                <span className="font-semibold text-gray-800">{formattedDate(organizer.created_at)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 font-medium">Última actualización</span>
                <span className="font-semibold text-gray-800">{formattedDate(organizer.updated_at || organizer.created_at)}</span>
              </div>
            </div>

            {organizer.address && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-start gap-2 text-gray-500">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-blue-500" />
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Dirección</span>
                    <span className="text-sm font-semibold text-gray-800 leading-normal">{organizer.address}</span>
                  </div>
                </div>
                {organizer.latitude && organizer.longitude && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${organizer.latitude},${organizer.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline mt-1 pl-6"
                  >
                    Ver en Google Maps <ExternalLink size={10} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sección 2: Contactos */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Contactos Registrados</h3>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {contactsList.length}
              </span>
            </div>

            {contactsList.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No hay contactos registrados para este organizador.</p>
            ) : (
              <div className="space-y-4">
                {contactsList.map((contact, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow space-y-3">
                    <div className="flex justify-between items-start gap-2 border-b border-gray-50 pb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                          <User size={14} />
                        </div>
                        <span className="font-bold text-gray-800 truncate text-sm">
                          {contact.name || 'Contacto sin nombre'}
                        </span>
                      </div>
                      {contact.description && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-md truncate max-w-[150px]" title={contact.description}>
                          {contact.description}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 text-xs text-gray-600">
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-gray-400" />
                          <span className="font-semibold">{contact.phone}</span>
                          {contact.is_whatsapp && (
                            <span className="inline-flex items-center gap-0.5 bg-green-50 text-green-700 text-[9px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                              <MessageCircle size={10} className="fill-green-700" /> WSP
                            </span>
                          )}
                        </div>
                      )}

                      {contact.email && (
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail size={13} className="text-gray-400 shrink-0" />
                          <a 
                            href={`mailto:${contact.email}`} 
                            className="font-semibold text-blue-600 hover:underline truncate"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}

                      {contact.instagram && (
                        <div className="flex items-center gap-2 min-w-0">
                          <Instagram size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">
                            Instagram: <span className="font-semibold">{contact.instagram}</span>
                          </span>
                        </div>
                      )}

                      {contact.facebook && (
                        <div className="flex items-center gap-2 min-w-0">
                          <Facebook size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">
                            Facebook: <span className="font-semibold">{contact.facebook}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección 3: Torneos del Organizador */}
          <div className="pt-6 space-y-4 pb-12">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Torneos</h3>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {loading ? '...' : tournaments.length}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="animate-spin text-blue-600 h-8 w-8 mb-2" />
                <p className="text-xs text-gray-500 font-medium">Buscando torneos...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2.5 text-red-800 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : tournaments.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-500">
                <Trophy className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-xs font-semibold text-gray-600">Sin torneos creados</p>
                <p className="text-[11px] text-gray-400 mt-1">Este organizador no ha registrado ningún torneo aún.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tournaments.map((t) => {
                  const status = statusConfig[t.status as keyof typeof statusConfig] || statusConfig.revision_pending;
                  return (
                    <div 
                      key={t.id} 
                      className="border border-gray-100 rounded-xl p-4 bg-white hover:border-gray-200 shadow-sm flex flex-col justify-between transition-all"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2.5">
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 leading-snug truncate" title={t.name}>
                            {t.name}
                          </h4>
                          <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block mt-0.5">
                            ID: {t.id.slice(0, 8)}...
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5 text-xs text-gray-500 mb-3.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin size={12} className="shrink-0 text-gray-400" />
                          <span className="truncate">{t.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="shrink-0 text-gray-400" />
                          <span>{new Date(t.tournament_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-0.5 text-[11px]">
                          {t.price_per_couple !== null && (
                            <span className="font-medium">
                              Inscripción: <strong className="text-gray-700 font-bold">{t.price_per_couple}€</strong>/pareja
                            </span>
                          )}
                          {t.prizes && t.prizes.length > 0 && (
                            <span className="font-medium flex items-center gap-0.5">
                              Premios: <strong className="text-gray-700 font-bold">{t.prizes.length}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <Link 
                        href={`/manage?id=${t.id}`}
                        onClick={() => {
                          // Permitir que el body scroll se resetee al cambiar de ruta
                          document.body.style.overflow = 'unset';
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 font-bold py-2 px-3 rounded-lg text-xs transition-colors"
                      >
                        <Settings size={12} />
                        <span>Editar / Gestionar Torneo</span>
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer de Acciones Rápidas */}
        {!organizer.is_verified && onVerify && (
          <div className="p-4 bg-amber-50/50 border-t border-amber-100 flex gap-3">
            <button
              onClick={() => onVerify(organizer.id)}
              disabled={isVerifying}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Verificando organizador...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Aprobar y Verificar Organizador</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Estilos auxiliares para animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
