const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = [];
const playerPair = [];
const game = [];
class Player {
	constructor(id, color, gameID) {
		this.id = id;
		this.color = color;
		this.gameID = gameID;
	}
}

io.on('connection', function(socket) {
	console.log('connect');
	var player = null;
	console.log(socket.client.conn.server.clientsCount + ' users connected, conn');
	users.push(socket.id);
	socket.emit('showing-players', playerPair);
	socket.on('register', function(id, color, gameID) {
		// found has to rely on username / email and not on some uuid which changes if you close a tab and open a new one
		var found = playerPair.find((playerObj) => playerObj.id === id);
		if (!found) {
			if (gameID) player = new Player(id, color, gameID);
			else player = new Player(id, color, playerPair[0].gameID);

			playerPair.push(player);
			if (playerPair.length === 2) game.push(playerPair);

			socket.emit('new-user', playerPair[0].gameID);
			console.log('emitting new user');
		}
		else {
			player = found;
			socket.emit('old-user', player.gameID);
			console.log('emitting old user');
		}
	});

	socket.on('turn-location', function(location) {
		console.log('turn-location');
		socket.broadcast.emit('new-turn-location', location);
		io.emit('update-FEN', location);
	});
	socket.on('new-turn', function(newTurn) {
		socket.broadcast.emit('new-turns', newTurn);
	});
	socket.on('disconnect', () => {
		console.log('disconnect');
		let index = users.indexOf(socket.id);
		users.splice(index, 1);
		console.log(socket.client.conn.server.clientsCount + ' users connected, disconn');
	});
});
http.listen(3001, function() {
	console.log('listening on *:3001');
});
