interface PosterSectionProps {
  poster_url: string | null;
}

export default function PosterSection({ poster_url }: PosterSectionProps) {
  if (!poster_url) return null;

  return (
    <div className="p-8 space-y-10">
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cartel del Torneo</label>
        <div className="m-auto max-w-96 relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group">
          <img
            src={poster_url}
            alt="Cartel del torneo"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <a
            href={poster_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm backdrop-blur-[2px]"
          >
            VER IMAGEN COMPLETA
          </a>
        </div>
      </div>
    </div>
  );
}
