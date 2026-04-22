import MapPicker from '../MapPicker';
import { Tournament } from '@/types';

interface LocationSectionProps {
  data: Tournament;
  setData: (data: Tournament) => void;
}

export default function LocationSection({ data, setData }: LocationSectionProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner">
        <MapPicker
          lat={data.latitude}
          lng={data.longitude}
          onPositionChange={(lat, lon) => setData({ ...data, latitude: lat, longitude: lon })}
        />
      </div>
      <div className="flex gap-4 justify-center">
        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-mono text-gray-600 border border-gray-200">
          LAT: {data.latitude?.toFixed(6)}
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-mono text-gray-600 border border-gray-200">
          LON: {data.longitude?.toFixed(6)}
        </div>
      </div>
    </div>
  );
}
