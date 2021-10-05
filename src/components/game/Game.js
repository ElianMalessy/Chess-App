import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BoardMemo } from './Board';
import $ from 'jquery';
import CapturedPanel from './CapturedPanel';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../../firebase';
import { ref, update, set, get } from '@firebase/database';

export const PlayerContext = React.createContext();
export const TurnContext = React.createContext({ col: 'white', setCol: () => {} });
export const SocketContext = React.createContext();

export default function Game() {
	// default FEN notation: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -
	// after e4: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3
	// e3 is the en passent square, the numbers tell you how many consecutive squares are emtpy from left to right from the perspective of white
	// 8 represents an empty row and on the 4P3 represents 4 empty squares from left to right on the fourth rank
	// a4, b4, c4, d4. Then a white pawn at e4, then 3 empty squares to the right of the pawn, f4, g4, h4.
	// CAPITAL LETTERS REPRESENT WHITE, lowercase is black. the 'w' or 'b' represent whose turn it is and the KQkq is castling rights
	$(function() {
		$('#board').on('contextmenu', function() {
			return false;
		});
	});

	const [FEN, setFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -');
	const board = useRef([
		['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
		['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // black
		['1', '1', '1', '1', '1', '1', '1', '1'],
		['1', '1', '1', '1', '1', '1', '1', '1'], // add these up to get the FEN, from left to right
		['1', '1', '1', '1', '1', '1', '1', '1'],
		['1', '1', '1', '1', '1', '1', '1', '1'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // white
		['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
	]);

	const socket = useRef(null);
	const [socketState, setSocketState] = useState(null);
	useEffect(() => {
		socket.current = io('http://localhost:3000');
		setSocketState(socket.current);
	}, []);

	const [color, setColor] = useState(null);
	const [turn, setTurn] = useState('white');
	const turnValue = useMemo(
		() => {
			return { turn, setTurn };
		},
		[turn]
	);
	const gameID = useRef(null);
	const temp_color = useRef(null);
	const email = useLocation().state.detail;
	const found = useRef(false);
	const setUpTurnChange = useRef(false);
	useEffect(
		() => {
			let col = localStorage.getItem(email);
			if (col) {
				temp_color.current = col;
				found.current = true;
				setColor(col);
			}

			socket.current.off('showing-players').on('showing-players', (players) => {
				if (found.current === false) {
					if (players.length === 0 || email === players[0].id) {
						setColor('white');
						temp_color.current = 'white';
						localStorage.setItem(email, 'white');
					}
					else {
						setColor('black');
						temp_color.current = 'black';
						localStorage.setItem(email, 'black');
					}
				}
				if (players.length === 0) {
					gameID.current = uuidv4();
				}

				socket.current.emit('register', email, temp_color.current, gameID.current);


				socket.current.off('old-user').on('old-user', (globalGameID) => {
					if (gameID.current === null) gameID.current = globalGameID;
					// checks if there is a FEN in local storage and if there isnt then query the database
					fixStuffOnLoad();
				});
				socket.current.off('new-user').on('new-user', (globalGameID) => {
					if (gameID.current === null) gameID.current = globalGameID;
					newUserHandler(gameID.current, email, FEN);
					// updates the board which we use to update the FEN after a move on reload so that its not the default position
				});
			});
			socket.current.off('update-FEN').on('update-FEN', (newLocation) => {
				let column = newLocation[0].charCodeAt(1) - 97; // gets e from pe2 and converts that to 4th column (3 in array)
				let row = parseInt(newLocation[0][2]) - 1; // gets 2 from pe2 and converts that to the 2nd column (1 in array)
				let piece = board.current[7 - row][column];
				board.current[7 - row][column] = '1';

				let newColumn = newLocation[1].charCodeAt(1) - 97;
				let newRow = parseInt(newLocation[1][2]) - 1;
				board.current[7 - newRow][newColumn] = piece;
				// k now count pieces from left to right, counting up 1's inbetween pieces to get new FEN, include turns and eventually en passent squares
				let temp_FEN = '';
				for (let i = 0; i < 8; i++) {
					let spaces = 0;
					for (let j = 0; j < 8; j++) {
						if (board.current[i][j] === '1') {
							spaces++;
						}
						else {
							if (spaces > 0) {
								temp_FEN += spaces;
								spaces = 0;
							}
							temp_FEN += board.current[i][j];
						}
					}
					if (spaces > 0) {
						temp_FEN += spaces;
						spaces = 0;
					}
					if (i !== 7) temp_FEN += '/';
				}
				// eventually add castling and u good
				temp_FEN += ' ' + turn[0];
				if (true) temp_FEN += ' KQkq'; // for castling ***NEEDS FIX***
				console.log(turn, temp_FEN);
				if (piece[0].toUpperCase() === 'P' && Math.abs(newLocation[0][2] - newLocation[1][2]) === 2) {
					let enPassent_sqaure;
					// if color === black then it was a white move and vice versa
					turn === 'black'
						? (enPassent_sqaure = parseInt(newLocation[0][2]) - 1)
						: (enPassent_sqaure = parseInt(newLocation[1][2]) - 1);
					temp_FEN += ' ' + newLocation[0][1] + enPassent_sqaure;
				}
				else temp_FEN += ' -';
				console.log(temp_FEN, 'UPDATE');
				localStorage.setItem('FEN', temp_FEN);
				update(ref(database, 'Games/' + gameID.current), {
					FEN: temp_FEN
				});
			});
			function fixStuffOnLoad() {
				let localStorage_FEN = localStorage.getItem('FEN');
				if (!localStorage_FEN) getFEN(gameID.current);
				else {
					setFEN(localStorage_FEN);
					fixBoardArray();
					fixTurnFromFEN(localStorage_FEN);
				}
			}
			async function newUserHandler(gameID, pushVal, FEN) {
				const dbRef = ref(database, 'Games/' + gameID);
				console.log('newUserHandler');
				await get(dbRef)
					.then((snapshot) => {
						if (snapshot.exists()) {
							update(dbRef, {
								player2: pushVal
							}).then(fixStuffOnLoad());
						}
						else {
							set(dbRef, {
								player1: pushVal,
								FEN: FEN
							}).then(fixStuffOnLoad());
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			function fixTurnFromFEN(FEN) {
				// switching from b in FEN to w immediately after a white move, in both local storage and in firebase
				console.log(FEN, 'FIXTURN', turn);
				for (let i = FEN.length - 1; i >= 0; i--) {
					console.log(FEN[i]);
					if (FEN[i] === turn[0]) break;
					if (FEN[i] === 'w' && turn !== 'white') {
						setTurn('white');
						setUpTurnChange.current = true;
						break;
					}
					else if (FEN[i] === 'b' && turn !== 'black') {
						setTurn('black');
						setUpTurnChange.current = true;
						break;
					}
				}
			}
			function fixBoardArray() {
				console.log(board.current, FEN);
				let FEN_index = 0;
				for (let i = 0; i < 8; i++) {
					for (let j = 0; j < 8; j++, FEN_index++) {
						if (FEN[FEN_index] === '/') FEN_index++;
						let num = parseInt(FEN[FEN_index]);
						if (num) {
							while (num > 0) {
								board.current[i][j] = '1';
								num--;
								j++;
							}
						}
						else {
							board.current[i][j] = FEN[FEN_index];
						}
					}
				}
			}
			async function getFEN(gameID) {
				const dbRef = ref(database, 'Games/' + gameID);
				await get(dbRef)
					.then((snapshot) => {
						if (snapshot.exists()) {
							let temp_FEN = snapshot.val().FEN;
							localStorage.setItem('FEN', temp_FEN);
							console.log(localStorage.getItem('FEN'), temp_FEN);
							fixTurnFromFEN(temp_FEN);
							fixBoardArray();
							setFEN(temp_FEN);
						}
						else {
							console.log('No data available');
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
		},
		[email, FEN, turn]
	);

	useEffect(
		() => {
			socket.current.emit('new-turn', turn);
			socket.current.off('new-turn-location').on('new-turn-location', (newLocation) => {
				console.log(newLocation);

				let old_location = $('#' + newLocation[0]);
				let destination = $('[id*=' + newLocation[1][1] + newLocation[1][2] + ']')[0];
				let capturedPiece = $('#' + destination.id)[0].firstChild;
				if (capturedPiece) {
					$('#' + capturedPiece.id).css('opacity', 0);
					$('#' + capturedPiece.id).appendTo('#fuck');
					$('#' + capturedPiece.id).attr('id', 'capturedPiece');
				}
				old_location.appendTo($('#S' + newLocation[1][1] + newLocation[1][2]));
				old_location.attr('id', old_location[0].id[0] + newLocation[1][1] + newLocation[1][2]);
			});
			socket.current.off('new-turns').on('new-turns', (newTurn) => {
				if (turn !== newTurn && setUpTurnChange.current === false) {
					console.log(turn)
					setTurn(newTurn);
				}
			});
		},
		[turn]
	);

	const socketMemo = useMemo(
		() => {
			return socketState;
		},
		[socketState]
	);
	const player = useMemo(
		() => {
			return color;
		},
		[color]
	);
	const FEN_MEMO = useMemo(
		() => {
			return FEN;
		},
		[FEN]
	);
	return (
		<div style={{ height: '100vh', display: 'grid', placeContent: 'center', backgroundColor: '#3b3b3b' }} id='page'>
			<PlayerContext.Provider value={player}>
				<CapturedPanel>
					<TurnContext.Provider value={turnValue}>
						<SocketContext.Provider value={socketMemo}>
							<BoardMemo FEN={FEN_MEMO} />
						</SocketContext.Provider>
					</TurnContext.Provider>
				</CapturedPanel>
			</PlayerContext.Provider>
		</div>
	);
}
