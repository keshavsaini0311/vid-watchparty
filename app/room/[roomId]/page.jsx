"use client"
import React,{useEffect, useState,use} from 'react'
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

let socket;

const page  = ({params}) => {
    const router = useRouter();
    const [playing, setPlaying] = useState(false);
    const [timestamp, setTimestamp] = useState(0);

    const {roomId} = use(params);
    const [vidurl, setVidurl] = useState('');

    useEffect(() => {
        async function getvid() {
          try {
            const response = await fetch(`/api/users/search/${roomId}`);
            const data = await response.json();
            setVidurl(data.user.vidurl);
          } catch (error) {
            console.log(error);
          }
        }
        getvid();
      }, []);      
        

      useEffect(() => {
        if (roomId) {
            socket = io();

            socket.emit('joinRoom', roomId);

            socket.on('sync', (state) => {
                setTimestamp(state.timestamp);
                setPlaying(state.playing);
            });
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, [roomId]);

    const togglePlayPause = () => {
        const newState = { timestamp, playing: !playing };
        setPlaying(newState.playing);
        socket.emit('playPause', roomId, newState);
    };

    const handleSeek = (e) => {
        const newTimestamp = e.target.value;
        setTimestamp(newTimestamp);
        socket.emit('seek', roomId, newTimestamp);
    };


  return (
    <div>
       <h1>Room: {roomId}</h1>
            <video
                src={vidurl}
                currentTime={timestamp}
                paused={!playing}
                onTimeUpdate={(e) => setTimestamp(e.target.currentTime)}
                controls
            />
            <button onClick={togglePlayPause}>
                {playing ? 'Pause' : 'Play'}
            </button>
            <input
                type="range"
                min="0"
                max="100" 
                value={timestamp}
                onChange={handleSeek}
            />
    </div>
  )
}

export default page
