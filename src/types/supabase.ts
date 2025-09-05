// Supabase Database Types
export interface Provider {
  id: string;
  user_id: string;
  full_name: string;
  name?: string;
  email: string;
  phone: string;
  provider_type: 'psychiatrist' | 'psychologist' | 'counsellor' | 'listener';
  years_of_experience: number;
  languages: string[];
  bio: string;
  qualifications: string;
  specializations?: string[];
  verified: boolean;
  consultation_fee: number;
  therapy_fee?: number;
  emergency_fee?: number;
  profile_image?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface ProviderSpecialization {
  specialization_id: string;
  specializations?: {
    name: string;
  };
}

export interface Slot {
  id: string;
  provider_id: string;
  date: string;
  start_time: string;
  end_time?: string;
  duration_minutes: number;
  status: 'available' | 'booked' | 'blocked';
  session_type: 'consultation' | 'therapy' | 'counselling' | 'emergency';
  fee: number;
  created_at: string;
}

export interface Review {
  id: string;
  provider_id: string;
  client_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  provider_id: string;
  client_id: string;
  slot_id: string;
  appointment_date: string;
  appointment_time: string;
  session_type: string;
  session_mode: 'video' | 'audio' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  fee: number;
  created_at: string;
}

export interface TransformedProvider {
  id: string;
  name: string;
  type: string;
  image?: string;
  rating: number;
  reviews: number;
  experience: number;
  languages: string[];
  specializations: string[];
  bio: string;
  qualifications: string;
  verified: boolean;
  fees: {
    consultation: number;
    therapy?: number;
    emergency?: number;
  };
}

export interface TransformedSlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  available: boolean;
  sessionType: string;
  fee: number;
}
