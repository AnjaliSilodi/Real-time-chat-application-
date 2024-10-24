const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A new user connected');

    // Listen for when a user joins the chat
    socket.on('user joined', (username) => {
        console.log(`${username} has joined the chat`);
        io.emit('user joined', username); // Notify all clients
    });

    // Handle chat messages
    socket.on('chat message', ({ username, message }) => {
        io.emit('chat message', { username, message }); // Broadcast to all users
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
