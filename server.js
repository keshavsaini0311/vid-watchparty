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

    io.on('connection', (socket) => {
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            
            if (!rooms[roomId]) {
                rooms[roomId] = { timestamp: 0.0, playing: false, messages: [] };
            }
            
            io.to(roomId).emit('sync', rooms[roomId]);
            io.to(roomId).emit('newmessages', rooms[roomId].messages);
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
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
