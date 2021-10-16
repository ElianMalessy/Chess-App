const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = [];
const games = Array(100);
for (let i = 0; i < 100; i++) {
	games[i] = { playerCount: 0, players: [{ id: 0, color: 0, gameID: 0 }, { id: 0, color: 0, gameID: 0 }] };
}
class Player {
	constructor(id, gameID) {
		this.id = id;
		this.gameID = gameID;
	}
}

io.on('connection', function(socket) {
	var player = null;
	console.log(socket.client.conn.server.clientsCount + ' users connected, conn');
	users.push(socket.id);
	socket.on('loadIn', function(gameID) {
		socket.join(gameID);
		socket.emit('showing-players', games[gameID]);
	});

	socket.on('register', function(id, gameID) {
		if (id === null) return;

		var found = games.find((gameObj) => gameObj.players[0].id === id || gameObj.players[1].id === id);
		if (found !== undefined && found.players[0].id === id) found = found.players[0];
		else if (found !== undefined && found.players[1].id === id) found = found.players[1];

		if (!found) {
			player = new Player(id, gameID);
			if (games[gameID].playerCount < 2) {
				if (games[gameID].players[0].id === 0) {
					games[gameID].players[0].id = player.id;
					games[gameID].players[0].gameID = player.gameID;
				}
				else {
					games[gameID].players[1].id = player.id;
					games[gameID].players[1].gameID = player.gameID;
				}
				games[gameID].playerCount++;
			}

			socket.emit('new-user');
			console.log('emitting new user');
		}
		else {
			player = found;
			socket.emit('old-user');
			console.log('emitting old user');
		}
	});

	socket.on('turn-location', function(location, gameID, turnColor) {
		socket.to(gameID).emit('new-location', location);
		io.to(gameID).emit('update-FEN', location, turnColor); //io because localStorage differs across users
		//socket.to(gameID).emit('new-turn-location', location);
	});

	socket.on('disconnect', () => {
		console.log('disconnect');
		socket.leave(socket.rooms);
		let index = users.indexOf(socket.id);
		users.splice(index, 1);
		console.log(socket.client.conn.server.clientsCount + ' users connected, disconn');
	});
});
http.listen(3001, function() {
	console.log('listening on *:3001');
});
