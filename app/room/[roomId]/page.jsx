"use client"
import React,{useEffect, useState,use,useRef} from 'react'
import io from 'socket.io-client';

let socket;

const page  = ({params}) => {
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
                videoRef.current.currentTime =state.timestamp;
                setPlaying(state.playing);
                if(state.playing){videoPlay()}
                else {videostop()}
            });
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, [roomId,vidurl]);

    const videoRef = useRef();


    const videoPlay = () => {
        videoRef.current.play();        
    }
    

    const videostop=()=>{

        videoRef.current.pause();
    }


    const toggleplaying =()=>{
        const newState = { timestamp:videoRef.current.currentTime,playing:!playing };

        socket.emit('playPause',roomId,newState);
    }

  return (
    <div>
       <h1>Room: {roomId}</h1>
       {vidurl &&<>
            <video
                className='relative z-0'
                ref={videoRef}
                src={vidurl}
                onPause={toggleplaying}
                onPlay={toggleplaying}
                controls
                muted
                />
          </>
       }
    </div>
  )
}

export default page
