import React, { useState } from 'react';
import classes from './Board.module.css';
import { PieceMemo } from './Piece';

export const TurnContext = React.createContext({ col: 'white', setCol: () => {} });
function Board() {
	const [turn, setTurn] = useState('white');
	const value = {turn, setTurn}
	const board = [];
	const piece_locations = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

	for (let i = 7; i >= 0; i--) {
		for (let j = 0; j < 8; j++) {
			let key = String.fromCharCode(97 + j) + '' + (i + 1);
			let odd_or_even = (i + j) % 2;
			let color = null;
			if (i < 2) color = 'white';
			else if (i > 5) color = 'black';
			let piece = <PieceMemo color={color} position={piece_locations[j] + key} />;
			if (i === 1 || i === 6) piece = <PieceMemo color={color} position={'p' + key} />;

			if (odd_or_even) {
				board.push(
					<div key={key} className={classes['colored-tile']} id={'S' + key}>
						{color ? piece : null}
					</div>
				);
			}
			else {
				board.push(
					<div key={key} className={classes['non-colored-tile']} id={'S' + key}>
						{color ? piece : null}
					</div>
				);
			}
		}
	}
	return (
		<TurnContext.Provider value={value}>
			<div className={classes.chessboard} id='board'>
				{board}
			</div>
		</TurnContext.Provider>
	);
}

export const BoardMemo = React.memo(Board);
