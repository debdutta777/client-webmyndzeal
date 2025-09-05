/**
 * Stream.io Video Call Integration
 * For in-app video consultations
 */

import { StreamVideoClient, User as StreamUser, Call } from '@stream-io/video-react-sdk';

// Stream Credentials
const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || '88dje6tufhtx';
// Note: STREAM_API_SECRET should only be used server-side, not in client code
// const STREAM_API_SECRET = process.env.STREAM_API_SECRET || 'twahkzs45rwac3vj4sfh64uxcszr5wq39xd92sw7873hmzya7gskqd6r2npgjdeq';

// Stream client instance
let streamClient: StreamVideoClient | null = null;

// Initialize Stream client
export const initializeStreamClient = async (
  userId: string,
  userName: string,
  userImage?: string
): Promise<StreamVideoClient> => {
  if (streamClient) {
    return streamClient;
  }

  // Get user token from backend
  const tokenResponse = await fetch('/api/stream/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to get Stream token');
  }

  const { token } = await tokenResponse.json();

  const user: StreamUser = {
    id: userId,
    name: userName,
    image: userImage,
  };

  streamClient = new StreamVideoClient({
    apiKey: STREAM_API_KEY,
    user,
    token,
  });

  return streamClient;
};

// Create a call for appointment
export const createCall = async (
  client: StreamVideoClient,
  callId: string,
  callType: string = 'default',
  participants?: string[]
): Promise<Call> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const call = client.call(callType as any, callId);

  await call.create({
    data: {
      custom: {
        appointment_id: callId,
      },
      members: participants?.map((id) => ({ user_id: id })) || [],
    },
  });

  return call;
};

// Join an existing call
export const joinCall = async (
  client: StreamVideoClient,
  callId: string,
  callType: string = 'default'
): Promise<Call> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const call = client.call(callType as any, callId);
  await call.join();
  return call;
};

// Leave call
export const leaveCall = async (call: Call): Promise<void> => {
  await call.leave();
};

// End call (for providers/admins)
export const endCall = async (call: Call): Promise<void> => {
  await call.endCall();
};

// Get call state
export const getCallState = (call: Call) => {
  return call.state;
};

// Toggle camera
export const toggleCamera = async (call: Call): Promise<void> => {
  const currentState = call.camera.enabled;
  await call.camera[currentState ? 'disable' : 'enable']();
};

// Toggle microphone
export const toggleMicrophone = async (call: Call): Promise<void> => {
  const currentState = call.microphone.enabled;
  await call.microphone[currentState ? 'disable' : 'enable']();
};

// Share screen
export const toggleScreenShare = async (call: Call): Promise<void> => {
  const currentState = call.screenShare.enabled;
  await call.screenShare[currentState ? 'disable' : 'enable']();
};

// Check meeting activation eligibility
export const canActivateMeeting = (
  appointmentDateTime: Date,
  isAdmin: boolean = false
): boolean => {
  if (isAdmin) return true;

  const now = new Date();
  const diffInMinutes = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);
  
  // Allow activation 10 minutes before and up to 60 minutes after start time
  return diffInMinutes <= 10 && diffInMinutes >= -60;
};

// Format meeting time
export const formatMeetingTime = (date: Date, startTime: string): Date => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const meetingDateTime = new Date(date);
  meetingDateTime.setHours(hours, minutes, 0, 0);
  return meetingDateTime;
};

// Meeting status helpers
export enum MeetingStatus {
  NOT_STARTED = 'not_started',
  WAITING = 'waiting',
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled'
}

export const getMeetingStatus = (
  appointmentStatus: string,
  meetingStatus: MeetingStatus,
  appointmentDateTime: Date
): { status: MeetingStatus; canJoin: boolean; message: string } => {
  const now = new Date();
  const diffInMinutes = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60);

  if (appointmentStatus === 'cancelled') {
    return {
      status: MeetingStatus.CANCELLED,
      canJoin: false,
      message: 'This appointment has been cancelled',
    };
  }

  if (appointmentStatus === 'completed') {
    return {
      status: MeetingStatus.ENDED,
      canJoin: false,
      message: 'This session has ended',
    };
  }

  if (meetingStatus === MeetingStatus.ACTIVE) {
    return {
      status: MeetingStatus.ACTIVE,
      canJoin: true,
      message: 'Join meeting',
    };
  }

  if (meetingStatus === MeetingStatus.WAITING) {
    return {
      status: MeetingStatus.WAITING,
      canJoin: true,
      message: 'Waiting room - Meeting will start soon',
    };
  }

  if (diffInMinutes > 10) {
    return {
      status: MeetingStatus.NOT_STARTED,
      canJoin: false,
      message: `Meeting will be available ${Math.floor(diffInMinutes - 10)} minutes before start`,
    };
  }

  if (diffInMinutes <= 10 && diffInMinutes >= -60) {
    return {
      status: MeetingStatus.WAITING,
      canJoin: true,
      message: 'Meeting room is ready',
    };
  }

  return {
    status: MeetingStatus.ENDED,
    canJoin: false,
    message: 'This session has expired',
  };
};

// Cleanup on disconnect
export const disconnectStream = async (): Promise<void> => {
  if (streamClient) {
    await streamClient.disconnectUser();
    streamClient = null;
  }
};
