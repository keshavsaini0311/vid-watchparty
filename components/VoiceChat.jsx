import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '@/app/context/SocketContext';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export default function VoiceChat({ roomId }) {
  const socket = useSocket();
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);
  const isInitiator = useRef(false);
  const reconnectAttempts = useRef(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRemoteMuted, setIsRemoteMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
      sdpSemantics: 'unified-plan',
      bundlePolicy: 'max-bundle',
      iceCandidatePoolSize: 10
    });

    pc.onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case 'connected':
          setIsConnected(true);
          break;
        case 'disconnected':
        case 'failed':
          setIsConnected(false);
          if (reconnectAttempts.current < 3) {
            reconnectAttempts.current++;
            cleanupPeerConnection();
            setupVoiceChat();
          }
          break;
        default:
          setIsConnected(false);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc_ice_candidate', roomId, event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current && event.streams[0]) {
        remoteAudioRef.current.srcObject = event.streams[0];
        setIsConnected(true);
      }
    };

    return pc;
  }, [roomId, socket]);

  const cleanupPeerConnection = useCallback(() => {
    if (peerConnection.current) {
      try {
        peerConnection.current.getSenders().forEach(sender => {
          try {
            peerConnection.current.removeTrack(sender);
          } catch (e) {}
        });
      } catch (e) {}
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      localStreamRef.current = null;
    }
    if (localAudioRef.current) {
      localAudioRef.current.srcObject = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    setIsConnected(false);
    isInitiator.current = false;
  }, []);

  const setupVoiceChat = useCallback(async () => {
    try {
      cleanupPeerConnection();
      peerConnection.current = createPeerConnection();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      localStreamRef.current = stream;
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      socket.emit('joinRoom', roomId);
    } catch (error) {
      cleanupPeerConnection();
    }
  }, [roomId, socket, cleanupPeerConnection, createPeerConnection]);

  useEffect(() => {
    let mounted = true;

    const handleOffer = async (offer) => {
      if (!peerConnection.current || !mounted) return;
      
      try {
        const offerDesc = new RTCSessionDescription(offer);
        if (peerConnection.current.signalingState !== 'stable') return;

        isInitiator.current = false;
        await peerConnection.current.setRemoteDescription(offerDesc);
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('webrtc_answer', roomId, peerConnection.current.localDescription);
      } catch (error) {
        cleanupPeerConnection();
      }
    };

    const handleAnswer = async (answer) => {
      if (!peerConnection.current || !mounted || !isInitiator.current) return;

      try {
        const answerDesc = new RTCSessionDescription(answer);
        if (peerConnection.current.signalingState !== 'have-local-offer') return;
        await peerConnection.current.setRemoteDescription(answerDesc);
      } catch (error) {
        cleanupPeerConnection();
      }
    };

    const handleIceCandidate = async (candidate) => {
      if (!peerConnection.current || !mounted) return;

      try {
        if (peerConnection.current.remoteDescription) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (error) {}
    };

    const handleUserJoined = async () => {
      if (!peerConnection.current || !mounted) return;

      try {
        if (peerConnection.current.signalingState !== 'stable') return;

        isInitiator.current = true;
        const offer = await peerConnection.current.createOffer({
          offerToReceiveAudio: true,
          voiceActivityDetection: true,
          iceRestart: true
        });

        if (!offer) return;
        await peerConnection.current.setLocalDescription(offer);
        if (!peerConnection.current.localDescription) return;
        socket.emit('webrtc_offer', roomId, peerConnection.current.localDescription);
      } catch (error) {
        cleanupPeerConnection();
        if (mounted) {
          setTimeout(setupVoiceChat, 1000);
        }
      }
    };

    socket.on('webrtc_offer', handleOffer);
    socket.on('webrtc_answer', handleAnswer);
    socket.on('webrtc_ice_candidate', handleIceCandidate);
    socket.on('user-joined', handleUserJoined);

    setupVoiceChat();

    return () => {
      mounted = false;
      socket.off('webrtc_offer', handleOffer);
      socket.off('webrtc_answer', handleAnswer);
      socket.off('webrtc_ice_candidate', handleIceCandidate);
      socket.off('user-joined', handleUserJoined);
      cleanupPeerConnection();
    };
  }, [roomId, socket, cleanupPeerConnection, setupVoiceChat]);

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
          {isConnected ? 'Connected' : 'Not Connected'}
        </span>
      </div>
      
      <audio ref={localAudioRef} autoPlay muted className="hidden" />
      <audio ref={remoteAudioRef} autoPlay className="hidden" />
    </div>
  );
}
