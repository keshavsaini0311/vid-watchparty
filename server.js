// server.js
const { createServer } = require('http');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const io = socketIo(server);

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

        socket.on('seek', (roomId, timestamp) => {
            rooms[roomId].timestamp = timestamp;
            io.to(roomId).emit('sync', rooms[roomId]);
        });
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
