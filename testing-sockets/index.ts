const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');


const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
	res.sendFile(join(__dirname, 'index.html'));
});



app.get('/pigeon', (req, res) => {
	res.send('<h1>Welcome, My Pigeon Friend</h1>');
});

io.on('connection', (socket) => {
	// console.log('NEW PIGEON ARRIVED!');
	socket.on('disconnect', () => {
		//console.log("A PIGEON FLEW AWAY!");
	});
	socket.on('chat message', (msg) => {
		io.emit('chat message', msg);
	});
});


server.listen(3000,'localhost', () => {
	console.log('SERVER RUNNING @ http://localhost:3000');
});
