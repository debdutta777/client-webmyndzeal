"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useProvider, useProviderSlots, useProviderReviews } from '@/hooks/useSupabaseData';
import { supabase } from '@/lib/supabase';
import { initializePayment } from '@/lib/razorpay';
import {
  Calendar,
  Video,
  Phone,
  MapPin,
  Star,
  ArrowLeft,
  Shield,
  Award,
  MessageCircle,
  Heart,
  CreditCard
} from 'lucide-react';

// Types
interface Provider {
  id: string;
  name: string;
  type: 'Psychiatrist' | 'Psychologist' | 'Counsellor';
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

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  available: boolean;
  sessionType: 'consultation' | 'therapy' | 'emergency';
  fee: number;
}

export default function ProviderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { requireAuth } = useRequireAuth();
  const providerId = params.providerId as string;
  
  // Use Supabase hooks to fetch real data
  const { provider, loading: providerLoading } = useProvider(providerId);
  const { stats } = useProviderReviews(providerId);
  const [sessionType, setSessionType] = useState<'consultation' | 'therapy' | 'emergency'>('consultation');
  const { slots, loading: slotsLoading } = useProviderSlots(providerId, sessionType);
  
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [sessionMode, setSessionMode] = useState<'video' | 'audio' | 'in-person'>('video');
  const [step, setStep] = useState<'details' | 'slots' | 'booking' | 'payment'>('details');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Transform provider data to match the component's expected format
  const formattedProvider: Provider | null = provider ? {
    id: provider.id,
    name: provider.full_name || provider.name || 'Provider',
    type: 'Psychiatrist',
    rating: stats.rating || 0,
    reviews: stats.count || 0,
    experience: provider.years_of_experience || 0,
    languages: provider.languages || [],
    specializations: provider.specializations || [],
    bio: provider.bio || '',
    qualifications: provider.qualifications || '',
    verified: provider.verified || false,
    fees: {
      consultation: provider.consultation_fee || 2500,
      therapy: provider.therapy_fee || 3000,
      emergency: provider.emergency_fee || 4000
    },
    image: provider.profile_image
  } : null;

  // Group slots by date (slots are already filtered by sessionType in the hook)
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    // Transform slot to match TimeSlot interface
    const transformedSlot: TimeSlot = {
      ...slot,
      sessionType: (slot.sessionType as 'consultation' | 'therapy' | 'emergency') || 'consultation'
    };
    acc[slot.date].push(transformedSlot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const handleSlotSelect = (slot: TimeSlot) => {
    // Require authentication before booking a slot
    requireAuth(() => {
      setSelectedSlot(slot);
      setStep('booking');
    }, `/services/psychiatrists/${providerId}`);
  };

  const handleBooking = () => {
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!selectedSlot || !formattedProvider) return;
    
    setProcessing(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch application user row to obtain users.id (required by RLS)
      const { data: appUser, error: userFetchError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, phone')
        .eq('auth_id', user.id)
        .single();
      if (userFetchError || !appUser) throw new Error('User profile not found');
      
      // Build client contact
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single();
      const clientName = profile?.full_name || user.email?.split('@')[0] || 'Guest';
      const clientEmail = profile?.email || user.email || 'guest@example.com';
      const clientPhone = profile?.phone || '9999999999';

      // Build payment intent (do NOT create appointment yet)
      const intent = {
        service: 'provider',
        provider_id: providerId,
        slot_id: selectedSlot.id,
        client_id: appUser.id,
        appointment_date: selectedSlot.date,
        start_time: selectedSlot.time,
        duration: selectedSlot.duration || 45,
        session_type: selectedSlot.sessionType,
        session_mode: sessionMode,
        client_message: notes || null,
        amount: selectedSlot.fee,
        booking_ref: `PRV-${Date.now()}`,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
      };

      await initializePayment(
        selectedSlot.fee,
        intent,
        {
          name: clientName,
          email: clientEmail,
          phone: clientPhone
        },
        async (response) => {
          // Payment successful - verify on backend
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          
          if (verifyRes.ok) {
            router.push('/dashboard?booking=success');
          } else {
            throw new Error('Payment verification failed');
          }
        },
        (error) => {
          console.error('Payment failed or cancelled:', error);
          alert('Payment cancelled. Please try again.');
          setProcessing(false);
        }
      );
      
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to initialize payment. Please try again.');
      setProcessing(false);
    }
  };

  if (providerLoading || slotsLoading || !formattedProvider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4FAF2] to-[#E8F4F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BA872]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAF2] to-[#E8F4F8] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#2D3319]">Provider Details</h1>
              <p className="text-gray-600 mt-1">Book your appointment with {formattedProvider.name}</p>
            </div>
          </div>
        </div>

        {step === 'details' && (
          <ProviderDetailsStep 
            provider={formattedProvider}
            sessionType={sessionType}
            setSessionType={setSessionType}
            onNext={() => setStep('slots')}
          />
        )}

        {step === 'slots' && (
          <SlotsSelectionStep
            provider={formattedProvider}
            groupedSlots={groupedSlots}
            sessionType={sessionType}
            onSlotSelect={handleSlotSelect}
            onBack={() => setStep('details')}
          />
        )}

        {step === 'booking' && selectedSlot && (
          <BookingDetailsStep
            provider={formattedProvider}
            slot={selectedSlot}
            sessionMode={sessionMode}
            setSessionMode={setSessionMode}
            notes={notes}
            setNotes={setNotes}
            onConfirm={handleBooking}
            onBack={() => setStep('slots')}
          />
        )}

        {step === 'payment' && selectedSlot && (
          <PaymentStep
            provider={formattedProvider}
            slot={selectedSlot}
            sessionMode={sessionMode}
            notes={notes}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            processing={processing}
            onPayment={handlePayment}
            onBack={() => setStep('booking')}
          />
        )}
      </div>
    </div>
  );
}

// Provider Details Step
interface ProviderDetailsStepProps {
  provider: Provider;
  sessionType: 'consultation' | 'therapy' | 'emergency';
  setSessionType: (type: 'consultation' | 'therapy' | 'emergency') => void;
  onNext: () => void;
}

function ProviderDetailsStep({ provider, sessionType, setSessionType, onNext }: ProviderDetailsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Provider Profile */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
      >
        <div className="flex items-start space-x-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-[#8BA872] to-[#73905B] flex items-center justify-center flex-shrink-0 shadow-lg"
          >
            {provider.image ? (
              <img 
                src={provider.image} 
                alt={provider.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-white font-bold text-4xl ${provider.image ? 'hidden' : ''}`}>
              {provider.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </motion.div>
          
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start justify-between mb-4"
            >
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2D3319] to-[#6B8E23] bg-clip-text text-transparent">
                  {provider.name}
                </h2>
                <p className="text-lg text-gray-600 mt-1">{provider.type}</p>
                {provider.verified && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="flex items-center mt-3 bg-blue-50 px-3 py-1.5 rounded-full w-fit"
                  >
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 ml-1.5 font-medium">Verified Professional</span>
                  </motion.div>
                )}
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-right bg-gradient-to-br from-yellow-50 to-orange-50 px-4 py-3 rounded-xl"
              >
                <div className="flex items-center mb-1 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(provider.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-xl font-bold ml-2 text-gray-800">{provider.rating}</span>
                </div>
                <p className="text-sm text-gray-600 font-medium">({provider.reviews} reviews)</p>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
              {[
                { icon: Award, label: `${provider.experience} years experience`, color: 'from-emerald-400 to-green-600' },
                { icon: MessageCircle, label: provider.languages.join(', '), color: 'from-blue-400 to-indigo-600' },
                { icon: Heart, label: `${provider.reviews} satisfied clients`, color: 'from-pink-400 to-rose-600' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mr-3`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-2"></span>
                Qualifications
              </h3>
              <p className="text-gray-700 leading-relaxed">{provider.qualifications}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-6"
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-1.5 h-6 bg-gradient-to-b from-[#8BA872] to-[#73905B] rounded-full mr-2"></span>
                Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider.specializations.map((spec: string, index: number) => (
                  <motion.span
                    key={spec}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.05, type: "spring" }}
                    whileHover={{ scale: 1.1 }}
                    className="px-4 py-2 bg-gradient-to-r from-[#8BA872]/20 to-[#73905B]/20 text-[#466536] text-sm font-medium rounded-full border border-[#8BA872]/30 hover:border-[#8BA872] transition-all cursor-default"
                  >
                    {spec}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-2"></span>
                About
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                {provider.bio}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Session Type Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-100"
      >
        <h3 className="text-xl font-bold bg-gradient-to-r from-[#2D3319] to-[#6B8E23] bg-clip-text text-transparent mb-6">
          Select Session Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'consultation', label: 'Consultation', desc: 'Initial assessment & diagnosis', fee: provider.fees.consultation, icon: '🩺', gradient: 'from-blue-400 to-cyan-600' },
            { key: 'therapy', label: 'Therapy Session', desc: 'Treatment & regular follow-up', fee: provider.fees.therapy, icon: '💭', gradient: 'from-purple-400 to-pink-600' },
            { key: 'emergency', label: 'Emergency', desc: 'Urgent mental health support', fee: provider.fees.emergency, icon: '🚨', gradient: 'from-red-400 to-orange-600' }
          ].filter(type => provider.fees[type.key as keyof typeof provider.fees]).map((type, index) => (
            <motion.button
              key={type.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSessionType(type.key as 'consultation' | 'therapy' | 'emergency')}
              className={`relative p-5 rounded-2xl border-2 text-left transition-all overflow-hidden ${
                sessionType === type.key
                  ? 'border-[#8BA872] bg-gradient-to-br from-[#8BA872]/10 to-[#73905B]/10 shadow-lg'
                  : 'border-gray-200 hover:border-[#8BA872]/50 bg-white hover:shadow-md'
              }`}
            >
              {sessionType === type.key && (
                <motion.div
                  layoutId="sessionSelector"
                  className="absolute inset-0 bg-gradient-to-br from-[#8BA872]/20 to-[#73905B]/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{type.icon}</span>
                  {sessionType === type.key && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-gradient-to-br from-[#8BA872] to-[#73905B] rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </div>
                <div className="font-bold text-gray-900 text-lg mb-1">{type.label}</div>
                <div className="text-sm text-gray-600 mb-3">{type.desc}</div>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r ${type.gradient}`}>
                  <span className="text-white font-bold">₹{type.fee}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="relative px-10 py-4 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
        >
          <span className="relative z-10 flex items-center">
            View Available Slots
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="ml-2"
            >
              →
            </motion.span>
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#73905B] to-[#8BA872]"
            initial={{ x: '100%' }}
            whileHover={{ x: 0 }}
            transition={{ type: "tween", duration: 0.3 }}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Slots Selection Step
interface SlotsSelectionStepProps {
  provider: Provider;
  groupedSlots: Record<string, TimeSlot[]>;
  sessionType: 'consultation' | 'therapy' | 'emergency';
  onSlotSelect: (slot: TimeSlot) => void;
  onBack: () => void;
}

function SlotsSelectionStep({ provider, groupedSlots, sessionType, onSlotSelect, onBack }: SlotsSelectionStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Available Slots</h2>
            <p className="text-gray-600">Select your preferred appointment time</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            Change Session Type
          </button>
        </div>

        <div className="mb-4 p-4 bg-[#8BA872]/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">Session Type: </span>
              <span className="capitalize text-[#8BA872] font-semibold">{sessionType}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Fee: </span>
              <span className="text-[#8BA872] font-bold">₹{provider.fees[sessionType]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSlots).map(([date, dateSlots]) => (
          <div key={date} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {dateSlots.map((slot: TimeSlot) => (
                <button
                  key={slot.id}
                  onClick={() => onSlotSelect(slot)}
                  className="p-3 rounded-lg border-2 border-gray-200 hover:border-[#8BA872] hover:bg-[#8BA872]/5 text-center transition-all"
                >
                  <div className="font-medium text-gray-900">{slot.time}</div>
                  <div className="text-xs text-gray-500">{slot.duration} min</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedSlots).length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No available slots</h3>
          <p className="text-gray-600">No slots available for the selected session type. Please try a different session type.</p>
        </div>
      )}
    </motion.div>
  );
}

// Booking Details Step
interface BookingDetailsStepProps {
  provider: Provider;
  slot: TimeSlot;
  sessionMode: 'video' | 'audio' | 'in-person';
  setSessionMode: (mode: 'video' | 'audio' | 'in-person') => void;
  notes: string;
  setNotes: (notes: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

function BookingDetailsStep({ provider, slot, sessionMode, setSessionMode, notes, setNotes, onConfirm, onBack }: BookingDetailsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Appointment Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointment Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Provider</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8BA872] to-[#73905B] flex items-center justify-center">
                <span className="text-white font-semibold">{provider.name.charAt(0)}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                <p className="text-gray-600">{provider.type}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Appointment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(slot.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{slot.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{slot.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session Type:</span>
                <span className="font-medium capitalize">{slot.sessionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee:</span>
                <span className="font-bold text-[#8BA872]">₹{slot.fee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Mode Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">How would you like to attend?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'video', label: 'Video Call', icon: Video, desc: 'Face-to-face session' },
            { key: 'audio', label: 'Audio Call', icon: Phone, desc: 'Voice-only session' },
            { key: 'in-person', label: 'In Person', icon: MapPin, desc: 'Visit clinic' }
          ].map((mode) => {
            const IconComponent = mode.icon;
            return (
              <button
                key={mode.key}
                onClick={() => setSessionMode(mode.key as 'video' | 'audio' | 'in-person')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  sessionMode === mode.key
                    ? 'border-[#8BA872] bg-[#8BA872]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <IconComponent className={`w-6 h-6 mb-2 ${sessionMode === mode.key ? 'text-[#8BA872]' : 'text-gray-400'}`} />
                <div className="font-medium text-gray-900">{mode.label}</div>
                <div className="text-sm text-gray-600">{mode.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Additional Notes (Optional)</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific concerns or topics you'd like to discuss..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BA872]/20 focus:border-[#8BA872] outline-none resize-none"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
        >
          Back to Slots
        </button>
        <button
          onClick={onConfirm}
          className="px-8 py-3 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white rounded-lg font-medium hover:shadow-md transition-all"
        >
          Proceed to Payment
        </button>
      </div>
    </motion.div>
  );
}

// Payment Step
interface PaymentStepProps {
  provider: Provider; // Provider data
  slot: TimeSlot;
  sessionMode: 'video' | 'audio' | 'in-person';
  notes: string;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  processing: boolean;
  onPayment: () => void;
  onBack: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PaymentStep({ provider, slot, sessionMode, notes, paymentMethod, setPaymentMethod, processing, onPayment, onBack }: PaymentStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Payment</h2>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { key: 'upi', label: 'UPI', icon: Phone },
                  { key: 'wallet', label: 'Wallet', icon: Shield }
                ].map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <button
                      key={method.key}
                      onClick={() => setPaymentMethod(method.key)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        paymentMethod === method.key
                          ? 'border-[#8BA872] bg-[#8BA872]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === method.key ? 'text-[#8BA872]' : 'text-gray-400'}`} />
                      <div className="text-sm font-medium">{method.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BA872]/20 focus:border-[#8BA872] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BA872]/20 focus:border-[#8BA872] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BA872]/20 focus:border-[#8BA872] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BA872]/20 focus:border-[#8BA872] outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8BA872] to-[#73905B] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">{provider.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{provider.name}</h4>
                  <p className="text-sm text-gray-600">{provider.type}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session Type:</span>
                  <span className="capitalize">{slot.sessionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(slot.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span>{slot.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="capitalize">{sessionMode}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Session Fee:</span>
                <span>₹{slot.fee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span className="text-[#8BA872]">₹{slot.fee}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={onPayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white py-3 rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing Payment...' : `Pay ₹${slot.fee}`}
              </button>
              
              <button
                onClick={onBack}
                disabled={processing}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Back to Details
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <Shield className="w-4 h-4 mr-1" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
