"use client"
import React,{useEffect, useState,use,useRef} from 'react'
import { io } from 'socket.io-client';
import { Send } from 'lucide-react';

let socket;

const page  = ({params}) => {
    const {roomId} =  use(params);
    const [username,setUsername]=useState('');
    const [vidurl, setVidurl] = useState('');
    const [playing,setPlaying]=useState(false);
    const[chatopen,setchatopen]=useState(false);
    const [messages,setMessages]=useState([]);
    const [message,setMessage]=useState({});
    const scroll=useRef()
    
    useEffect(() => {
        async function getvid() {
          try {
            const response = await fetch(`/api/users/search/${roomId}`);
            const data = await response.json();
            
            setUsername(data.user.username);
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
        socket.on('msg', (msg) => {
          const newmsg={
            message:msg.message,
            username:msg.username
          }
          setMessages(prevmessages=>[...prevmessages,newmsg]);    
          
          });  
        
        socket.on('newmessages', (msg) => {
          setMessages(msg);    
          
          });  
        
        }
        return () => {
            if (socket) socket.disconnect();
        };
    }, [roomId,vidurl]);

    useEffect(()=>{
      if(scroll.current&& chatopen){
        scroll.current.scrollIntoView();
      }
    },[messages])

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
    const togglechat=()=>{
        setchatopen(!chatopen);
    }
    const sendmessage=()=>{
      if(message.trim()=="")return;
      const msg={
        message:message,
        username:username
      }      
      socket.emit('msg_received',roomId,msg);
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

          <div className={`flex-col items-center max-h-screen  gap-4  top-full right-0 mt-2 p-4  bg-inherit  rounded-lg transition-transform duration-300 ease-in-out transform ${chatopen ? 'translate-x-0 sm:translate-x-0' : 'translate-x-full'}`}>
            <div id="msgs" className="flex-col max-h-96 overflow-y-auto no-scrollbar w-full float-right">
            {
              messages.length>0&&messages.map((msg,index)=>
                <div key={index} ref={scroll} className="">{msg.message
                }</div>
              )
            
            }
              <div  className=""></div>
            </div>
            <div className="flex">
              <input type="text" onChange={(e)=>{setMessage(e.target.value)}} />
              <button onClick={sendmessage} className=''><Send/></button>
            </div>
          </div>
        </div>
       }
    </div>
  )
}

export default page
