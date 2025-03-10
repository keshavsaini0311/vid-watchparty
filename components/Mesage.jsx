const Message = (props) => {
    const message = props.message;
    const time = props.time;
    const username = props.username;
    const avatar = props.avatar;
    
    return (
        <div className="flex items-start gap-3 group hover:bg-accent/20 p-2 rounded-lg transition-colors">
            <img
                className="w-8 h-8 rounded-full object-cover border border-border"
                src={avatar}
                alt={`${username}'s avatar`}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                        {username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {time}
                    </span>
                </div>
                <p className="text-foreground/90 break-words">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Message;
