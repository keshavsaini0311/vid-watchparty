import { MessageCircle, X, Copy, Check } from 'lucide-react';

export default function RoomHeader({ roomId, chatopen, unreadCount, onToggleChat, onCopyRoomId, copied }) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 bg-card">
      <div className="flex items-center gap-2">
        <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">Room: {roomId}</h1>
        <button
          onClick={onCopyRoomId}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          title="Copy Room ID"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
      <button 
        onClick={onToggleChat}
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
  );
} 