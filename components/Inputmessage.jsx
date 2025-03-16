import React, { useState } from 'react'
import { Send } from 'lucide-react';
import { useSocket } from '@/app/context/SocketContext';

export default function Inputmessage(props) {
    const socket = useSocket();
    const [message, setMessage] = useState("");
    const user = props.user;
    const roomId = props.roomId;

    const sendmessage = (e) => {
        e.preventDefault();
        if (message.trim() === "") return;
        
        const msg = {
            message: message,
            username: user.username,
            time: new Date().toLocaleTimeString(),
            avatar: user.avatar
        }
        setMessage('');
        socket.emit('msg_received', roomId, msg);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendmessage(e);
        }
    }

    return (
        <form onSubmit={sendmessage} className="relative">
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-3 bg-accent/20 text-foreground placeholder:text-muted-foreground rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring border border-border"
                rows="2"
                style={{ minHeight: '60px', maxHeight: '120px' }}
            />
            <button
                type="submit"
                className={`absolute right-2 bottom-2 p-2 rounded-full transition-colors ${
                    message.trim() 
                        ? 'text-primary hover:bg-accent' 
                        : 'text-muted-foreground cursor-not-allowed'
                }`}
                disabled={!message.trim()}
                title="Send message"
            >
                <Send size={20} />
            </button>
        </form>
    )
}
