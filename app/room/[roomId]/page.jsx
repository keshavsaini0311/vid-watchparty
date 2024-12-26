"use client"
import React,{useEffect, useState,use,useRef} from 'react'
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

let socket;

const page  = ({params}) => {
    const router = useRouter();
    const [playing, setPlaying] = useState(false);
    const [timestamp, setTimestamp] = useState(0);

    const {roomId} =  use(params);
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


    const [volumOfVideo, setVolumOfVideo] = useState(100);
    const [durationOfVideo, setDurationOfVideo] = useState(0);
    const [currentDurationOfVideo, setCurrentDurationOfVideo] = useState(0);

    const videoRef = useRef();

    const getDurationOfVideo = () => {

        const videoIntervalTime = setInterval(() => {

            setCurrentDurationOfVideo(parseFloat(videoRef.current.currentTime));

            if (parseFloat(videoRef.current.currentTime) >= durationOfVideo)
            {

                clearVideoInterval();
            }

        }, 1000)



        const clearVideoInterval = () => {
            clearInterval(videoIntervalTime);
        }

    }

    const volumebar = (e) => {

        const valumValue = parseFloat(e.target.value) / 100;

        setVolumOfVideo(e.target.value);

        videoRef.current.volume = valumValue.toFixed(1);

    }

    const videoPlay = () => {
        videoRef.current.play();
        setDurationOfVideo(videoRef.current.duration);
        getDurationOfVideo();

    }

    const videoStop = () => {

        videoRef.current.pause();
    }

    const videoReplay= () => {
        setDurationOfVideo(videoRef.current.duration);
        videoRef.current.currentTime = 0;
        videoRef.current.play();

        getDurationOfVideo();
    }

    const videoMute = () => {

        videoRef.current.muted = true;
    }

    const videoUnMute = () => {

        videoRef.current.muted = false;
    }

    const setVideoSpeed = (e) => {

        videoRef.current.playbackRate = parseFloat(e.target.value);
    }

    const videoDuration = (e) => {

        setCurrentDurationOfVideo(parseFloat(e.target.value));
        videoRef.current.currentTime = parseFloat(e.target.value);
    }


  return (
    <div>
       <h1>Room: {roomId}</h1>
       {vidurl &&<>
            <video
                ref={videoRef}
                src={vidurl}
                
            />
            
            <div className='customVideoTagControlsClass'>
                <button onClick={videoPlay}>Play</button>
                <label>playback speed</label>
                <select onChange={ setVideoSpeed}>
                    <option value={1.0}>normal speed</option>
                    <option value={0.5}>slower</option>
                    <option value={2.0}>faster speed</option>
                </select><br />
                <button onClick={videoStop} >Stop</button><br />
                <button onClick={videoReplay}>Repaly</button><br />
                <button onClick={videoMute}>Mute</button><br />
                <button onClick={videoUnMute}>Unmute</button><br />
                <label><b>volume</b></label><input type='range' min="0" max="100" step='10' value={volumOfVideo} onChange={volumebar} /><br /><br />
                <label><b>Scrubbing Video</b></label><input type='range' min="0" max={durationOfVideo} value={currentDurationOfVideo} onChange={videoDuration} />
            </div>
          </>
       }
    </div>
  )
}

export default page
