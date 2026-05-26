'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Organizer, Contact } from '@/types';
import { verifyOrganizerAction } from '@/lib/actions';
import { 
  Loader2, 
  ArrowLeft, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  ExternalLink, 
  User, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Globe,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrganizers();
  }, []);

  async function fetchOrganizers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('organizers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrganizers(data as Organizer[]);
    } else if (error) {
      console.error('Error fetching organizers:', error.message);
    }
    setLoading(false);
  }

  async function handleVerify(id: string) {
    if (!confirm('¿Estás seguro de que quieres verificar este organizador?')) return;
    
    setVerifyingId(id);
    const result = await verifyOrganizerAction(id);

    if (result.success) {
      // Actualizar el estado local
      setOrganizers(prev => 
        prev.map(org => org.id === id ? { ...org, is_verified: true } : org)
      );
    } else {
      console.error('Error verifying organizer:', result.error);
      alert('Error al verificar el organizador: ' + result.error);
    }
    setVerifyingId(null);
  }

  // Filtrado de organizadores por búsqueda
  const filteredOrganizers = organizers.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (org.address && org.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Agrupamiento
  const unverifiedOrganizers = filteredOrganizers.filter(org => !org.is_verified);
  const verifiedOrganizers = filteredOrganizers.filter(org => org.is_verified);

  // Estadísticas
  const totalPending = organizers.filter(org => !org.is_verified).length;
  const totalVerified = organizers.filter(org => org.is_verified).length;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24 text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera */}
        <div className="mb-8">
          <div className="flex gap-4 mb-2">
            <Link href="/" className="text-blue-600 flex items-center gap-1.5 text-sm font-bold hover:underline">
              <ArrowLeft size={16} /> VOLVER A PENDIENTES
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/manage" className="text-blue-600 flex items-center gap-1.5 text-sm font-bold hover:underline">
              GESTIONAR TORNEOS
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Registro de Organizadores</h1>
              <p className="text-gray-500 mt-1">Valida y gestiona las cuentas de los organizadores de torneos de mus</p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-3">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-center shadow-sm">
                <span className="block text-2xl font-black text-amber-600">{totalPending}</span>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pendientes</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 text-center shadow-sm">
                <span className="block text-2xl font-black text-emerald-600">{totalVerified}</span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Verificados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Buscar organizador por nombre, slug o dirección..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-600 h-12 w-12 mb-4" />
            <p className="text-gray-500 font-medium">Cargando organizadores de la base de datos...</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* --- SECCIÓN 1: PENDIENTES --- */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
                <ShieldAlert className="text-amber-500" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Pendientes de Verificación ({unverifiedOrganizers.length})</h2>
              </div>

              {unverifiedOrganizers.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 shadow-sm flex flex-col items-center justify-center">
                  <ShieldCheck className="text-emerald-500 mb-2" size={40} />
                  <p className="font-semibold text-gray-800">¡Todo al día!</p>
                  <p className="text-sm text-gray-400 mt-1">No hay organizadores pendientes de verificar en este momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {unverifiedOrganizers.map(org => (
                    <OrganizerCard 
                      key={org.id} 
                      org={org} 
                      onVerify={handleVerify} 
                      isVerifying={verifyingId === org.id} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* --- SECCIÓN 2: VERIFICADOS --- */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
                <ShieldCheck className="text-emerald-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Organizadores Verificados ({verifiedOrganizers.length})</h2>
              </div>

              {verifiedOrganizers.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 shadow-sm">
                  <p className="text-sm">No se encontraron organizadores verificados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {verifiedOrganizers.map(org => (
                    <OrganizerCard 
                      key={org.id} 
                      org={org} 
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

interface OrganizerCardProps {
  org: Organizer;
  onVerify?: (id: string) => void;
  isVerifying?: boolean;
}

function OrganizerCard({ org, onVerify, isVerifying = false }: OrganizerCardProps) {
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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Safe parsing of contacts
  const contactsList: Contact[] = Array.isArray(org.contacts) ? org.contacts : [];

  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden ${
      org.is_verified 
        ? 'border-l-4 border-l-emerald-500 border-gray-200' 
        : 'border-l-4 border-l-amber-500 border-gray-200 bg-amber-50/10'
    }`}>
      
      {/* Información del Organizador */}
      <div className="p-6">
        
        {/* Cabecera de tarjeta */}
        <div className="flex items-start gap-4 mb-5">
          {org.logo_url ? (
            <img 
              src={org.logo_url} 
              alt={org.name} 
              className="w-14 h-14 rounded-xl object-cover bg-gray-100 border border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {getInitials(org.name)}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">{org.name}</h3>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs">
                <Globe size={12} /> /{org.slug}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Calendar size={12} /> {formattedDate(org.created_at)}
              </span>
            </div>
          </div>

          <div>
            {org.is_verified ? (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
                <ShieldCheck size={14} /> Verificado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold animate-pulse">
                <ShieldAlert size={14} /> Pendiente
              </span>
            )}
          </div>
        </div>

        {/* Detalles del Organizador */}
        <div className="space-y-4">
          
          {/* Dirección / Ubicación */}
          {org.address && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-start gap-2.5">
              <MapPin className="text-gray-400 shrink-0 mt-0.5" size={16} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dirección Registrada</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5 leading-relaxed">{org.address}</p>
                {org.latitude && org.longitude && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${org.latitude},${org.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1 hover:underline"
                  >
                    Ver en Google Maps <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Contactos */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span>Contactos Registrados</span>
              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {contactsList.length}
              </span>
            </h4>
            
            {contactsList.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No hay contactos registrados.</p>
            ) : (
              <div className="space-y-3.5">
                {contactsList.map((contact, idx) => (
                  <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-xl p-3.5 space-y-2">
                    
                    {/* Encabezado del contacto (Nombre y Descripción) */}
                    <div className="flex justify-between items-start gap-2 border-b border-gray-100/80 pb-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User size={14} className="text-gray-400 shrink-0" />
                        <span className="text-sm font-bold text-gray-800 truncate">
                          {contact.name || 'Sin nombre'}
                        </span>
                      </div>
                      
                      {contact.description && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md truncate max-w-[180px]" title={contact.description}>
                          {contact.description}
                        </span>
                      )}
                    </div>

                    {/* Vías de contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      
                      {/* Teléfono */}
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={12} className="text-gray-400" />
                          <span className="font-semibold">{contact.phone}</span>
                          {contact.is_whatsapp && (
                            <span className="inline-flex items-center gap-0.5 bg-green-50 text-green-700 text-[10px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                              <MessageCircle size={10} className="fill-green-700" /> WSP
                            </span>
                          )}
                        </div>
                      )}

                      {/* Email */}
                      {contact.email && (
                        <div className="flex items-center gap-2 text-gray-600 min-w-0">
                          <Mail size={12} className="text-gray-400 shrink-0" />
                          <a 
                            href={`mailto:${contact.email}`} 
                            className="font-semibold text-blue-600 hover:underline truncate"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}

                      {/* Instagram */}
                      {contact.instagram && (
                        <div className="flex items-center gap-2 text-gray-600 min-w-0">
                          <Instagram size={12} className="text-gray-400 shrink-0" />
                          <span className="truncate">
                            Instagram: <span className="font-semibold">{contact.instagram}</span>
                          </span>
                        </div>
                      )}

                      {/* Facebook */}
                      {contact.facebook && (
                        <div className="flex items-center gap-2 text-gray-600 min-w-0">
                          <Facebook size={12} className="text-gray-400 shrink-0" />
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
        </div>
      </div>

      {/* Botón de acción */}
      {!org.is_verified && onVerify && (
        <div className="px-6 py-4 bg-amber-50/50 border-t border-amber-100 flex justify-end">
          <button
            onClick={() => onVerify(org.id)}
            disabled={isVerifying}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all duration-200 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isVerifying ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Verificar Organizador</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
