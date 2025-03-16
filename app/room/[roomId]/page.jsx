"use client"
import React, { useEffect, useState ,use} from 'react'
import { useSocket } from '@/app/context/SocketContext';
import { useToast } from "@/components/ui/use-toast";
import RoomHeader from '@/components/RoomHeader';
import VideoPlayer from '@/components/VideoPlayer';
import ChatPanel from '@/components/ChatPanel';
import { useRouter } from 'next/navigation';

const page = ({params}) => {
    const socket = useSocket();
    const {roomId} = use(params);
    const [user, setUser] = useState({});
    const [vidurl, setVidurl] = useState('');
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [chatopen, setchatopen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [copied, setCopied] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isroom, setIsroom] = useState(false);
    const { toast } = useToast();
    const router = useRouter();


    useEffect(() => {
        async function getuser() {
          try {
            // Get current user information
            const res = await fetch(`/api/me`);
            const d = await res.json();
            if(d.success){
              setUser(d.user);            
            }else{
              console.log(d.error);
            }
          } catch (error) {
            console.log(error);
          }
        }
        getuser();
    }, [socket, roomId]); 
           
    useEffect(() => {
        if (!socket || !roomId ) return;

        // Join room
        
        socket.emit('joinRoom', roomId);
        // Setup event listeners
        const handleSync = (state) => {
            setPlaying(state.playing);
            setCurrentTime(state.timestamp);
        };

        const handlePlay = (state) => {
            setPlaying(state.playing);
            setCurrentTime(state.timestamp);
        };

        const handleMessage = (msg) => {
            const newmsg = {
                message: msg.message,
                username: msg.username,
                time: msg.time
            };
            setMessages(prevMessages => [...prevMessages, newmsg]);
            if (!chatopen) {
                setUnreadCount(prev => prev + 1);
            }
        };

        const handleNewMessages = (msgs) => {
            setMessages(msgs);
        };

        // Add event listeners
        socket.on('sync', handleSync);
        socket.on('play', handlePlay);
        socket.on('msg', handleMessage);
        socket.on('newmessages', handleNewMessages);
        socket.on('roomInfo', handleRoomInfo);
        socket.on('noroom', handleNoRoom);

        // Cleanup function
        return () => {
            socket.off('sync', handleSync);
            socket.off('play', handlePlay);
            socket.off('msg', handleMessage);
            socket.off('roomInfo', handleRoomInfo);
            socket.off('noroom', handleNoRoom);
            socket.off('newmessages', handleNewMessages);
        };
    }, [socket, roomId, vidurl, chatopen]);

    const handlePlay = (timestamp) => {
        const newState = { timestamp, playing: true };
        socket.emit('playPause', roomId, newState);
    };

    const handleRoomInfo = (roomInfo) => {
        setVidurl(roomInfo.vidurl);
        setIsroom(true);
    };

    const handleNoRoom = () => {
        setIsroom(false);
        toast({
            title: "Room not found",
            description: "Please try again.",
        });
        router.push('/');
    };

    const handlePause = (timestamp) => {
        const newState = { timestamp, playing: false };
        socket.emit('playPause', roomId, newState);
    };

    const toggleChat = () => {
        setchatopen(!chatopen);
        if (!chatopen) {
            setUnreadCount(0);
        }
    };

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
        <>
        {!isroom?
        <div className='loading-container'>
            <div className='loading-spinner'></div>
        </div>
        :
        <div className='flex h-screen bg-background overflow-hidden'>
            <div className='flex-1 flex flex-col relative'>
                <RoomHeader 
                    roomId={roomId}
                    chatopen={chatopen}
                    unreadCount={unreadCount}
                    onToggleChat={toggleChat}
                    onCopyRoomId={copyRoomId}
                    copied={copied}
                    />
                
                <div className="flex-1 flex relative">
                    <VideoPlayer 
                        vidurl={vidurl}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        playing={playing}
                        currentTime={currentTime}
                        />

                    <ChatPanel 
                        chatopen={chatopen}
                        messages={messages}
                        user={user}
                        roomId={roomId}
                        onToggleChat={toggleChat}
                        />
                </div>
            </div>
        </div>}
        </>
    );
};

export default page;
