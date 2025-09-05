// Type definitions for MyndZeal Client Web Application

// User Types
export type AccountType = 'individual' | 'business' | 'school';

export interface User {
  id: string;
  email: string;
  accountType: AccountType;
  firstName?: string;
  lastName?: string;
  phone?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Provider Types for listing/viewing
export type ProviderType = 'counsellor' | 'listener' | 'psychologist' | 'psychiatrist';

export interface ProviderProfile {
  id: string;
  type: ProviderType;
  firstName: string;
  lastName: string;
  profileImage?: string;
  degree?: string;
  specializations: string[];
  experience: number;
  languages: string[];
  bio: string;
  rating?: number;
  totalReviews?: number;
  hourlyRate: number;
  availableForEmergency: boolean;
  nextAvailableSlot?: string;
}

// Appointment Types
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type AppointmentMode = 'video' | 'audio' | 'in_person';
export type AppointmentType = 'consultation' | 'therapy' | 'counselling' | 'emergency' | 'follow_up';

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  mode: AppointmentMode;
  type: AppointmentType;
  status: AppointmentStatus;
  fee: number;
  isPaid: boolean;
  meetingLink?: string;
  location?: string;
  notes?: string;
  createdAt: string;
}

// Service Types
export type ServiceCategory = 'counselling' | 'listening' | 'psychology' | 'psychiatry';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  duration: number;
  minPrice: number;
  maxPrice: number;
  features: string[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Constants
export const CURRENCY_SYMBOL = '₹';
