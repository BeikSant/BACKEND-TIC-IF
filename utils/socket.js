import { Server } from 'socket.io';
import cors from './cors.js';

let io = null

export default function socket(server) {
    io = new Server(server, {
        cors: {
            cors
        }
    });
    io.on('connection', (socket) => {
        ('connection socket')
        socket.on('disconnect', () => {
        });
    })
}

export { io }