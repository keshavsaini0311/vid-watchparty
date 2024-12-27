"use client"
import React,{useEffect, useState,use,useRef} from 'react'
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';

let socket;

const page  = ({params}) => {
    const router = useRouter();
    const {roomId} =  use(params);
    const [vidurl, setVidurl] = useState('');
    const [playing,setPlaying]=useState(false);
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
        if (roomId&&vidurl) {
            socket = io();

            socket.emit('joinRoom', roomId);

            socket.on('sync', (state) => {
                
                videoRef.current.currentTime =state.timestamp;
                
            });

            socket.on('play',(state)=>{
                
                setPlaying(state.playing);
                if(state.playing){videoPlay()}
                else {videostop()}
            });
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, [roomId,vidurl]);


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

    const videoPlay = () => {
        
        videoRef.current.play();
        setDurationOfVideo(videoRef.current.duration);
        
        getDurationOfVideo();
        
    }
    

    const videostop=()=>{

        videoRef.current.pause();
    }

    const videoDuration = (e) => {

        setCurrentDurationOfVideo(parseFloat(e.target.value));
        videoRef.current.currentTime = parseFloat(e.target.value);
        const newState = { timestamp: parseFloat(e.target.value), playing };
        setPlaying(newState.playing);
        
        socket.emit('seek', roomId, newState);
    }

    const toggleplaying =()=>{
        
        const newState = { timestamp:currentDurationOfVideo,playing:!playing };

        socket.emit('playPause',roomId,newState);
    }

  return (
    <div>
       <h1>Room: {roomId}</h1>
       {vidurl &&<>
            <video
                ref={videoRef}
                src={vidurl}
                controls
            />
            
            <div className='customVideoTagControlsClass'>
                <button onClick={toggleplaying}>Play</button>
                <label>playback speed</label>
                <label><b>Scrubbing Video</b></label><input type='range' min="0" max={durationOfVideo} value={currentDurationOfVideo} onChange={videoDuration} />
            </div>
          </>
       }
    </div>
  )
}

export default page
