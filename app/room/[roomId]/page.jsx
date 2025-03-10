"use client"
import React,{useEffect, useState,use,useRef} from 'react'
import { io } from 'socket.io-client';
import Message from '@/components/Mesage';
import Inputmessage from '@/components/Inputmessage';
import VoiceChat from '@/components/VoiceChat';
import { MessageCircle, X, Copy, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const socket = io("http://localhost:3000", {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

const page = ({params}) => {
    const {roomId} =  use(params);
    const [user,setUser]=useState({});
    const [vidurl, setVidurl] = useState('');
    const [playing,setPlaying]=useState(false);
    const [chatopen,setchatopen]=useState(false);
    const [messages,setMessages]=useState([]);
    const [copied, setCopied] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const scroll=useRef();
    const videoRef = useRef();
    const { toast } = useToast();
    
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
            if (!chatopen) {
              setUnreadCount(prev => prev + 1);
            }
          });  
          socket.on('newmessages', (msg) => {
            setMessages(msg);    
          });  
        }
      }, [roomId,vidurl, chatopen]);

    useEffect(()=>{
      if(scroll.current&& chatopen){
        scroll.current.scrollIntoView({ behavior: 'smooth' });
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
      if (chatopen) {
        setUnreadCount(0);
      }
    }

    const copyRoomId = async () => {
      try {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
        toast({
          title: "Room ID copied!",
          description: "Share this with friends to watch together.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Please try again.",
        });
      }
    };
    
  return (
    <div className='flex h-screen bg-background overflow-hidden'>
      <div className='flex-1 flex flex-col relative'>
        <div className="flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 bg-card">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">Room: {roomId}</h1>
            <button
              onClick={copyRoomId}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              title="Copy Room ID"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <button 
            onClick={togglechat}
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors relative"
            title={chatopen ? "Close Chat" : "Open Chat"}
          >
            {chatopen ? <X size={20} /> : <MessageCircle size={20} />}
            {!chatopen && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex-1 flex relative">
          <div className="flex-1 flex items-center justify-center bg-black">
            {vidurl && (
              <video
                className='h-[calc(100vh-3.5rem)] w-full object-contain'
                ref={videoRef}
                src={vidurl}
                onPause={toggleplaying}
                onPlay={toggleplaying}
                controls
                muted
              />
            )}
          </div>

          <div 
            className={`fixed md:static inset-0 md:w-[400px] lg:w-[450px] bg-card border-l border-border flex flex-col transition-transform duration-300 ease-in-out ${
              chatopen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
            }`}
            style={{ height: 'calc(100vh - 3rem)' }}
          >
            {/* Mobile chat header */}
            <div className="md:hidden flex items-center justify-between px-4 py-2 bg-accent/50 border-b border-border">
              <h2 className="text-lg font-medium text-foreground">Chat</h2>
              <button 
                onClick={togglechat}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
                {messages && messages.length > 0 && messages.map((msg, index) => (
                  <div key={index}>
                    <Message message={msg.message} username={msg.username} time={msg.time} avatar={user.avatar}/>
                  </div>
                ))}
                <div ref={scroll}></div>
              </div>
              
              <div className="p-3 space-y-3 border-t border-border bg-card">
                <VoiceChat roomId={roomId} />
                <Inputmessage user={user} roomId={roomId}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
