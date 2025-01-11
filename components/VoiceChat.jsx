import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function VoiceChat({ roomId }) {
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    const setupVoiceChat = async () => {
      // Initialize RTCPeerConnection
      peerConnection.current = new RTCPeerConnection();

      // Capture local audio
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      };

      // WebRTC Offer/Answer Handling
      socket.on('webrtc_offer', async (offer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('webrtc_answer', roomId, answer);
      });

      socket.on('webrtc_answer', async (answer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('webrtc_ice_candidate', async (candidate) => {
        if (candidate) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      // Start Call (Offer)
      socket.emit('joinRoom', roomId);
      socket.on('user-joined', async () => {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit('webrtc_offer', roomId, offer);
      });
    };

    setupVoiceChat();
  }, [roomId]);

  return (
    <div>
      <h2>Voice Chat</h2>
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}
