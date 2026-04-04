import { Tournament } from '@/types';
import { Mail, Phone, MessageCircle, Instagram, Facebook, User } from 'lucide-react';

interface ContactSectionProps {
  data: Tournament;
  setData: (data: Tournament) => void;
}

export default function ContactSection({ data, setData }: ContactSectionProps) {
  return (
    <div className="space-y-6 pt-10 border-t border-gray-100">
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Información de Contacto</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            Nombre de Contacto
          </label>
          <div className="relative">
            <input
              className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
              placeholder="Ej: Juan Pérez"
              value={data.contact?.name || ''}
              onChange={e => setData({
                ...data,
                contact: { ...(data.contact || {} as any), name: e.target.value }
              })}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={18} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Mail size={12} /> Email
          </label>
          <input
            type="email"
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
            placeholder="ejemplo@email.com"
            value={data.contact?.email || ''}
            onChange={e => setData({
              ...data,
              contact: { ...(data.contact || {} as any), email: e.target.value }
            })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Phone size={12} /> Teléfono
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <span className="text-[10px] font-black text-gray-400 group-hover:text-green-600 transition-colors uppercase flex items-center gap-1">
                <MessageCircle size={12} /> ¿WhatsApp?
              </span>
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                checked={data.contact?.is_whatsapp || false}
                onChange={e => setData({
                  ...data,
                  contact: { ...(data.contact || {} as any), is_whatsapp: e.target.checked }
                })}
              />
            </label>
          </div>
          <input
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
            placeholder="Ej: 600 000 000"
            value={data.contact?.phone || ''}
            onChange={e => setData({
              ...data,
              contact: { ...(data.contact || {} as any), phone: e.target.value }
            })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Instagram size={12} /> Instagram
            </label>
            <input
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
              placeholder="@usuario"
              value={data.contact?.instagram || ''}
              onChange={e => setData({
                ...data,
                contact: { ...(data.contact || {} as any), instagram: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Facebook size={12} /> Facebook
            </label>
            <input
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
              placeholder="Usuario/Página"
              value={data.contact?.facebook || ''}
              onChange={e => setData({
                ...data,
                contact: { ...(data.contact || {} as any), facebook: e.target.value }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
