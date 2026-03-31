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

// Nueva ubicación por defecto solicitada
const SEA_DEFAULT = { lat: 41.409265, lng: -2.039183 };

const MapHandler = ({ center }: { center: google.maps.LatLngLiteral }) => {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);
  return null;
};

const PlaceAutocomplete = ({ onPlaceSelect }: { onPlaceSelect: (place: google.maps.places.PlaceResult) => void }) => {
  const map = useMap();
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const ac = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'name'],
      componentRestrictions: { country: 'es' }
    });
    setAutocomplete(ac);
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect(place);
        map?.setZoom(18);
      }
    });
  }, [autocomplete, map, onPlaceSelect]);

  return (
    <div className="absolute top-4 left-4 z-10 w-72 md:w-96">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar bar, restaurante o calle..."
        className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-xl focus:ring-2 focus:ring-blue-500 text-black font-medium outline-none"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default function MapPicker({ lat, lng, onPositionChange }: MapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState(SEA_DEFAULT);
  const [cameraCenter, setCameraCenter] = useState(SEA_DEFAULT);

  useEffect(() => {
    const pos = (lat && lng && lat !== 0) ? { lat, lng } : SEA_DEFAULT;
    setMarkerPosition(pos);
    setCameraCenter(pos);
  }, [lat, lng]);

  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPos);
      onPositionChange(newPos.lat, newPos.lng);
    }
  }, [onPositionChange]);

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult) => {
    const location = place.geometry?.location;
    if (location) {
      const newPos = { lat: location.lat(), lng: location.lng() };
      setMarkerPosition(newPos);
      setCameraCenter(newPos);
      onPositionChange(newPos.lat, newPos.lng);
    }
  }, [onPositionChange]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100 relative shadow-inner">
      <APIProvider apiKey={apiKey} libraries={['places']}>
        <Map
          defaultCenter={SEA_DEFAULT}
          defaultZoom={9}
          mapId="tournament-picker"
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          className="w-full h-full"
        >
          <MapHandler center={cameraCenter} />
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
