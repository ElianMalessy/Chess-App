import { useContext, useEffect, useState, useRef, memo } from 'react';
import classes from './Board.module.css';
import { PieceMemo } from './Piece';
import { PlayerContext } from './Game';

function Board({ currentUser }) {
	const FEN = useRef(localStorage.getItem('FEN'));
	if (!FEN.current) FEN.current = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -';

	const [board, setBoard] = useState([]);
	const boardFiller = useRef([]);

	const color = useRef(null);
	const { playerColor } = useContext(PlayerContext);
	let temp_color = localStorage.getItem(currentUser);
	if (temp_color) color.current = temp_color;
	else color.current = playerColor;

	const first_render = useRef(false);
	useEffect(
		() => {
			if (!first_render.current) first_render.current = true;
			else if (first_render.current && temp_color) return;

			console.log('board-render');
			let emptyBoard = [];
			boardFiller.current = emptyBoard;
			setBoard(emptyBoard);

			var index = FEN.current.length;
			while (true) {
				if (FEN.current[index] === 'w' || FEN.current[index] === 'b') {
					index -= 2;
					break;
				}
				index--;
			}

			// goes backwards in FEN.
			if (color.current === 'black') {
				for (let i = index, row = 1, column = 0; i >= 0; i--, column++) {
					if (FEN.current[i] === ' ') break;
					if (FEN.current[i] === '/') {
						row++;
						column = -1;
						continue;
					}

					// board squares starting from top left to right bottom. a8, b8 to g1, h1
					let num = parseInt(FEN.current[i]);
					if (num) {
						for (let j = parseInt(FEN.current[i]); j > 0; j--, column++) {
							let key = String.fromCharCode(104 - column) + '' + row;
							let tile_class = (column + row) % 2 === 1 ? 'non-colored-tile' : 'colored-tile';
							boardFiller.current.push(<div key={key} className={classes[tile_class]} id={'S' + key} />);
						}
						if (num < 8) {
							column--;
						}
					}
					else { // add fmove from fen, also en passent square
						let color = FEN.current[i] === FEN.current[i].toUpperCase() ? 'white' : 'black';
						let key = String.fromCharCode(104 - column) + '' + row;
						let tile_class = (column + row) % 2 === 1 ? 'non-colored-tile' : 'colored-tile';
						boardFiller.current.push(
							<div key={key} className={classes[tile_class]} id={'S' + key}>
								<PieceMemo color={color} position={FEN.current[i].toLowerCase() + key} />
							</div>
						);
					}
				}
			}
			else {
				for (let i = 0, row = 8, column = 0; i < FEN.current.length; i++, column++) {
					if (FEN.current[i] === ' ') break;
					if (FEN.current[i] === '/') {
						row--;
						column = -1;
						continue;
					}

					let num = parseInt(FEN.current[i]);
					if (num) {
						for (let j = num; j > 0; j--, column++) {
							let key = String.fromCharCode(97 + column) + '' + row;
							let tile_class = (column + row) % 2 === 0 ? 'non-colored-tile' : 'colored-tile';
							boardFiller.current.push(<div key={key} className={classes[tile_class]} id={'S' + key} />);
						}
						if (num < 8) {
							column--;
						}
					}
					else {
						let color = FEN.current[i] === FEN.current[i].toUpperCase() ? 'white' : 'black';
						let key = String.fromCharCode(97 + column) + '' + row;
						let tile_class = (column + row) % 2 === 0 ? 'non-colored-tile' : 'colored-tile';
						boardFiller.current.push(
							<div key={key} className={classes[tile_class]} id={'S' + key}>
								<PieceMemo color={color} position={FEN.current[i].toLowerCase() + key} />
							</div>
						);
					}
				}
			}
			setBoard(boardFiller.current);
		},
		// eslint-disable-next-line
		[playerColor]
	);

	return (
		<div className={classes.chessboard} id='board'>
			{board}
		</div>
	);
}
export const BoardMemo = memo(Board);
