import { MessageCircle, X, Copy, Check, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RoomHeader({ roomId, chatopen, unreadCount, onToggleChat, onCopyRoomId, copied, users }) {
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

  return (
    <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-card">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Room ID - truncate on mobile */}
        <div className="flex items-center gap-2 min-w-0 max-w-[calc(100%-120px)] sm:max-w-none">
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground truncate">
            <span className="hidden sm:inline">Room: </span>{roomId}
          </h1>
          <button
            onClick={onCopyRoomId}
            className="flex-shrink-0 p-1 sm:p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            title="Copy Room ID"
          >
            {copied ? (
              <Check size={16} className="sm:size-[18px] lg:size-5" />
            ) : (
              <Copy size={16} className="sm:size-[18px] lg:size-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mr-10 md:mr-6">
        {/* Participants Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-shrink-0 p-1 sm:p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors relative">
              <Users size={16} className="sm:size-[18px] lg:size-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] sm:text-xs rounded-full min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-5 flex items-center justify-center px-1">
                {validUsers.length}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-[260px] sm:w-[280px] lg:w-[320px]"
            sideOffset={8}
          >
            <div className="p-2 sm:p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm sm:text-base font-medium text-muted-foreground">Participants</h3>
                <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  {validUsers.length} online
                </span>
              </div>
              <div className="space-y-1 sm:space-y-2">
                {validUsers.length > 0 ? (
                  validUsers.map((user, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-md hover:bg-accent transition-colors">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-border">
                        <img 
                          src={user.avatar} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.username);
                          }}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm sm:text-base font-medium truncate" title={user.username}>
                          {user.username}
                        </span>
                        <span className="text-[10px] sm:text-xs text-emerald-500">Online</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm sm:text-base text-muted-foreground text-center py-2">No participants</p>
                )}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chat Toggle Button - Only visible on mobile/tablet */}
        <button 
          onClick={onToggleChat}
          className="md:hidden flex-shrink-0 p-1 sm:p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors relative"
          title={chatopen ? "Close Chat" : "Open Chat"}
        >
          {chatopen ? (
          <div className="flex items-center">
            <X size={16} className="sm:size-[18px] lg:size-5 z-50" />
          </div>
          ) : (
            <MessageCircle size={16} className="sm:size-[18px] lg:size-5" />
          )}
          {!chatopen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-5 flex items-center justify-center px-1">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
} 