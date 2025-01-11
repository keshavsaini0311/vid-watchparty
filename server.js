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
        console.log(`User connected: ${socket.id}`);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            if (!rooms.roomId) {
                rooms.roomId = { timestamp: 0.0, playing: false, messages: [] };
            }
            io.to(roomId).emit('sync', rooms.roomId);
            io.to(roomId).emit('newmessages', rooms.roomId.messages);

        });

        socket.on('playPause', (roomId, state) => {
            rooms.roomId = state;
            io.to(roomId).emit('play', rooms.roomId);
        });

        socket.on('seek', (roomId, state) => {
            rooms.roomId.timestamp = state.timestamp;
            io.to(roomId).emit('sync', rooms.roomId);
        });

        socket.on('msg_received', (roomId, msg) => {
            rooms.roomId.messages.push(msg);
            io.to(roomId).emit('msg', msg);
        });

    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
