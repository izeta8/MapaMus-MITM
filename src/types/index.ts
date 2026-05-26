export type TournamentStatus = 'planned' | 'revision_pending' | 'finished' | 'canceled'

export interface Prize {
  rank: number;
  description: string;
  cash: number;
  tags: string[];
}

export interface Contact {
  name: string | null;
  phone: string | null;
  is_whatsapp: boolean;
  instagram: string | null;
  facebook: string | null;
  email: string | null;
  description: string | null;
}

export interface RegistrationInfo {
  in_app_enabled: boolean;
  in_person_details: string | null;
}

export interface Tournament {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  prizes: Prize[] | null;
  price_per_couple: number | null;
  registration_info: RegistrationInfo | null;
  location: string;
  kings_modality: number | null;
  points_modality: number | null;
  tournament_date: string;
  status: TournamentStatus;
  poster_url: string | null;
  latitude: number | null;
  longitude: number | null;
  contacts: Contact[] | null;
  rules: string[] | null;
}

export interface Organizer {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  logo_url: string | null;
  contacts: Contact[] | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  is_verified: boolean;
}

