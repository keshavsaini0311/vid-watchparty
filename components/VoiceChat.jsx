import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const socket = io('http://localhost:3000');

export default function VoiceChat({ roomId }) {
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRemoteMuted, setIsRemoteMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const setupVoiceChat = async () => {
      try {
        // Initialize RTCPeerConnection
        peerConnection.current = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ]
        });

        // Capture local audio
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = localStream;
        localAudioRef.current.srcObject = localStream;

        // Add audio stream to peer connection
        localStream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, localStream);
        });

        // Handle ICE Candidate
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('webrtc_ice_candidate', roomId, event.candidate);
          }
        };

        // Handle Remote Stream
        peerConnection.current.ontrack = (event) => {
          remoteAudioRef.current.srcObject = event.streams[0];
          setIsConnected(true);
        };

        // WebRTC Offer/Answer Handling
        socket.on('webrtc_offer', async (offer) => {
          try {
            if (peerConnection.current.signalingState === 'stable') {
              await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
              const answer = await peerConnection.current.createAnswer();
              await peerConnection.current.setLocalDescription(answer);
              socket.emit('webrtc_answer', roomId, answer);
            } else {
              console.log('Ignoring offer - connection not in stable state');
            }
          } catch (error) {
            console.error('Error handling offer:', error);
          }
        });

        socket.on('webrtc_answer', async (answer) => {
          try {
            if (peerConnection.current.signalingState === 'have-local-offer') {
              await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
            } else {
              console.log('Ignoring answer - connection not in have-local-offer state');
            }
          } catch (error) {
            console.error('Error handling answer:', error);
          }
        });

        socket.on('webrtc_ice_candidate', async (candidate) => {
          try {
            if (candidate && peerConnection.current.remoteDescription) {
              await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        });

        // Join room and handle new user joining
        socket.emit('joinRoom', roomId);
        socket.on('user-joined', async () => {
          try {
            if (peerConnection.current.signalingState === 'stable') {
              const offer = await peerConnection.current.createOffer();
              await peerConnection.current.setLocalDescription(offer);
              socket.emit('webrtc_offer', roomId, offer);
            }
          } catch (error) {
            console.error('Error creating offer:', error);
          }
        });

      } catch (error) {
        console.error('Error setting up voice chat:', error);
      }
    };

    setupVoiceChat();

    return () => {
      // Cleanup
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [roomId]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleRemoteAudio = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !remoteAudioRef.current.muted;
      setIsRemoteMuted(!isRemoteMuted);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className={`p-2 rounded-full transition-colors ${
            isMuted ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
          } hover:bg-opacity-30`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <button
          onClick={toggleRemoteAudio}
          className={`p-2 rounded-full transition-colors ${
            isRemoteMuted ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
          } hover:bg-opacity-30`}
          title={isRemoteMuted ? 'Unmute Others' : 'Mute Others'}
        >
          {isRemoteMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={`text-sm ${isConnected ? 'text-green-500' : 'text-muted-foreground'}`}>
          {isConnected ? 'Connected' : 'Waiting...'}
        </span>
      </div>
      
      <audio ref={localAudioRef} autoPlay muted className="hidden" />
      <audio ref={remoteAudioRef} autoPlay className="hidden" />
    </div>
  );
}
