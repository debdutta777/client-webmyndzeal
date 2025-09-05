"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useProvider, useProviderSlots, useProviderReviews, useBookAppointment } from '@/hooks/useSupabaseData';
import { supabase } from '@/lib/supabase';
import {
  Calendar,
  Video,
  Phone,
  MapPin,
  Star,
  ArrowLeft,
  Shield,
  Award,
  CreditCard,
  Sparkles
} from 'lucide-react';

// Types
interface Provider {
  id: string;
  name: string;
  type: 'Counsellor';
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
  sessionType: 'consultation' | 'therapy' | 'counselling';
  fee: number;
}

export default function CounsellorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { requireAuth } = useRequireAuth();
  const providerId = params.providerId as string;
  
  // Use Supabase hooks to fetch real data
  const { provider, loading: providerLoading } = useProvider(providerId);
  const { stats } = useProviderReviews(providerId);
  const [sessionType, setSessionType] = useState<'consultation' | 'counselling'>('counselling');
  const { slots, loading: slotsLoading } = useProviderSlots(providerId, sessionType);
  const { bookAppointment } = useBookAppointment();
  
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
    type: 'Counsellor',
    rating: stats.rating || 0,
    reviews: stats.count || 0,
    experience: provider.years_of_experience || 0,
    languages: provider.languages || [],
    specializations: provider.specializations || [],
    bio: provider.bio || '',
    qualifications: provider.qualifications || '',
    verified: provider.verified || false,
    fees: {
      consultation: provider.consultation_fee || 1500,
      therapy: provider.therapy_fee || 1800,
      emergency: provider.emergency_fee || 2500
    },
    image: provider.profile_image
  } : null;

  // Slots are already filtered by sessionType in the hook

  // Group slots by date
  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push({
      ...slot,
      sessionType: slot.sessionType as 'consultation' | 'therapy' | 'counselling'
    });
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const handleSlotSelect = (slot: TimeSlot) => {
    // Require authentication before booking a slot
    requireAuth(() => {
      setSelectedSlot(slot);
      setStep('booking');
    }, `/services/counselling/${providerId}`);
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
      
      // Book the appointment
      await bookAppointment({
        provider_id: providerId,
        slot_id: selectedSlot.id,
        client_id: user.id,
        appointment_date: selectedSlot.date,
        appointment_time: selectedSlot.time,
        session_type: selectedSlot.sessionType,
        session_mode: sessionMode,
        notes,
        fee: selectedSlot.fee
      });
      
      // Redirect to dashboard with success message
      router.push('/dashboard?booking=success');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
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
              <h1 className="text-3xl font-bold text-[#2D3319]">Counsellor Details</h1>
              <p className="text-gray-600 mt-1">Book your counselling session with {formattedProvider.name}</p>
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
  sessionType: 'consultation' | 'counselling';
  setSessionType: (type: 'consultation' | 'counselling') => void;
  onNext: () => void;
}

function ProviderDetailsStep({ provider, sessionType, setSessionType, onNext }: ProviderDetailsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Provider Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#8BA872] to-[#73905B] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{provider.name.split(' ').map((n: string) => n[0]).join('')}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
                {provider.verified && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 rounded-full">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600">{provider.type}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{provider.rating}</span>
                  <span className="text-gray-500">({provider.reviews} reviews)</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{provider.experience} years experience</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600 leading-relaxed">{provider.bio}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Qualifications</h3>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#8BA872]" />
              <p className="text-gray-600">{provider.qualifications}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {provider.specializations.map((spec: string) => (
                <span key={spec} className="px-3 py-1 bg-[#8BA872]/10 text-[#8BA872] rounded-full text-sm font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {provider.languages.map((lang: string) => (
                <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Session Type & Pricing */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Select Session Type</h3>
          <div className="space-y-3">
            <button
              onClick={() => setSessionType('consultation')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                sessionType === 'consultation' 
                  ? 'border-[#8BA872] bg-[#8BA872]/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Initial Consultation</div>
                  <div className="text-sm text-gray-600 mt-1">Assessment & guidance session</div>
                  <div className="text-xs text-gray-500 mt-1">45 minutes</div>
                </div>
                <div className="text-lg font-bold text-[#8BA872]">₹{provider.fees.consultation}</div>
              </div>
            </button>

            <button
              onClick={() => setSessionType('counselling')}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                sessionType === 'counselling' 
                  ? 'border-[#8BA872] bg-[#8BA872]/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Counselling Session</div>
                  <div className="text-sm text-gray-600 mt-1">In-depth counselling & support</div>
                  <div className="text-xs text-gray-500 mt-1">45-60 minutes</div>
                </div>
                <div className="text-lg font-bold text-[#8BA872]">₹{provider.fees.therapy || 1800}</div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#8BA872]/10 to-[#73905B]/10 rounded-xl p-6 border border-[#8BA872]/20">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-[#8BA872] mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Why Choose Counselling?</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Professional guidance for life challenges</li>
                <li>• Safe space to express feelings</li>
                <li>• Evidence-based therapeutic approaches</li>
                <li>• Personalized support & strategies</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full px-6 py-3 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white rounded-lg font-medium hover:shadow-md transition-all"
        >
          View Available Slots
        </button>
      </div>
    </motion.div>
  );
}

// Slots Selection Step
interface SlotsSelectionStepProps {
  provider: Provider; // Note: provider is passed but not used in this component
  groupedSlots: Record<string, TimeSlot[]>;
  sessionType: 'consultation' | 'counselling';
  onSlotSelect: (slot: TimeSlot) => void;
  onBack: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            <h2 className="text-xl font-semibold text-gray-900">Select Time Slot</h2>
            <p className="text-gray-600">Choose a convenient time for your {sessionType} session</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            Back
          </button>
        </div>

        {Object.keys(groupedSlots).length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No available slots for the selected session type</p>
            <p className="text-sm text-gray-500 mt-2">Please try a different session type or check back later</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSlots).map(([date, slots]) => (
              <div key={date}>
                <h3 className="font-medium text-gray-900 mb-3">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {(slots as TimeSlot[]).map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => onSlotSelect(slot)}
                      className="p-3 rounded-lg border-2 border-gray-200 hover:border-[#8BA872] hover:bg-[#8BA872]/5 transition-all text-center"
                    >
                      <div className="text-sm font-medium text-gray-900">{slot.time}</div>
                      <div className="text-xs text-gray-500">{slot.duration} min</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-6">
        {/* Session Mode Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">How would you like to meet?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSessionMode('video')}
              className={`p-4 rounded-lg border-2 transition-all ${
                sessionMode === 'video' 
                  ? 'border-[#8BA872] bg-[#8BA872]/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Video className={`w-6 h-6 mx-auto mb-2 ${sessionMode === 'video' ? 'text-[#8BA872]' : 'text-gray-400'}`} />
              <div className="font-medium text-gray-900">Video Call</div>
              <div className="text-xs text-gray-500 mt-1">Online session</div>
            </button>

            <button
              onClick={() => setSessionMode('audio')}
              className={`p-4 rounded-lg border-2 transition-all ${
                sessionMode === 'audio' 
                  ? 'border-[#8BA872] bg-[#8BA872]/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Phone className={`w-6 h-6 mx-auto mb-2 ${sessionMode === 'audio' ? 'text-[#8BA872]' : 'text-gray-400'}`} />
              <div className="font-medium text-gray-900">Audio Call</div>
              <div className="text-xs text-gray-500 mt-1">Voice only</div>
            </button>

            <button
              onClick={() => setSessionMode('in-person')}
              className={`p-4 rounded-lg border-2 transition-all ${
                sessionMode === 'in-person' 
                  ? 'border-[#8BA872] bg-[#8BA872]/5' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <MapPin className={`w-6 h-6 mx-auto mb-2 ${sessionMode === 'in-person' ? 'text-[#8BA872]' : 'text-gray-400'}`} />
              <div className="font-medium text-gray-900">In-Person</div>
              <div className="text-xs text-gray-500 mt-1">Clinic visit</div>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Add Notes (Optional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share any specific concerns or topics you'd like to discuss..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#8BA872]/20 focus:border-[#8BA872] outline-none resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-2">This will help your counsellor prepare for your session</p>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Counsellor:</span>
              <span className="font-medium">{provider.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date(slot.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
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
              <span className="text-gray-600">Mode:</span>
              <span className="font-medium capitalize">{sessionMode.replace('-', ' ')}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-[#8BA872] text-lg">₹{slot.fee}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white rounded-lg font-medium hover:shadow-md transition-all"
          >
            Proceed to Payment
          </button>
          <button
            onClick={onBack}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            Back to Slots
          </button>
        </div>
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
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Select Payment Method</h3>
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

            {/* Payment Form Fields */}
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
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BA872]/20 focus:border-[#8BA872] outline-none"
                />
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="text-center py-4">
                <p className="text-gray-600">You will be redirected to your wallet provider</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Counselling Session</span>
                <span className="font-medium">₹{slot.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (18%)</span>
                <span className="font-medium">₹{Math.round(slot.fee * 0.18)}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="font-bold text-[#8BA872] text-lg">₹{Math.round(slot.fee * 1.18)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={onPayment}
                disabled={processing}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${Math.round(slot.fee * 1.18)}`
                )}
              </button>
              
              <button
                onClick={onBack}
                disabled={processing}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Back to Booking
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
