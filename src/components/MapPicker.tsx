'use client';

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useState, useRef } from 'react';

interface MapPickerProps {
  lat: number | null | undefined;
  lng: number | null | undefined;
  onPositionChange: (lat: number, lng: number) => void;
}

const SEA_LOCATION = { lat: 43.842236, lng: -2.556456 }; // San Sebastián Centro

// Componente interno para el buscador
const PlaceAutocomplete = ({ onPlaceSelect }: { onPlaceSelect: (place: google.maps.places.PlaceResult) => void }) => {
  const map = useMap();
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
      componentRestrictions: { country: 'es' }
    };

    const ac = new places.Autocomplete(inputRef.current, options);
    setAutocomplete(ac);
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect(place);
        map?.panTo(place.geometry.location);
        map?.setZoom(17);
      }
    });
  }, [autocomplete, map, onPlaceSelect]);

  return (
    <div className="absolute top-4 left-4 z-10 w-72 md:w-96">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar bar, restaurante o calle..."
        className="w-full px-4 py-3 rounded-lg border-none shadow-2xl focus:ring-2 focus:ring-blue-500 text-black font-medium outline-none"
      />
    </div>
  );
};

export default function MapPicker({ lat, lng, onPositionChange }: MapPickerProps) {
  // Validamos si las coordenadas son reales, si no, usamos Gipuzkoa
  const initialPos = (lat && lng && lat !== 0) 
    ? { lat, lng } 
    : SEA_LOCATION;

  const [markerPosition, setMarkerPosition] = useState(initialPos);

  // Sincronizar si cambia el torneo seleccionado
  useEffect(() => {
    if (lat && lng && lat !== 0) {
      setMarkerPosition({ lat, lng });
    } else {
      setMarkerPosition(SEA_LOCATION);
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

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult) => {
    const location = place.geometry?.location;
    if (location) {
      const newPos = { lat: location.lat(), lng: location.lng() };
      setMarkerPosition(newPos);
      onPositionChange(newPos.lat, newPos.lng);
    }
  }, [onPositionChange]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100 relative shadow-inner">
      <APIProvider apiKey={apiKey} libraries={['places']}>
        <Map
          center={markerPosition}
          defaultZoom={13}
          mapId="tournament-picker"
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          className="w-full h-full"
        >
          <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
          
          <AdvancedMarker
            position={markerPosition}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          >
            <Pin background={'#2563eb'} borderColor={'#1e40af'} glyphColor={'#ffffff'} scale={1.2} />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
