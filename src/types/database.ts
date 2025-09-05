/**
 * Client Web - Database Types
 * Types for client application interfacing with Supabase
 * Uses British English spelling throughout
 */

// ============================================
// ENUMS
// ============================================

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin'
}

export enum ProviderType {
  COUNSELLOR = 'counsellor',
  PSYCHOLOGIST = 'psychologist',
  PSYCHIATRIST = 'psychiatrist',
  LISTENER = 'listener'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

export enum ProviderStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive'
}

export enum SlotStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum SessionMode {
  ONLINE = 'online',
  IN_PERSON = 'in_person'
}

export enum SessionType {
  CONSULTATION = 'consultation',
  THERAPY = 'therapy',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  REGULAR = 'regular'
}

export enum ListenerSessionType {
  ACTIVE_SUPPORT = 'active_support',
  EMPATHETIC = 'empathetic',
  EFFECTIVE_COMMUNICATORS = 'effective_communicators'
}

// ============================================
// DATABASE TYPES
// ============================================

export interface User {
  id: string;
  auth_id: string;
  email: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  status: UserStatus;
  profile_image?: string;
  date_of_birth?: Date | string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Provider {
  id: string;
  auth_id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  provider_type: ProviderType;
  status: ProviderStatus;
  registration_number?: string;
  profile_image?: string;
  bio?: string;
  experience_years?: number;
  specializations: string[];
  languages: string[];
  practice_modes: string[];
  clinic_address?: string;
  default_fee?: number;
  default_duration?: number;
  rating: number;
  total_reviews: number;
  created_at: Date | string;
  updated_at: Date | string;
  verified_at?: Date | string;
  verified_by?: string;
}

export interface Slot {
  id: string;
  provider_id: string;
  date: Date | string;
  start_time: string;
  end_time: string;
  session_type: SessionType;
  session_mode: SessionMode;
  duration: number;
  base_fee: number;
  platform_fee: number;
  video_fee: number;
  total_fee: number;
  status: SlotStatus;
  is_booked: boolean;
  approved_by?: string;
  approved_at?: Date | string;
  admin_notes?: string;
  created_at: Date | string;
  updated_at: Date | string;
  provider?: Provider;
}

export interface Appointment {
  id: string;
  booking_ref: string;
  client_id?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  provider_id?: string;
  slot_id?: string;
  appointment_date: Date | string;
  start_time: string;
  end_time: string;
  duration: number;
  session_type?: SessionType;
  session_mode?: SessionMode;
  listener_session_type?: ListenerSessionType;
  is_emergency: boolean;
  preferred_language?: string;
  client_message?: string;
  status: AppointmentStatus;
  amount: number;
  payment_status: PaymentStatus;
  payment_id?: string;
  meeting_link?: string;
  meeting_password?: string;
  provider_notes?: string;
  admin_notes?: string;
  assigned_by?: string;
  assigned_at?: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  completed_at?: Date | string;
  cancelled_at?: Date | string;
  cancelled_by?: string;
  cancellation_reason?: string;
  client?: User;
  provider?: Provider;
  slot?: Slot;
}

export interface Payment {
  id: string;
  appointment_id: string;
  client_id?: string;
  provider_id?: string;
  amount: number;
  currency: string;
  gateway?: string;
  transaction_id?: string;
  payment_method?: string;
  status: PaymentStatus;
  base_amount?: number;
  platform_fee?: number;
  video_fee?: number;
  tax_amount?: number;
  refund_amount?: number;
  refund_reason?: string;
  refunded_at?: Date | string;
  created_at: Date | string;
  completed_at?: Date | string;
}

export interface Review {
  id: string;
  appointment_id: string;
  provider_id: string;
  client_id?: string;
  rating: number;
  review_text?: string;
  is_anonymous: boolean;
  is_published: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface AppointmentBookingRequest {
  provider_id?: string;
  slot_id?: string;
  listener_session_type?: ListenerSessionType;
  appointment_date?: string;
  start_time?: string;
  duration?: number;
  is_emergency?: boolean;
  session_mode?: SessionMode;
  preferred_language?: string;
  client_message?: string;
  amount: number;
}

export interface ListenerBookingRequest {
  listener_session_type: ListenerSessionType;
  appointment_date: string;
  start_time: string;
  duration: number;
  is_emergency: boolean;
  preferred_language: string;
  client_message?: string;
  amount: number;
}

export interface SlotSearchFilters {
  provider_id?: string;
  provider_type?: ProviderType;
  date_from?: string;
  date_to?: string;
  session_type?: SessionType;
  session_mode?: SessionMode;
  min_price?: number;
  max_price?: number;
  specialization?: string;
  language?: string;
}

// ============================================
// UTILITY TYPES & CONSTANTS
// ============================================

export interface FeeBreakdown {
  base_fee: number;
  platform_fee: number;
  video_fee: number;
  total_fee: number;
}

export const calculateFees = (baseFee: number, isVideo: boolean = false): FeeBreakdown => {
  const platformFee = baseFee * 0.20;
  const videoFee = isVideo ? 50 : 0;
  const totalFee = baseFee + platformFee + videoFee;
  
  return {
    base_fee: baseFee,
    platform_fee: platformFee,
    video_fee: videoFee,
    total_fee: totalFee
  };
};

// Listener session pricing (fixed prices in INR)
export const LISTENER_PRICING = {
  [ListenerSessionType.ACTIVE_SUPPORT]: 99,
  [ListenerSessionType.EMPATHETIC]: 149,
  [ListenerSessionType.EFFECTIVE_COMMUNICATORS]: 199
};

// Booking time constraints (in hours)
export const BOOKING_CONSTRAINTS = {
  REGULAR_ADVANCE_HOURS: 6,
  EMERGENCY_ADVANCE_HOURS: 1,
};
