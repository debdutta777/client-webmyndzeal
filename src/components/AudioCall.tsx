"use client";

import { useEffect, useState } from 'react';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  Call,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import {
  Mic,
  MicOff,
  // Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  Clock,
  User,
  Headphones,
  Activity
} from 'lucide-react';
import { initializeStreamClient, joinCall, leaveCall, toggleMicrophone } from '@/lib/stream';

interface AudioCallProps {
  appointmentId: string;
  userId: string;
  userName: string;
  userImage?: string;
  callId: string;
  isProvider?: boolean;
  providerName?: string;
  sessionType?: string;
  onEndCall?: () => void;
}

export default function AudioCall({
  appointmentId,
  userId,
  userName,
  userImage,
  callId,
  isProvider = false,
  providerName,
  sessionType = 'Consultation',
  onEndCall
}: AudioCallProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    const setupCall = async () => {
      try {
        setLoading(true);
        
        // Initialize Stream client
        const streamClient = await initializeStreamClient(userId, userName, userImage);
        setClient(streamClient);

        // Join the call using audio_room call type for audio sessions
        const audioCallType = process.env.NEXT_PUBLIC_STREAM_AUDIO_CALL_TYPE || 'audio_room';
        const streamCall = await joinCall(streamClient, callId, audioCallType);
        setCall(streamCall);
        
        // Disable camera for audio-only call
        if (streamCall.camera) {
          await streamCall.camera.disable();
        }
        
        setIsConnected(true);

        // Start call duration timer
        const startTime = Date.now();
        const timer = setInterval(() => {
          setCallDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        // Simulate audio level animation
        const audioTimer = setInterval(() => {
          setAudioLevel(Math.random() * 100);
        }, 200);

        return () => {
          clearInterval(timer);
          clearInterval(audioTimer);
        };
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

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real implementation, you would toggle the audio output here
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
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Connecting audio call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
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
        <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
          {/* Header */}
          <div className="bg-black/30 backdrop-blur-lg px-6 py-4 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Audio Call</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono">{formatDuration(callDuration)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">{sessionType}</span>
              {isConnected && (
                <span className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30">
                  Connected
                </span>
              )}
            </div>
          </div>

          {/* Main Call Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md w-full">
              {/* Profile Circle with Animation */}
              <div className="relative mb-8">
                <div className="relative w-48 h-48 mx-auto">
                  {/* Animated rings */}
                  <div className={`absolute inset-0 rounded-full border-2 border-[#8BA872]/30 animate-ping ${isMicOn ? 'opacity-75' : 'opacity-0'}`}></div>
                  <div className={`absolute inset-0 rounded-full border-2 border-[#8BA872]/20 animate-ping animation-delay-200 ${isMicOn ? 'opacity-75' : 'opacity-0'}`}></div>
                  
                  {/* Main profile circle */}
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#8BA872] to-[#73905B] flex items-center justify-center shadow-2xl">
                    {isProvider ? (
                      <Headphones className="w-24 h-24 text-white" />
                    ) : (
                      <User className="w-24 h-24 text-white" />
                    )}
                  </div>
                  
                  {/* Audio level indicator */}
                  {isMicOn && (
                    <div className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 border-4 border-gray-900">
                      <Activity 
                        className="w-6 h-6 text-green-400" 
                        style={{ opacity: 0.5 + (audioLevel / 200) }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Call Info */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {isProvider ? 'Client' : providerName || 'Provider'}
                </h2>
                <p className="text-gray-400">
                  {sessionType} Session
                </p>
                {!isMicOn && (
                  <div className="mt-3 inline-flex items-center px-3 py-1 bg-red-600/20 text-red-400 text-sm rounded-full">
                    <MicOff className="w-4 h-4 mr-2" />
                    Your microphone is muted
                  </div>
                )}
              </div>

              {/* Audio Visualizer */}
              <div className="flex items-center justify-center space-x-1 mb-8">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#8BA872] rounded-full transition-all duration-150"
                    style={{
                      height: isMicOn ? `${20 + Math.sin((audioLevel + i * 10) * 0.05) * 30}px` : '4px',
                      opacity: isMicOn ? 0.8 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-black/30 backdrop-blur-lg px-6 py-6 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-6">
              {/* Mic toggle */}
              <button
                onClick={handleToggleMic}
                className={`group relative p-5 rounded-full transition-all transform hover:scale-105 ${
                  isMicOn 
                    ? 'bg-gray-700/50 hover:bg-gray-600/50 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isMicOn ? 'Mute' : 'Unmute'}
                </span>
              </button>

              {/* Speaker toggle */}
              <button
                onClick={handleToggleSpeaker}
                className={`group relative p-5 rounded-full transition-all transform hover:scale-105 ${
                  isSpeakerOn 
                    ? 'bg-gray-700/50 hover:bg-gray-600/50 text-white' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
                </span>
              </button>

              {/* End call */}
              <button
                onClick={handleEndCall}
                className="group relative px-8 py-5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all transform hover:scale-105 flex items-center space-x-3"
              >
                <PhoneOff className="w-6 h-6" />
                <span className="font-medium">End Call</span>
              </button>
            </div>
          </div>
        </div>
      </StreamCall>
    </StreamVideo>
  );
}
