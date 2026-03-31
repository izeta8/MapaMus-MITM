'use client';

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useState } from 'react';

interface MapPickerProps {
  lat: number;
  lng: number;
  onPositionChange: (lat: number, lng: number) => void;
}

const GIPUZKOA_CENTER = { lat: 43.2, lng: -2.20 };

export default function MapPicker({ lat, lng, onPositionChange }: MapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState({ 
    lat: lat ||   GIPUZKOA_CENTER.lat, 
    lng: lng || GIPUZKOA_CENTER.lng 
  });

  // Sincronizar posición si cambia desde fuera (ej: al cambiar de torneo)
  useEffect(() => {
    if (lat && lng) {
      setMarkerPosition({ lat, lng });
    }
  }, [lat, lng]);

  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setMarkerPosition({ lat: newLat, lng: newLng });
      onPositionChange(newLat, newLng);
    }
  }, [onPositionChange]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
      <APIProvider apiKey={apiKey}>
        <Map
          center={markerPosition}
          defaultZoom={13}
          mapId="tournament-picker" // Requerido para AdvancedMarker
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          <AdvancedMarker
            position={markerPosition}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          >
            <Pin background={'#2563eb'} borderColor={'#1e40af'} glyphColor={'#ffffff'} />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
