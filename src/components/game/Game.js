import { useState, useEffect, useMemo, useRef, createContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { BoardMemo } from './Board';
import $ from 'jquery';
import CapturedPanel from './CapturedPanel';
import io from 'socket.io-client';
import { database } from '../../firebase';
import { ref, update, set, get } from '@firebase/database';
//import { useAuth } from '../../contexts/AuthContext';

export const PlayerContext = createContext();
export const TurnContext = createContext({ col: 'white', setCol: () => {} });
export const SocketContext = createContext();

export default function Game(props) {
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

	const [playerColor, setplayerColor] = useState(null);
	const [turn, setTurn] = useState('white');
	const turnValue = useMemo(
		() => {
			return { turn, setTurn };
		},
		[turn]
	);
	let path = props.location.pathname;
	const gameID = useRef(path.substring(path.lastIndexOf('/') + 1));
	const temp_playerColor = useRef(null);

	//const { currentUser } = useAuth();
	const currentUserID = useRef(useLocation().state.detail);

	const setUpTurnChange = useRef(false);
	const fixBoardArray = useCallback((localStorage_FEN) => {
		console.log('fixingBoardArray', localStorage_FEN, board.current);
		let FEN_index = 0;
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++, FEN_index++) {
				if (localStorage_FEN[FEN_index] === '/') FEN_index++;
				let num = parseInt(localStorage_FEN[FEN_index]);
				if (num) {
					if (num === 1) {
						board.current[i][j] = '1';
					}
					else {
						while (num > 1) {
							board.current[i][j] = '1';
							num--;
							j++;
						}
					}
				}
				else {
					board.current[i][j] = localStorage_FEN[FEN_index];
				}
			}
		}
	}, []);
	const fixTurnFromFEN = useCallback(
		(FEN) => {
			// switching from b in FEN to w immediately after a white move, in both local storage and in firebase
			for (let i = FEN.length - 1; i >= 0; i--) {
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
		},
		[turn]
	);
	const getFEN = useCallback(
		async (gameID) => {
			const dbRef = ref(database, 'Games/' + gameID);
			await get(dbRef)
				.then((snapshot) => {
					if (snapshot.exists()) {
						let temp_FEN = snapshot.val().FEN;
						localStorage.setItem('FEN', temp_FEN);
						fixTurnFromFEN(temp_FEN);
						fixBoardArray(temp_FEN);
					}
					else {
						console.log('No data available');
					}
				})
				.catch((error) => {
					console.error(error);
				});
		},
		[fixBoardArray, fixTurnFromFEN]
	);
	const fixStuffOnLoad = useCallback(
		(reload) => {
			let localStorage_FEN = localStorage.getItem('FEN');
			if (!localStorage_FEN) getFEN(gameID.current);
			else {
				fixBoardArray(localStorage_FEN);
				if (reload) fixTurnFromFEN(localStorage_FEN);
			}
		},
		[fixBoardArray, getFEN, fixTurnFromFEN]
	);

	useEffect(() => {
		socket.current.emit('loadIn', gameID.current);
		socket.current.emit('register', currentUserID.current, temp_playerColor.current, gameID.current);
	}, []);
	useEffect(
		() => {
			socket.current.off('showing-players').on('showing-players', (game) => {
				let col = localStorage.getItem(currentUserID.current);
				let found = false;
				if (col) {
					temp_playerColor.current = col;
					found = true;
					setplayerColor(col);
				}

				if (found === false) {
					if (game.playerCount === 0 || currentUserID.current === game.players[0].id) {
						setplayerColor('white');
						temp_playerColor.current = 'white';
						localStorage.setItem(currentUserID.current, 'white');
					}
					else {
						setplayerColor('black');
						temp_playerColor.current = 'black';
						localStorage.setItem(currentUserID.current, 'black');
					}
				}
				socket.current.off('old-user').on('old-user', () => {
					console.log('old-user');
					fixStuffOnLoad(true);
				});

				socket.current.off('new-user').on('new-user', () => {
					console.log('new-user');

					newUserHandler(
						gameID.current,
						currentUserID.current,
						'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -'
					);
				});
			});

			async function newUserHandler(gameID, pushVal, FEN) {
				const dbRef = ref(database, 'Games/' + gameID);
				console.log('newUserHandler');
				await get(dbRef)
					.then((snapshot) => {
						if (snapshot.exists()) {
							update(dbRef, {
								player2: pushVal
							}).then(fixStuffOnLoad(false));
						}
						else {
							set(dbRef, {
								player1: pushVal,
								FEN: FEN
							}).then(fixStuffOnLoad(false));
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
		},
		[fixStuffOnLoad]
	);

	useEffect(
		() => {
			socket.current.off('new-location').on('new-location', (newLocation) => {
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

			socket.current.off('update-FEN').on('update-FEN', (newLocation, newTurn) => {
				if (turn !== newTurn && setUpTurnChange.current === false) {
					setTurn(newTurn);
				}
				else if (setUpTurnChange.current === true) setUpTurnChange.current = false;

				let column = newLocation[0].charCodeAt(1) - 97; // gets e from pe2 and converts that to 4th column (3 in array)
				let row = parseInt(newLocation[0][2]) - 1; // gets 2 from pe2 and converts that to the 2nd column (1 in array)
				let piece = board.current[7 - row][column];
				board.current[7 - row][column] = '1'; // prev square is now empty

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
				temp_FEN += ' ' + newTurn[0];
				if (true) temp_FEN += ' KQkq'; // for castling ***NEEDS FIX***
				if (piece[0].toUpperCase() === 'P' && Math.abs(newLocation[0][2] - newLocation[1][2]) === 2) {
					let enPassent_sqaure;
					// if playerColor === black then it was a white move and vice versa
					newTurn === 'black'
						? (enPassent_sqaure = parseInt(newLocation[0][2]) - 1)
						: (enPassent_sqaure = parseInt(newLocation[1][2]) - 1);
					temp_FEN += ' ' + newLocation[0][1] + enPassent_sqaure;
				}
				else temp_FEN += ' -';

				console.log(temp_FEN);
				localStorage.setItem('FEN', temp_FEN);
				update(ref(database, 'Games/' + gameID.current), {
					FEN: temp_FEN
				});
				fixStuffOnLoad(false);

			});
		},
		[fixStuffOnLoad, turn]
	);

	const player = useMemo(
		() => {
			return { playerColor, gameID };
		},
		[playerColor]
	);
	return (
		<div style={{ height: '100vh', display: 'grid', placeContent: 'center', backgroundColor: '#3b3b3b' }} id='page'>
			<div style={{color: 'white', fontSize: 20}}>
				turn: {turn}
			</div>
			<PlayerContext.Provider value={player}>
				<CapturedPanel>
					<TurnContext.Provider value={turnValue}>
						<SocketContext.Provider value={socketState}>
							<BoardMemo />
						</SocketContext.Provider>
					</TurnContext.Provider>
				</CapturedPanel>
			</PlayerContext.Provider>
		</div>
	);
}
