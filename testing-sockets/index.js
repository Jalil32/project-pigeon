var express = require('express');
var createServer = require('node:http').createServer;
var join = require('node:path').join;
var Server = require('socket.io').Server;
var app = express();
var server = createServer(app);
var io = new Server(server);
app.get('/', function (req, res) {
    res.sendFile(join(__dirname, 'index.html'));
});
app.get('/pigeon', function (req, res) {
    res.send('<h1>Welcome, My Pigeon Friend</h1>');
});
io.on('connection', function (socket) {
    console.log('NEW PIGEON ARRIVED!');
    socket.on('disconnect', function () {
        console.log("A PIGEON FLEW AWAY!");
    });
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});
server.listen(3000, '192.168.43.87', function () {
    console.log('SERVER RUNNING @ http://localhost:3000');
});
