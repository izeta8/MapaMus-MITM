import { Tournament, Contact } from '@/types';
import { Mail, Phone, MessageCircle, Instagram, Facebook, User, Plus, Trash2 } from 'lucide-react';

interface ContactSectionProps {
  data: Tournament;
  setData: (data: Tournament) => void;
}

const DEFAULT_CONTACT: Contact = {
  name: '',
  phone: '',
  is_whatsapp: false,
  instagram: '',
  facebook: '',
  email: ''
};

export default function ContactSection({ data, setData }: ContactSectionProps) {
  const contacts = data.contacts || [];

  const updateContact = (index: number, updatedContact: Contact) => {
    const newContacts = [...contacts];
    newContacts[index] = updatedContact;
    setData({ ...data, contacts: newContacts });
  };

  const addContact = () => {
    setData({ ...data, contacts: [...contacts, { ...DEFAULT_CONTACT }] });
  };

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setData({ ...data, contacts: newContacts });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <button
          onClick={addContact}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold"
        >
          <Plus size={14} /> Añadir Contacto
        </button>
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
          <p className="text-sm text-gray-400">No hay contactos añadidos.</p>
          <button
            onClick={addContact}
            className="mt-2 text-blue-500 text-xs font-bold hover:underline"
          >
            Añadir el primero
          </button>
        </div>
      )}

      <div className="space-y-8">
        {contacts.map((contact, index) => (
          <div key={index} className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Contacto #{index + 1}</span>
              <button
                onClick={() => removeContact(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar contacto"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  Nombre de Contacto
                </label>
                <div className="relative">
                  <input
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
                    placeholder="Ej: Juan Pérez"
                    value={contact.name || ''}
                    onChange={e => updateContact(index, { ...contact, name: e.target.value })}
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
                  value={contact.email || ''}
                  onChange={e => updateContact(index, { ...contact, email: e.target.value })}
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
                      checked={contact.is_whatsapp || false}
                      onChange={e => updateContact(index, { ...contact, is_whatsapp: e.target.checked })}
                    />
                  </label>
                </div>
                <input
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
                  placeholder="Ej: 600 000 000"
                  value={contact.phone || ''}
                  onChange={e => updateContact(index, { ...contact, phone: e.target.value })}
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
                    value={contact.instagram || ''}
                    onChange={e => updateContact(index, { ...contact, instagram: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Facebook size={12} /> Facebook
                  </label>
                  <input
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-black font-medium"
                    placeholder="Usuario/Página"
                    value={contact.facebook || ''}
                    onChange={e => updateContact(index, { ...contact, facebook: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
