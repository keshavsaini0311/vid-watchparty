import { useRef, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import Message from './Mesage';
import Inputmessage from './Inputmessage';
import VoiceChat from './VoiceChat';

export default function ChatPanel({ 
  chatopen, 
  messages, 
  user, 
  roomId, 
  onToggleChat, 
  onScroll,
  users
}) {
  const scroll = useRef();

  // Filter out invalid users
  const validUsers = users?.filter(user => 
    user && 
    typeof user === 'object' && 
    user.username && 
    typeof user.username === 'string' && 
    user.username.trim().length > 0 && 
    user.avatar && 
    typeof user.avatar === 'string'
  ) || [];

  useEffect(() => {
    if (scroll.current && chatopen) {
      scroll.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatopen]);

  return (
    <div 
      className={`fixed md:static inset-0 md:w-[350px] lg:w-[400px] xl:w-[450px] bg-card border-l border-border flex flex-col transition-transform duration-300 ease-in-out ${
        chatopen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}
      style={{ height: 'calc(100vh - 3rem)' }}
    > 
      {/* Chat header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-accent/50 border-b border-border">
        <h2 className="text-base sm:text-lg font-medium text-foreground">Chat</h2>
        
        {/* Participants avatars */}
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            {validUsers.slice(0, 3).map((user, index) => (
              <div 
                key={user.username || index} 
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-background relative hover:z-10 transition-transform hover:scale-110"
              >
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  title={user.username} 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.username);
                  }}
                />
              </div>
            ))}
            {validUsers.length > 3 && (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center relative hover:z-10">
                <span className="text-[10px] sm:text-xs font-medium text-primary">
                  +{validUsers.length - 3}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {validUsers.length} online
          </span>
        </div>

        {/* Close button - only on mobile */}
        <button 
          onClick={onToggleChat}
          className="md:hidden p-1 sm:p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <X size={16} className="sm:size-[18px]" />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 no-scrollbar">
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
        
        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 border-t border-border bg-card">
          <VoiceChat roomId={roomId} />
          <Inputmessage user={user} roomId={roomId}/>
        </div>
      </div>
    </div>
  );
} 