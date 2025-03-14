import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import Message from './Mesage';
import Inputmessage from './Inputmessage';
import VoiceChat from './VoiceChat';

export default function ChatPanel({ 
  chatopen, 
  messages, 
  user, 
  roomId, 
  onToggleChat, 
  onScroll

}) {
  const scroll = useRef();

  useEffect(() => {
    if (scroll.current && chatopen) {
      scroll.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatopen]);

  return (
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
          onClick={onToggleChat}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
          {messages && messages.length > 0 && messages.map((msg, index) => (
            <div key={index}>
              <Message 
                message={msg.message} 
                username={msg.username} 
                time={msg.time} 
                avatar={user.avatar}
              />
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
  );
} 