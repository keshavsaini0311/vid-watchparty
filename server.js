import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });

    const rooms = new Map();

    const cleanupEmptyRoom = (roomId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room || room.size === 0) {
            rooms.delete(roomId);
        }
    };

    io.on('connection', (socket) => {
        let currentRoom = null;
        
        socket.on('createRoom', (roomId,creatorId,vidurl) => {
            rooms.set(roomId, { 
                timestamp: 0.0, 
                playing: false, 
                messages: [],
                creatorId: creatorId,
                vidurl: vidurl,

            });

        });
        socket.on('joinRoom', (roomId,username,avatar) => {
            currentRoom = roomId;
            socket.join(roomId);
            if (!rooms.has(roomId)) {
                io.to(roomId).emit('noroom');
                return;
            }
            const roomData = rooms.get(roomId);
            
            io.to(roomId).emit('sync', roomData);
            io.to(roomId).emit('roomInfo', roomData);
            io.to(roomId).emit('newmessages', roomData.messages);
            socket.to(roomId).emit('user-joined');
        });

       

        socket.on('webrtc_offer', (roomId, offer) => {
            if (!roomId || !offer) return;
            const room = io.sockets.adapter.rooms.get(roomId);
            if (room && room.size > 1) {
                socket.to(roomId).emit('webrtc_offer', offer);
            }
        });

        socket.on('webrtc_answer', (roomId, answer) => {
            if (!roomId || !answer) return;
            socket.to(roomId).emit('webrtc_answer', answer);
        });

        socket.on('webrtc_ice_candidate', (roomId, candidate) => {
            if (!roomId || !candidate) return;
            socket.to(roomId).emit('webrtc_ice_candidate', candidate);
        });

        socket.on('playPause', (roomId, state) => {
            const roomData = rooms.get(roomId);
            if (!roomData) return;
            roomData.timestamp = state.timestamp;
            roomData.playing = state.playing;
            io.to(roomId).emit('play', roomData);
        });

        socket.on('seek', (roomId, state) => {
            const roomData = rooms.get(roomId);
            if (!roomData) return;
            roomData.timestamp = state.timestamp;
            io.to(roomId).emit('sync', roomData);
        });

        socket.on('msg_received', (roomId, msg) => {
            const roomData = rooms.get(roomId);
            if (!roomData) return;
            roomData.messages = [...roomData.messages, msg];
            io.to(roomId).emit('msg', msg);
        });

        socket.on('disconnecting', () => {
            if (currentRoom) {
                socket.leave(currentRoom);
                const roomData = rooms.get(currentRoom);
                if (roomData) {
                    roomData.users.delete(socket.id);
                    io.to(currentRoom).emit('sync', roomData);
                }
                setTimeout(() => cleanupEmptyRoom(currentRoom), 1000);
            }
        });
    });

    // Periodic cleanup of empty rooms
    setInterval(() => {
        for (const roomId of rooms.keys()) {
            cleanupEmptyRoom(roomId);
        }
    }, 300000); // Clean up every 5 minutes

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
