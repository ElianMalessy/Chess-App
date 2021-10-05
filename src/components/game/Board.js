import React, { useContext } from 'react';
import classes from './Board.module.css';
import { PieceMemo } from './Piece';
import { PlayerContext } from './Game';

function Board({ FEN }) {
	if(!FEN) FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -'
	const board = [];
	var playerColor = useContext(PlayerContext);
	var index = FEN.length;
	while (true) {
		if (FEN[index] === 'w' || FEN[index] === 'b') {
			index -= 2;
			break;
		}
		index--;
	}
	// goes backwards in FEN
	if (playerColor === 'black') {
		for (let i = index, row = 1, column = 0; i >= 0; i--, column++) {
			if (FEN[i] === ' ') break;
			if (FEN[i] === '/') {
				row++;
				column = -1;
				continue;
			}
			// board squares starting from top left to right bottom. a8, b8 to g1, h1
			let num = parseInt(FEN[i]);
			if (num) {
				for (let j = parseInt(FEN[i]); j > 0; j--, column++) {
					let key = String.fromCharCode(104 - column) + '' + row;
					let tile_class = (column + row) % 2 === 1 ? 'non-colored-tile' : 'colored-tile';
					board.push(<div key={key} className={classes[tile_class]} id={'S' + key} />);
				}
				if (num < 8) {
					column--;
				}
			}
			else {
				let color = FEN[i] === FEN[i].toUpperCase() ? 'white' : 'black';
				let key = String.fromCharCode(104 - column) + '' + row;
				let tile_class = (column + row) % 2 === 1 ? 'non-colored-tile' : 'colored-tile';
				board.push(
					<div key={key} className={classes[tile_class]} id={'S' + key}>
						<PieceMemo color={color} position={FEN[i].toLowerCase() + key} />
					</div>
				);
			}
		}
	}
	else {
		for (let i = 0, row = 8, column = 0; i < FEN.length; i++, column++) {
			if (FEN[i] === ' ') break;
			if (FEN[i] === '/') {
				row--;
				column = -1;
				continue;
			}
			let num = parseInt(FEN[i]);
			if (num) {
				for (let j = num; j > 0; j--, column++) {
					let key = String.fromCharCode(97 + column) + '' + row;
					let tile_class = (column + row) % 2 === 0 ? 'non-colored-tile' : 'colored-tile';
					board.push(<div key={key} className={classes[tile_class]} id={'S' + key} />);
				}
				if (num < 8) {
					column--;
				}
			}
			else {
				let color = FEN[i] === FEN[i].toUpperCase() ? 'white' : 'black';
				let key = String.fromCharCode(97 + column) + '' + row;
				let tile_class = (column + row) % 2 === 0 ? 'non-colored-tile' : 'colored-tile';
				board.push(
					<div key={key} className={classes[tile_class]} id={'S' + key}>
						<PieceMemo color={color} position={FEN[i].toLowerCase() + key} />
					</div>
				);
			}
		}
	}
	return (
		<div className={classes.chessboard} id='board'>
			{board}
		</div>
	);
}

export const BoardMemo = React.memo(Board);
