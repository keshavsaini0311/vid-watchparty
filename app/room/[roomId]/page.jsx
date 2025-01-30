"use client"
import React,{useEffect, useState,use,useRef} from 'react'
import { io } from 'socket.io-client';
import Message from '@/components/Mesage';
import Inputmessage from '@/components/Inputmessage';

const socket = io("http://localhost:3000", {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

const page  = ({params}) => {
    const {roomId} =  use(params);
    const [user,setUser]=useState({});
    const [vidurl, setVidurl] = useState('');
    const [playing,setPlaying]=useState(false);
    const [chatopen,setchatopen]=useState(false);
    const [messages,setMessages]=useState([]);
    const scroll=useRef()
    const videoRef = useRef();
    
    useEffect(() => {
        async function getvid() {
          try {
            const response = await fetch(`/api/users/search/${roomId}`);
            const data = await response.json();
            setVidurl(data.user.vidurl);
            const res = await fetch(`/api/me`);
            const d = await res.json();
            setUser(d);            
          } catch (error) {
            console.log(error);
          }
        }
        getvid();
      }, [roomId]); 
           
      useEffect(() => {
        if (roomId&&vidurl) {
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
        socket.on('msg', (msg) => {
          const newmsg={
            message:msg.message,
            username:msg.username,
            time:msg.time
          }
          setMessages(prevmessages=>[...prevmessages,newmsg]);    
          });  
        socket.on('newmessages', (msg) => {
          setMessages(msg);    
          });  
        }

    }, [roomId,vidurl]);

    useEffect(()=>{
      if(scroll.current&& chatopen){
        scroll.current.scrollIntoView();
      }
    },[messages])

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
    const togglechat=()=>{
      setchatopen(!chatopen);
    }


    
  return (
    <div className=' overflow-hidden w-full'>
      <div className="flex w-full justify-evenly">
       <h1>Room: {roomId}</h1>
        <button className='justify-end' onClick={togglechat}>||</button>
      </div>
       {vidurl &&<div className='flex-col flex  max-w-screen sm:w-9/12 sm:flex-row '>
          <video
              className='relative z-0 '
              ref={videoRef}
              src={vidurl}
              onPause={toggleplaying}
              onPlay={toggleplaying}
              controls
              muted
            />

          <div className={`flex-col flex items-center max-h-screen  gap-4  top-full right-0 mt-2 p-4  bg-inherit  rounded-lg transition-transform duration-300 ease-in-out transform ${chatopen ? 'translate-x-0' : 'translate-x-full sm:translate-x-96'}`}>
            <div id="msgs" className="flex-col h-96 gap-6 overflow-y-auto no-scrollbar w-full float-right">
            {messages&&
              messages.length>0&&messages.map((msg,index)=>
                <div key={index}  className="m-3">
                <Message  className='m-3' message={msg.message} username={msg.username} time={msg.time} avatar={user.avatar}/>
                </div>
              )
            }
            <div className="" ref={scroll}></div>
            </div>
            <Inputmessage user={user} roomId={roomId}/>
          
          </div>
        </div>
       }
    </div>
  )
}

export default page
