const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const users = [];
io.on('connection', function(socket) {
	console.log( socket.client.conn.server.clientsCount + " users connected, conn" );
	users.push(socket.id);
	socket.on('show-users', () => {
		io.emit('showing-users', users)
	})
	socket.on('new-operations', function(data) {
		io.emit('new-remote-operations', data);
	});
	socket.on('disconnect', () => {
		users.pop(socket.id)
		console.log( socket.client.conn.server.clientsCount + " users connected, disconn" );
	})
});

http.listen(3001, function() {
	console.log('listening on *:3001');
});
