"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  ArrowLeft,
  ArrowRight,
  Check,
  Shield,
  MessageCircle,
  Heart,
  AlertCircle,
  CreditCard,
  X
} from 'lucide-react';

// Types
interface CalendarSlot {
  date: string;
  time: string;
  available: boolean;
  isEmergency?: boolean;
}

interface ListeningTier {
  key: string;
  title: string;
  price: number;
  duration: number;
  service: string;
  description: string;
}

export default function ListeningBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tier = searchParams.get('tier') || 'active';
  
  const [step, setStep] = useState<'details' | 'calendar' | 'booking' | 'payment'>('details');
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null);
  const [sessionMode, setSessionMode] = useState<'audio'>('audio'); // Only audio for listening
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [message, setMessage] = useState('');
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isEmergency, setIsEmergency] = useState(false);

  // Tier configurations
  const tiers: Record<string, ListeningTier> = {
    active: {
      key: 'active',
      title: 'Active Listener Support',
      price: 99,
      duration: 45,
      service: 'Active Listener Support',
      description: 'Compassionate listeners available whenever you need a safe space to share your thoughts and feelings.'
    },
    empathetic: {
      key: 'empathetic',
      title: 'Empathetic Listeners',
      price: 149,
      duration: 45,
      service: 'Empathetic Listeners',
      description: 'Deep emotional connection with understanding and compassion to help you navigate your emotions.'
    },
    communicators: {
      key: 'communicators',
      title: 'Effective Communicators',
      price: 199,
      duration: 45,
      service: 'Effective Communicators',
      description: 'Meaningful and constructive interactions to help you articulate thoughts and feelings with valuable feedback.'
    }
  };

  const currentTier = tiers[tier];
  const languages = ['English', 'Hindi', 'Bengali', 'Gujarati', 'Tamil', 'Telugu'];

  // Generate available calendar slots
  const generateCalendarSlots = (): CalendarSlot[] => {
    const slots: CalendarSlot[] = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate time slots every 30 minutes from 24*7 availability
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const slotDateTime = new Date(date);
          slotDateTime.setHours(hour, minute, 0, 0);
          
          // Check if slot is available based on booking rules
          const hoursFromNow = (slotDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
          const minHours = isEmergency ? 1 : 6; // Emergency: 1 hour, Normal: 6 hours
          
          slots.push({
            date: dateStr,
            time,
            available: hoursFromNow >= minHours && Math.random() > 0.1, // 90% availability for 24*7 service
            isEmergency
          });
        }
      }
    }
    
    return slots;
  };

  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>([]);

  useEffect(() => {
    setCalendarSlots(generateCalendarSlots());
  }, [isEmergency]);

  const handleSlotSelect = (slot: CalendarSlot) => {
    setSelectedSlot(slot);
    setStep('booking');
  };

  const handleBooking = () => {
    setStep('payment');
  };

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setProcessing(false);
    
    // Redirect to dashboard with success message
    router.push('/dashboard?booking=success&type=listening');
  };

  // Calendar helpers
  const daysInMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1).getDay();
  const today = new Date().toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    handleSlotSelect({ date: selectedDate, time, available: true, isEmergency });
  };

  const getDateSlots = (date: string) => {
    return calendarSlots.filter((slot: CalendarSlot) => slot.date === date && slot.available);
  };

  const timeSlots = selectedDate ? getDateSlots(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FAF2] to-[#E8F4F8] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => {
                if (step === 'details') router.back();
                else if (step === 'calendar') setStep('details');
                else if (step === 'booking') setStep('calendar');
                else if (step === 'payment') setStep('booking');
              }}
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#2D3319]">Book Listening Session</h1>
              <p className="text-gray-600 mt-1">{currentTier.title} - Anonymous & Confidential</p>
            </div>
          </div>
        </div>

        {step === 'details' && (
          <DetailsStep 
            tier={currentTier}
            languages={languages}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            message={message}
            setMessage={setMessage}
            isEmergency={isEmergency}
            setIsEmergency={setIsEmergency}
            onNext={() => setStep('calendar')}
          />
        )}

        {step === 'calendar' && (
          <CalendarStep
            tier={currentTier}
            currentMonth={currentCalendarMonth}
            setCurrentMonth={setCurrentCalendarMonth}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            handleDateSelect={handleDateSelect}
            handleTimeSelect={handleTimeSelect}
            timeSlots={timeSlots}
            daysInMonth={daysInMonth}
            firstDayOfMonth={firstDayOfMonth}
            today={today}
            getDateSlots={getDateSlots}
            isEmergency={isEmergency}
          />
        )}

        {step === 'booking' && selectedSlot && (
          <BookingDetailsStep
            tier={currentTier}
            slot={selectedSlot}
            sessionMode={sessionMode}
            setSessionMode={setSessionMode}
            selectedLanguage={selectedLanguage}
            message={message}
            isEmergency={isEmergency}
            onConfirm={handleBooking}
            onBack={() => setStep('calendar')}
          />
        )}

        {step === 'payment' && selectedSlot && (
          <PaymentStep
            tier={currentTier}
            slot={selectedSlot}
            sessionMode={sessionMode}
            selectedLanguage={selectedLanguage}
            message={message}
            isEmergency={isEmergency}
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

// Details Step
function DetailsStep({ tier, languages, selectedLanguage, setSelectedLanguage, message, setMessage, isEmergency, setIsEmergency, onNext }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Service Details */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#8BA872] to-[#73905B] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{tier.title}</h2>
          <p className="text-lg text-[#8BA872] font-semibold">₹{tier.price} per session</p>
          <p className="text-gray-600 mt-2">{tier.duration} minutes • Anonymous & Confidential</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">24*7 Anonymous Support</h3>
              <p className="text-sm text-blue-700">
                Our listeners are available round the clock. Your session is completely anonymous and confidential - no names or personal details shared.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">About This Service</h3>
            <p className="text-gray-600 leading-relaxed">{tier.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">What to Expect</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Compassionate, non-judgmental listening
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Safe space to express your feelings
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Emotional support and validation
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Complete confidentiality
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Session Type */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setIsEmergency(false)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              !isEmergency
                ? 'border-[#8BA872] bg-[#8BA872]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Heart className={`w-6 h-6 mb-2 ${!isEmergency ? 'text-[#8BA872]' : 'text-gray-400'}`} />
            <div className="font-medium text-gray-900">Regular Session</div>
            <div className="text-sm text-gray-600 mb-2">Scheduled support session</div>
            <div className="text-xs text-gray-500">Book 6+ hours in advance</div>
          </button>

          <button
            onClick={() => setIsEmergency(true)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              isEmergency
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <AlertCircle className={`w-6 h-6 mb-2 ${isEmergency ? 'text-red-500' : 'text-gray-400'}`} />
            <div className="font-medium text-gray-900">Emergency Session</div>
            <div className="text-sm text-gray-600 mb-2">Immediate emotional support</div>
            <div className="text-xs text-gray-500">Book 1+ hour in advance</div>
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Preferred Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languages.map((language: string) => (
            <button
              key={language}
              onClick={() => setSelectedLanguage(language)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                selectedLanguage === language
                  ? 'border-[#8BA872] bg-[#8BA872]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{language}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Optional Message */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Brief Message (Optional)</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share what's on your mind or what kind of support you're looking for..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BA872]/20 focus:border-[#8BA872] outline-none resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-900 mt-2">{message.length}/500 characters</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white rounded-lg font-medium hover:shadow-md transition-all"
        >
          Choose Date & Time
        </button>
      </div>
    </motion.div>
  );
}

// Calendar Step
function CalendarStep({ tier, currentMonth, setCurrentMonth, selectedDate, selectedTime, handleDateSelect, handleTimeSelect, timeSlots, daysInMonth, firstDayOfMonth, today, getDateSlots, isEmergency }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Select Date & Time</h2>
            <p className="text-gray-600">All sessions are completely anonymous</p>
          </div>
          {isEmergency && (
            <div className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              Emergency Session
            </div>
          )}
        </div>

        <div className="mb-4 p-4 bg-[#8BA872]/5 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">Service: </span>
              <span className="text-[#8BA872] font-semibold">{tier.title}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Fee: </span>
              <span className="text-[#8BA872] font-bold">₹{tier.price}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="font-medium">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}
            
            {/* Calendar days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const date = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const hasSlots = getDateSlots(date).length > 0;
              const isToday = date === today;
              const isPast = date < today;
              const isSelected = date === selectedDate;
              
              return (
                <button
                  key={day}
                  onClick={() => !isPast && hasSlots && handleDateSelect(date)}
                  disabled={isPast || !hasSlots}
                  className={`p-2 text-center text-sm rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#8BA872] text-white'
                      : isPast
                      ? 'text-gray-300 cursor-not-allowed'
                      : hasSlots
                      ? 'hover:bg-[#8BA872]/10 text-gray-900'
                      : 'text-gray-400 cursor-not-allowed'
                  } ${isToday && !isSelected ? 'ring-2 ring-[#8BA872]/50' : ''}`}
                >
                  {day}
                  {hasSlots && !isPast && (
                    <div className={`w-1 h-1 rounded-full mx-auto mt-1 ${isSelected ? 'bg-white' : 'bg-[#8BA872]'}`}></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {selectedDate ? 'Available Times' : 'Select a date first'}
          </h3>
          
          {selectedDate ? (
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {timeSlots.map((slot: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleTimeSelect(slot.time)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedTime === slot.time
                      ? 'border-[#8BA872] bg-[#8BA872]/5'
                      : 'border-gray-200 hover:border-[#8BA872] hover:bg-[#8BA872]/5'
                  }`}
                >
                  <div className="font-medium">{slot.time}</div>
                  <div className="text-xs text-gray-500">Available</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Choose a date to see available time slots</p>
            </div>
          )}

          {selectedDate && timeSlots.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <X className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No available slots for this date</p>
              <p className="text-sm mt-1">
                {isEmergency ? 'Emergency slots must be booked 1+ hour ahead' : 'Regular slots must be booked 6+ hours ahead'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Booking Details Step
function BookingDetailsStep({ tier, slot, sessionMode, setSessionMode, selectedLanguage, message, isEmergency, onConfirm, onBack }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Session Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Session Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Service Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8BA872] to-[#73905B] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{tier.title}</h4>
                  <p className="text-gray-600">Anonymous Listening Session</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center text-sm text-blue-700">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Completely anonymous - No names or personal details shared</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Session Details</h3>
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
                <span className="font-medium">{tier.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{isEmergency ? 'Emergency' : 'Regular'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span className="font-medium">{selectedLanguage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee:</span>
                <span className="font-bold text-[#8BA872]">₹{tier.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Mode Selection - Audio Only */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">How would you like to connect?</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-lg border-2 border-[#8BA872] bg-[#8BA872]/5">
            <Phone className="w-6 h-6 mb-2 text-[#8BA872]" />
            <div className="font-medium text-gray-900">Audio Call</div>
            <div className="text-sm text-gray-600">Voice-only conversation for complete anonymity</div>
          </div>
          <div className="text-sm text-gray-500 text-center">
            <Shield className="w-4 h-4 inline mr-1" />
            Video calls are not available for listening sessions to maintain complete anonymity
          </div>
        </div>
      </div>

      {/* Message Preview */}
      {message && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Your Message</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
        >
          Back to Calendar
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
function PaymentStep({ tier, slot, sessionMode, selectedLanguage, message, isEmergency, paymentMethod, setPaymentMethod, processing, onPayment, onBack }: any) {
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
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{tier.title}</h4>
                  <p className="text-sm text-gray-600">Anonymous Listening Session</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(slot.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span>{slot.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span>{selectedLanguage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode:</span>
                  <span className="capitalize">{sessionMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span>{isEmergency ? 'Emergency' : 'Regular'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Session Fee:</span>
                <span>₹{tier.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span className="text-[#8BA872]">₹{tier.price}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={onPayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white py-3 rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing Payment...' : `Pay ₹${tier.price}`}
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
