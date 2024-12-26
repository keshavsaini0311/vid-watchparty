// server.js
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);


    let rooms = {}; 

    io.on('connection', (socket) => {
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            if (rooms[roomId]) {
                socket.emit('sync', rooms[roomId]);
                
            } else {
                rooms[roomId] = { timestamp: 0, playing: false };
            }
        });

        socket.on('playPause', (roomId, state) => {
            rooms[roomId] = state;
            io.to(roomId).emit('sync', state);
        });

        socket.on('seek', (roomId, state) => {
            rooms[roomId].timestamp = state.timestamp;
            
            io.to(roomId).emit('sync', rooms[roomId]);
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
