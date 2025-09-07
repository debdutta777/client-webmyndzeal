"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { canActivateMeeting, formatMeetingTime, getMeetingStatus, MeetingStatus } from '@/lib/stream';
import RequireAuth from '@/components/RequireAuth';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Video,
  Calendar,
  User,
  Phone
} from 'lucide-react';

// Dynamically import VideoCall and AudioCall to avoid SSR issues with Stream
const VideoCall = dynamic(() => import('@/components/VideoCall'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  )
});

const AudioCall = dynamic(() => import('@/components/AudioCall'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  )
});

interface AppointmentDetails {
  id: string;
  booking_ref: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  session_type: string;
  session_mode: string;
  status: string;
  stream_call_id: string;
  meeting_status: string;
  meeting_activated_at: string | null;
  client_id: string;
  provider_id: string;
  provider?: {
    first_name: string;
    last_name: string;
    provider_type: string;
  };
  client?: {
    first_name: string;
    last_name: string;
  };
}

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canJoin, setCanJoin] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState<MeetingStatus>(MeetingStatus.NOT_STARTED);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchAppointmentDetails();
    checkMeetingEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setCurrentUser(user);

      // Fetch appointment details
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select(`
          *,
          provider:providers(first_name, last_name, provider_type),
          client:users(first_name, last_name)
        `)
        .eq('id', appointmentId)
        .single();

      if (appointmentError || !appointmentData) {
        setError('Appointment not found');
        return;
      }

      // Resolve application user (public.users) and authorize
      const { data: appUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      const isClient = appUser?.id && appointmentData.client_id === appUser.id;
      const isProvider = false; // client-web does not support provider auth here
      if (!isClient && !isProvider) {
        setError('You are not authorized to join this session');
        return;
      }

      setAppointment(appointmentData);
      
      // Check meeting status
      const meetingDateTime = formatMeetingTime(
        new Date(appointmentData.appointment_date),
        appointmentData.start_time
      );
      
      const status = getMeetingStatus(
        appointmentData.status,
        appointmentData.meeting_status || MeetingStatus.NOT_STARTED,
        meetingDateTime
      );
      
      setMeetingStatus(status.status);
      setCanJoin(status.canJoin);
      setStatusMessage(status.message);
      
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const checkMeetingEligibility = () => {
    // Poll for meeting status updates
    const interval = setInterval(async () => {
      if (!appointment) return;
      
      const meetingDateTime = formatMeetingTime(
        new Date(appointment.appointment_date),
        appointment.start_time
      );
      
      const canActivate = canActivateMeeting(meetingDateTime, false);
      if (canActivate && !canJoin) {
        setCanJoin(true);
        setMeetingStatus(MeetingStatus.WAITING);
        setStatusMessage('Meeting room is ready');
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  };

  const activateMeeting = async () => {
    if (!appointment || !currentUser) return;
    
    try {
      // Update meeting status in database
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          meeting_status: 'active',
          meeting_activated_at: new Date().toISOString(),
          meeting_activated_by: currentUser.id
        })
        .eq('id', appointmentId);

      if (updateError) {
        throw updateError;
      }

      setMeetingStatus(MeetingStatus.ACTIVE);
      setCanJoin(true);
    } catch (err) {
      console.error('Failed to activate meeting:', err);
      setError('Failed to start meeting. Please try again.');
    }
  };

  const handleEndCall = async () => {
    if (!appointment) return;
    
    try {
      // Update appointment status
      await supabase
        .from('appointments')
        .update({
          meeting_status: 'ended',
          meeting_ended_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', appointmentId);
      
      // Redirect to dashboard
      router.push('/dashboard?session=completed');
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4FAF2] to-[#E8F4F8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#8BA872] animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4FAF2] to-[#E8F4F8] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[#8BA872] text-white rounded-lg hover:bg-[#73905B] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!appointment || !currentUser) {
    return null;
  }

  // If meeting is active and can join, show video or audio call based on session mode
  if (meetingStatus === MeetingStatus.ACTIVE && canJoin && appointment.stream_call_id) {
    const isAudioOnly = appointment.session_mode === 'audio';
    
    // Use dedicated AudioCall component for audio-only sessions
    if (isAudioOnly) {
      return (
        <RequireAuth>
          <AudioCall
            appointmentId={appointmentId}
            userId={currentUser.id}
            userName={currentUser.email || 'User'}
            userImage={undefined}
            callId={appointment.stream_call_id}
            isProvider={false}
            providerName={`${appointment.provider?.first_name} ${appointment.provider?.last_name}`}
            sessionType={appointment.session_type}
            onEndCall={handleEndCall}
          />
        </RequireAuth>
      );
    }
    
    // Use VideoCall component for video sessions
    return (
      <RequireAuth>
        <VideoCall
          appointmentId={appointmentId}
          userId={currentUser.id}
          userName={currentUser.email || 'User'}
          userImage={undefined}
          callId={appointment.stream_call_id}
          isProvider={false}
          isAudioOnly={false}
          onEndCall={handleEndCall}
        />
      </RequireAuth>
    );
  }

  // Show waiting room or status message
  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-[#F4FAF2] to-[#E8F4F8] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8">
          {/* Session Info */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#8BA872] to-[#73905B] flex items-center justify-center mx-auto mb-4">
              {appointment.session_mode === 'audio' ? (
                <Phone className="w-10 h-10 text-white" />
              ) : (
                <Video className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {appointment.session_type} Session
              {appointment.session_mode === 'audio' && ' (Audio Only)'}
            </h1>
            <p className="text-gray-600">
              with {appointment.provider?.first_name} {appointment.provider?.last_name}
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">
                    {appointment.start_time} - {appointment.end_time}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Provider</p>
                  <p className="font-medium text-gray-900">
                    {appointment.provider?.provider_type}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {appointment.session_mode === 'audio' ? (
                  <Phone className="w-5 h-5 text-gray-400" />
                ) : (
                  <Video className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-sm text-gray-600">Mode</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {appointment.session_mode === 'audio' ? 'Audio Call' : 
                     appointment.session_mode === 'video' ? 'Video Call' : 
                     'In-Person'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className={`rounded-lg p-6 text-center ${
            canJoin ? 'bg-green-50' : 'bg-yellow-50'
          }`}>
            {canJoin ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Join</h3>
                <p className="text-gray-600 mb-6">{statusMessage}</p>
                {meetingStatus === MeetingStatus.WAITING && (
                  <button
                    onClick={activateMeeting}
                    className="px-8 py-3 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white rounded-lg font-medium hover:shadow-md transition-all"
                  >
                    Start Session
                  </button>
                )}
              </>
            ) : (
              <>
                <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Waiting Room</h3>
                <p className="text-gray-600 mb-2">{statusMessage}</p>
                <p className="text-sm text-gray-500">
                  The meeting room will be available 10 minutes before your scheduled time
                </p>
              </>
            )}
          </div>

          {/* Back to Dashboard */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-[#8BA872] hover:text-[#73905B] font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
