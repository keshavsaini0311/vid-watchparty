'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsConnecting(true);
        setError(null);
        
        // Create socket connection for production
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Create socket connection for development
        const devSocket = io("http://localhost:3000", {
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnecting(false);
            setError(null);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setIsConnecting(false);
            setError('Failed to connect to server');
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            setIsConnecting(true);
        });

        newSocket.on('reconnect', (attemptNumber) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts');
            setIsConnecting(false);
            setError(null);
        });

        newSocket.on('reconnect_error', (err) => {
            console.error('Socket reconnection error:', err);
            setError('Failed to reconnect to server');
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            console.log('Cleaning up socket connection');
            if (newSocket) {
                newSocket.close();
            }
        };
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (isConnecting) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted-foreground">Connecting to server...</div>
            </div>
        );
    }

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

// Custom hook to use socket
export function useSocket() {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error('Socket connection not established');
    }
    return socket;
} 