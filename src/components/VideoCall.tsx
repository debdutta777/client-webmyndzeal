"use client";

import { useEffect, useState } from 'react';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  Call,
  SpeakerLayout,
  CallParticipantsList,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Monitor,
  Users,
  Loader2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { initializeStreamClient, joinCall, leaveCall, toggleCamera, toggleMicrophone, toggleScreenShare } from '@/lib/stream';

interface VideoCallProps {
  appointmentId: string;
  userId: string;
  userName: string;
  userImage?: string;
  callId: string;
  isProvider?: boolean;
  isAudioOnly?: boolean;
  onEndCall?: () => void;
}

export default function VideoCall({
  appointmentId,
  userId,
  userName,
  userImage,
  callId,
  isProvider = false,
  isAudioOnly = false,
  onEndCall
}: VideoCallProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(!isAudioOnly); // Camera off for audio-only calls
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const setupCall = async () => {
      try {
        setLoading(true);
        
        // Initialize Stream client
        const streamClient = await initializeStreamClient(userId, userName, userImage);
        setClient(streamClient);

        // Join the call
        const streamCall = await joinCall(streamClient, callId, 'default');
        setCall(streamCall);
        
        // For audio-only calls, disable camera immediately
        if (isAudioOnly && streamCall.camera) {
          await streamCall.camera.disable();
        }

        // Start call duration timer
        const startTime = Date.now();
        const timer = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(timer);
      } catch (err) {
        console.error('Failed to setup call:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to call');
      } finally {
        setLoading(false);
      }
    };

    setupCall();

    // Cleanup on unmount
    return () => {
      if (call) {
        leaveCall(call).catch(console.error);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, userId, userName, userImage, callId]);

  const handleToggleMic = async () => {
    if (call) {
      await toggleMicrophone(call);
      setIsMicOn(!isMicOn);
    }
  };

  const handleToggleCamera = async () => {
    if (call && !isAudioOnly) { // Prevent camera toggle in audio-only mode
      await toggleCamera(call);
      setIsCameraOn(!isCameraOn);
    }
  };

  const handleToggleScreenShare = async () => {
    if (call) {
      await toggleScreenShare(call);
      setIsScreenSharing(!isScreenSharing);
    }
  };

  const handleEndCall = async () => {
    if (call) {
      await leaveCall(call);
      if (onEndCall) {
        onEndCall();
      }
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Connecting to session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#8BA872] text-white rounded-lg hover:bg-[#73905B] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!client || !call) {
    return null;
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="h-screen bg-gray-900 flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">
                  {isAudioOnly ? 'Audio Session' : 'Video Session'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatDuration(callDuration)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Session ID: {appointmentId.slice(0, 8)}</span>
              {isProvider && (
                <span className="px-3 py-1 bg-[#8BA872] text-white text-xs rounded-full">
                  Provider
                </span>
              )}
            </div>
          </div>

          {/* Main video/audio area */}
          <div className="flex-1 relative bg-gray-900 overflow-hidden">
            {isAudioOnly ? (
              // Audio-only interface
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#8BA872] to-[#73905B] flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Phone className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-2">Audio Call in Progress</h2>
                  <p className="text-gray-400">
                    {isProvider ? 'Connected with Client' : 'Connected with Provider'}
                  </p>
                </div>
              </div>
            ) : (
              // Video interface
              <SpeakerLayout />
            )}
            
            {/* Participant sidebar */}
            {showParticipants && (
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 p-4 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Participants</h3>
                  <button
                    onClick={() => setShowParticipants(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center justify-center space-x-4">
              {/* Mic toggle */}
              <button
                onClick={handleToggleMic}
                className={`p-4 rounded-full transition-all ${
                  isMicOn 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Camera toggle - hidden for audio-only calls */}
              {!isAudioOnly && (
                <button
                  onClick={handleToggleCamera}
                  className={`p-4 rounded-full transition-all ${
                    isCameraOn 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              )}

              {/* Screen share - hidden for audio-only calls */}
              {!isAudioOnly && (
                <button
                  onClick={handleToggleScreenShare}
                  className={`p-4 rounded-full transition-all ${
                    isScreenSharing 
                      ? 'bg-[#8BA872] hover:bg-[#73905B] text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <Monitor className="w-5 h-5" />
                </button>
              )}

              {/* Participants */}
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-all"
              >
                <Users className="w-5 h-5" />
              </button>

              {/* End call */}
              <button
                onClick={handleEndCall}
                className="px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all flex items-center space-x-2"
              >
                <PhoneOff className="w-5 h-5" />
                <span className="font-medium">End Call</span>
              </button>
            </div>
          </div>
        </div>
      </StreamCall>
    </StreamVideo>
  );
}
