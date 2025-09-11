"use client";

import { useState, useEffect, useRef } from "react";

export default function TestAudioPage() {
  const [micPermission, setMicPermission] = useState<string>("unknown");
  const [cameraPermission, setCameraPermission] = useState<string>("unknown");
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [selectedOutputDevice, setSelectedOutputDevice] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isPlayingTestSound, setIsPlayingTestSound] = useState<boolean>(false);
  const [micError, setMicError] = useState<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  const [browserInfo, setBrowserInfo] = useState({
    userAgent: 'Loading...',
    webRTCSupported: false,
    mediaDevicesSupported: false,
    audioContextSupported: false
  });

  // Initialize browser info on client side only
  useEffect(() => {
    setBrowserInfo({
      userAgent: navigator.userAgent,
      webRTCSupported: typeof RTCPeerConnection !== 'undefined',
      mediaDevicesSupported: !!navigator.mediaDevices,
      audioContextSupported: typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined'
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const checkPermissions = async () => {
    try {
      // Check microphone permission
      const micPerm = await navigator.permissions.query({ name: "microphone" as PermissionName });
      setMicPermission(micPerm.state);
      
      micPerm.addEventListener('change', () => {
        setMicPermission(micPerm.state);
      });

      // Check camera permission
      const camPerm = await navigator.permissions.query({ name: "camera" as PermissionName });
      setCameraPermission(camPerm.state);
      
      camPerm.addEventListener('change', () => {
        setCameraPermission(camPerm.state);
      });
    } catch (error) {
      console.error("Error checking permissions:", error);
      setMicError("Could not check permissions. Your browser might not support this feature.");
    }
  };

  const getAudioDevices = async () => {
    try {
      setMicError("");
      
      // Request permission first with better error handling
      const tempStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Get devices after permission granted
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("All devices:", devices);
      
      const audioInputs = devices.filter(device => device.kind === "audioinput");
      const audioOutputs = devices.filter(device => device.kind === "audiooutput");
      
      console.log("Audio inputs found:", audioInputs);
      console.log("Audio outputs found:", audioOutputs);
      
      setAudioDevices(audioInputs);
      setAudioOutputDevices(audioOutputs);
      
      // Set default selections
      if (audioInputs.length > 0 && !selectedDevice) {
        setSelectedDevice(audioInputs[0].deviceId);
      }
      
      if (audioOutputs.length > 0 && !selectedOutputDevice) {
        setSelectedOutputDevice(audioOutputs[0].deviceId);
      }
      
      // Stop the temporary stream
      tempStream.getTracks().forEach(track => track.stop());
      
      if (audioInputs.length === 0) {
        setMicError("No microphone devices found. Please check your hardware connections.");
      }
    } catch (error: any) {
      console.error("Error getting audio devices:", error);
      
      if (error.name === 'NotAllowedError') {
        setMicError("Microphone permission denied. Please allow microphone access and try again.");
      } else if (error.name === 'NotFoundError') {
        setMicError("No microphone found. Please connect a microphone and try again.");
      } else if (error.name === 'NotReadableError') {
        setMicError("Microphone is being used by another application. Please close other apps and try again.");
      } else {
        setMicError(`Failed to get audio devices: ${error.message || error}`);
      }
    }
  };

  const testMicrophone = async () => {
    try {
      setMicError("");
      
      // Stop existing stream if any
      stopMicrophone();

      // Get new stream with selected device
      const constraints = {
        audio: selectedDevice ? { 
          deviceId: { exact: selectedDevice },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : true
      };
      
      console.log("Getting user media with constraints:", constraints);
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      
      // Log track settings
      const audioTrack = newStream.getAudioTracks()[0];
      console.log("Audio track settings:", audioTrack.getSettings());
      console.log("Audio track constraints:", audioTrack.getConstraints());
      console.log("Audio track capabilities:", audioTrack.getCapabilities ? audioTrack.getCapabilities() : "Not supported");

      // Set up audio level monitoring with Web Audio API
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      
      const microphone = audioContext.createMediaStreamSource(newStream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      microphone.connect(analyser);

      const checkAudioLevel = () => {
        if (!newStream.active) {
          console.log("Stream no longer active, stopping monitoring");
          return;
        }
        
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(average);
        
        // Log if we detect sound
        if (average > 10) {
          console.log("Sound detected! Level:", average);
        }
        
        animationIdRef.current = requestAnimationFrame(checkAudioLevel);
      };
      
      checkAudioLevel();
      console.log("Microphone test started successfully");
    } catch (error: any) {
      console.error("Error testing microphone:", error);
      
      if (error.name === 'NotAllowedError') {
        setMicError("Microphone permission denied. Please allow microphone access.");
      } else if (error.name === 'NotFoundError') {
        setMicError("Selected microphone not found. Please select a different device.");
      } else if (error.name === 'NotReadableError') {
        setMicError("Microphone is being used by another application.");
      } else {
        setMicError(`Failed to test microphone: ${error.message || error}`);
      }
    }
  };

  const stopMicrophone = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("Stopped track:", track.label);
      });
      setStream(null);
      setAudioLevel(0);
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const playTestSound = async () => {
    try {
      setIsPlayingTestSound(true);
      
      // Create an audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      // Create oscillator for test tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Set up a pleasant test tone (A4 note - 440Hz)
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      
      // Set volume (0.3 = 30% volume)
      gainNode.gain.value = 0.3;
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // If browser supports setSinkId (to select output device)
      if (selectedOutputDevice && 'setSinkId' in AudioContext.prototype) {
        try {
          // @ts-ignore - setSinkId might not be in TypeScript definitions
          await audioContext.setSinkId(selectedOutputDevice);
          console.log('Audio output device set to:', selectedOutputDevice);
        } catch (error) {
          console.warn('Could not set audio output device:', error);
        }
      }
      
      // Play the tone for 2 seconds
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
      
      // Reset playing state after 2 seconds
      setTimeout(() => {
        setIsPlayingTestSound(false);
        audioContext.close();
      }, 2000);
      
    } catch (error) {
      console.error('Error playing test sound:', error);
      alert(`Failed to play test sound: ${error}`);
      setIsPlayingTestSound(false);
    }
  };

  const playTestAudioFile = async () => {
    try {
      setIsPlayingTestSound(true);
      
      // Create an audio element
      const audio = new Audio();
      
      // Create a simple beep sound using data URI (base64 encoded WAV)
      const beepDataUri = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSp+zfPTfjAGHme/7+SXRgwOUp/n7bllGAYzjdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuIAUoe8vz1YIyBh1kvu7mnEoLD1Kb4+66aRgGMIjS8tGAMgUfcsLu45ZFCw9OqeTqr1oVCEGY3PLEcSEEJnnG8tiGNQYaYrns6Z9NFAxPm+LvuGsYBi+Fz/PUhTQGHG/A7OaZSQ0MSJri6rhfGAUuiM/w14kyCBllvOznnkwHDkqb4+u8axcGK4HM8NWINwUZY7rr6KJQCwxPmN/ttmkZBjeP0/PReS0GH3fH8N+NOwkUXbLq6qxZEghDlNvwx3kjBSh+yPDWgzMJH2S67+OcUQULTJng8LllGgg4jdT0z3wvBCJ0w/DilEMLEVux5+usWxYGPpXa8sNwIAUoe8rx1YI1Bxtive3mnUsKDU+a5Ou4Zhj+Mo/S89GAMwUfccPu45dGCA5Nqebor1oTCUCY3PLEcSEFJHfG8tiJNwUZYLvp659ODAVOlOLuu2sYBi+Gz/PUhDUFHG3A7uSaRwsLTJvh7bllGAYzjdT0z3wvBSJ3x+/hkEAIElyx6+yrWRUIRJve8sFsIAUqfcvw1YEyBR5kvuzjnEkNCFKc5e62YxgGMIjP89OEMwUfcsLu45RFCg1NqOXsrVcVCEGY3PLEcyAEJnjI8tiGNwUZYbrr56BODQpPmt/utmUZCDeP0/PReS0FH3bH8N+OOggTXbLq66pYFAhAmt3yxnkiBSh+yPDVhDEGHWW96+WcRw0KTprk6rdjGAU1jdTyzn4wBiF1xe7jlEQKDVKw5+usWxQIQJfa88NwJAUofsvx1oU1Bxpgvevmm0kLDU+a4+u4ZhgGNY/R89GAMgUfccTu4pdFDQxOqeXqrVkUCEGY3PLEcSMFJnfH8tiINwUZYrvs56BOCwxPm+Lvt2UYBzGM0vLRfS0FIHfH79+POwkUXbLp66tWFAlFnt7yw3IjBSh+yPDVgTEGHmS+7OScRgsNU5vj6rhfFwUwjNPy0n4yBSF0xfDglEALElux5+usWBYIQJfa88NwJAUofsrx1oU1Bxpgve3mnEkLDk+b4+u4ZhgGMo7S89GAMwcfccTt45dGCwxNqeXprlkVCECY3PLEcyQFJnfH8tiINgcZYrvr56BODApPm+Lvt2UYBzGM0vLRfS0GIHfH79+POwkUXbLp66tWFAlFnt7yw3IjBSh+yPDVgTEGHmS+7OScRgsNU5vj6rhfFwUwjNPy0n4yBSF0xfDglEALElux5+usWBYIQJfa88NwJAUofsrx1oU1Bxpgve3mnEkLDk+b4+u4ZhgGMo7S89GAMwcfccTt45dGCwxNqeXprlkVCECY3PLEcyQFJnfH8tiINgcZYrvr56BODApPm+Lvt2UYBzGM0vLRfS0GIHfH79+POwkUXbLp66tWFAlFnt7yw3IjBSh+yPDVgTE=';
      audio.src = beepDataUri;
      
      // Set output device if supported
      if (selectedOutputDevice && 'setSinkId' in audio) {
        try {
          // @ts-ignore - setSinkId might not be in TypeScript definitions
          await audio.setSinkId(selectedOutputDevice);
          console.log('Audio output set to device:', selectedOutputDevice);
        } catch (error) {
          console.warn('Could not set audio output device:', error);
        }
      }
      
      // Play the audio
      await audio.play();
      
      // Reset state when audio ends
      audio.addEventListener('ended', () => {
        setIsPlayingTestSound(false);
      });
      
    } catch (error) {
      console.error('Error playing test audio:', error);
      alert(`Failed to play test audio: ${error}`);
      setIsPlayingTestSound(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Audio & Media Test Center</h1>
        
        {/* Error Display */}
        {micError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error:</p>
            <p>{micError}</p>
          </div>
        )}
        
        {/* Permissions Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">📋 Permissions Status</h2>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">🎤 Microphone:</span>
              <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                micPermission === 'granted' ? 'bg-green-100 text-green-700' : 
                micPermission === 'denied' ? 'bg-red-100 text-red-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                {micPermission.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">📹 Camera:</span>
              <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                cameraPermission === 'granted' ? 'bg-green-100 text-green-700' : 
                cameraPermission === 'denied' ? 'bg-red-100 text-red-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                {cameraPermission.toUpperCase()}
              </span>
            </div>
          </div>
          <button 
            onClick={checkPermissions}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Check Permissions
          </button>
        </div>

        {/* Audio Devices Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🎧 Audio Devices</h2>
          <button 
            onClick={getAudioDevices}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg mb-4 transition-colors"
          >
            Detect Audio Devices
          </button>
          
          {(audioDevices.length > 0 || audioOutputDevices.length > 0) && (
            <div className="space-y-4">
              {audioDevices.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Microphone:
                  </label>
                  <select 
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {audioDevices.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Microphone ${device.deviceId.substring(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {audioOutputDevices.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Speaker/Headphones:
                  </label>
                  <select 
                    value={selectedOutputDevice}
                    onChange={(e) => setSelectedOutputDevice(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {audioOutputDevices.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Speaker ${device.deviceId.substring(0, 8)}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p>📊 Found {audioDevices.length} microphone(s) and {audioOutputDevices.length} speaker(s)</p>
              </div>
            </div>
          )}
        </div>

        {/* Microphone Test Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🎤 Microphone Test</h2>
          <div className="space-x-4 mb-4">
            <button 
              onClick={testMicrophone}
              disabled={!selectedDevice}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              Start Microphone Test
            </button>
            <button 
              onClick={stopMicrophone}
              disabled={!stream}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              Stop Microphone
            </button>
          </div>
          
          {stream && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Audio Level:</span>
                  <span className="text-sm text-gray-500">{Math.round(audioLevel)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div 
                    className={`h-6 rounded-full transition-all duration-100 ${
                      audioLevel > 50 ? 'bg-red-500' :
                      audioLevel > 30 ? 'bg-yellow-500' :
                      audioLevel > 10 ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, audioLevel)}%` }}
                  />
                </div>
              </div>
              <div className={`text-center p-3 rounded-lg ${
                audioLevel > 10 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
              }`}>
                {audioLevel > 10 ? '✅ Microphone is detecting sound!' : '🎤 Speak to test your microphone...'}
              </div>
            </div>
          )}
        </div>

        {/* Speaker/Headphones Test Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🔊 Speaker/Headphones Test</h2>
          <div className="space-y-4">
            <div className="space-x-4">
              <button 
                onClick={playTestSound}
                disabled={isPlayingTestSound}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isPlayingTestSound ? 'Playing Test Tone...' : 'Play Test Tone (440Hz)'}
              </button>
              <button 
                onClick={playTestAudioFile}
                disabled={isPlayingTestSound}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isPlayingTestSound ? 'Playing Beep...' : 'Play Beep Sound'}
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
              <p>🔊 Click a button above to test your audio output</p>
              <p>🎵 The test tone plays a 440Hz sine wave (musical note A4) for 2 seconds</p>
              <p>🎧 If you have multiple output devices, select one from the dropdown above</p>
              {typeof window !== 'undefined' && !('setSinkId' in HTMLAudioElement.prototype) && (
                <p className="text-orange-600 font-medium mt-2">
                  ⚠️ Your browser doesn't support output device selection. Audio will play through the default device.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Browser Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🌐 Browser Compatibility</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">User Agent:</span>
              <span className="text-gray-600 truncate max-w-md">{browserInfo.userAgent}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">WebRTC Support:</span>
              <span>{browserInfo.webRTCSupported ? '✅ Supported' : '❌ Not Supported'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">MediaDevices API:</span>
              <span>{browserInfo.mediaDevicesSupported ? '✅ Supported' : '❌ Not Supported'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">AudioContext API:</span>
              <span>{browserInfo.audioContextSupported ? '✅ Supported' : '❌ Not Supported'}</span>
            </div>
          </div>
          
          {/* Troubleshooting Tips */}
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">💡 Troubleshooting Tips:</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Make sure your microphone/speakers are properly connected</li>
              <li>Check that no other application is using your microphone</li>
              <li>Try refreshing the page if devices don't appear</li>
              <li>Grant permission when browser asks for microphone access</li>
              <li>For best results, use Chrome, Edge, or Firefox browsers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
