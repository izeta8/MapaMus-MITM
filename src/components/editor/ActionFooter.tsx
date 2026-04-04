import { Trash2, Save, CheckCircle } from 'lucide-react';

interface ActionFooterProps {
  saving: boolean;
  handleDelete: () => void;
  handleSave: () => void;
  handlePublish: () => void;
}

export default function ActionFooter({ saving, handleDelete, handleSave, handlePublish }: ActionFooterProps) {
  return (
    <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
      <button
        onClick={handleDelete}
        disabled={saving}
        className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all disabled:opacity-50 active:scale-95 border-2 border-red-100"
      >
        <Trash2 size={20} />
        {saving ? 'ELIMINANDO...' : 'ELIMINAR REGISTRO'}
      </button>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
  );
}
