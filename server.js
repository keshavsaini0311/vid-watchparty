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

    let rooms = {};
    let roomUsers = {};
    let activeRooms = new Set(); // Track active room IDs
    let connectedSockets = new Set(); // Track all connected sockets

    io.on('connection', (socket) => {
        connectedSockets.add(socket.id);
        console.log(`User connected: ${socket.id}`);
        console.log('Current connected sockets:', Array.from(connectedSockets));
        console.log('Current rooms:', Object.keys(rooms));
        console.log('Active rooms:', Array.from(activeRooms));

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
            console.log('Current rooms state:', rooms);
            
            // Only initialize with empty messages if room is truly new
            if (!activeRooms.has(roomId)) {
                rooms[roomId] = { timestamp: 0.0, playing: false, messages: [] };
                activeRooms.add(roomId);
                console.log(`Created new room: ${roomId}`);
            } else if (!rooms[roomId]) {
                // If room was deleted but is in activeRooms, create fresh state
                rooms[roomId] = { timestamp: 0.0, playing: false, messages: [] };
                console.log(`Recreated deleted room: ${roomId}`);
            }
            if (!roomUsers[roomId]) {
                roomUsers[roomId] = new Set();
            }
            roomUsers[roomId].add(socket.id);
            
            console.log(`Room ${roomId} users:`, Array.from(roomUsers[roomId]));
            io.to(roomId).emit('sync', rooms[roomId]);
            io.to(roomId).emit('newmessages', rooms[roomId].messages);
            socket.to(roomId).emit('user-joined');
        });

        // WebRTC Signaling
        socket.on('webrtc_offer', (roomId, offer) => {
            socket.to(roomId).emit('webrtc_offer', offer);
        });

        socket.on('webrtc_answer', (roomId, answer) => {
            socket.to(roomId).emit('webrtc_answer', answer);
        });

        socket.on('webrtc_ice_candidate', (roomId, candidate) => {
            socket.to(roomId).emit('webrtc_ice_candidate', candidate);
        });

        socket.on('playPause', (roomId, state) => {
            rooms[roomId].timestamp = state.timestamp;
            rooms[roomId].playing = state.playing;
            io.to(roomId).emit('play', rooms[roomId]);
        });

        socket.on('seek', (roomId, state) => {
            rooms[roomId].timestamp = state.timestamp;
            io.to(roomId).emit('sync', rooms[roomId]);
        });

        socket.on('msg_received', (roomId, msg) => {
            rooms[roomId].messages=[...rooms[roomId].messages,msg];
            io.to(roomId).emit('msg', msg);
        });

        socket.on('disconnect', () => {
            connectedSockets.delete(socket.id);
            console.log(`User disconnected: ${socket.id}`);
            console.log('Remaining connected sockets:', Array.from(connectedSockets));
            
            for (const [roomId, users] of Object.entries(roomUsers)) {
                if (users.has(socket.id)) {
                    users.delete(socket.id);
                    console.log(`Removed socket ${socket.id} from room ${roomId}`);
                    console.log(`Room ${roomId} remaining users:`, Array.from(users));
                    
                    if (users.size === 0) {
                        console.log(`Deleting empty room: ${roomId}`);
                        delete rooms[roomId];
                        delete roomUsers[roomId];
                        activeRooms.delete(roomId);
                        console.log('Updated rooms state:', rooms);
                        console.log('Updated active rooms:', Array.from(activeRooms));
                    }
                }
            }
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
