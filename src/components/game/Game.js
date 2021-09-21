import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BoardMemo } from './Board';
import $ from 'jquery';
import { Card } from 'react-bootstrap';
import classes from './Board.module.css';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

export const capturedPieces = React.createContext({ pieces: null, setPiece: () => {} });
const socket = io('http://localhost:3000');
export default function Game() {
	$(function() {
		$('#board').on('contextmenu', function() {
			return false;
		});
	});
	const id = useRef(uuidv4());
	const idContext = React.createContext();
	// assign first socket white, second socket black somehow and pass that as context, also flip board if black
	// assign first socket white, second socket black somehow and pass that as context, also flip board if black
	useEffect(() => {
		socket.emit('show-users');
	}, [])
	useEffect(() => {
		socket.on('showing-users', (users) => console.log(users));
	});
	useEffect(() => {
		socket.on('new-remote-operations', ({ editorId, ops }) => console.log(editorId, ops));
	});

	const [num, setNum] = useState(0);
	const [piece, setPiece] = useState();
	const value = { piece, setPiece };

	const pieceMemo = useMemo(
		() => <div id={'end' + num} className={classes['captured']} style={{ position: 'relative' }} key={num} />,
		[num]
	);
	const dereferenceObjPieces = pieceMemo;
	const all_pieces = useMemo(() => [], []);
	useEffect(
		() => {
			all_pieces.push(dereferenceObjPieces);
		},
		[dereferenceObjPieces, all_pieces, num]
	);

	const firstUpdate = useRef(true);
	useEffect(
		() => {
			if (firstUpdate.current) {
				firstUpdate.current = false;
				return;
			}
			$(piece).appendTo('#end' + (all_pieces.length - 1));
			$(piece).css('opacity', 1);
			setNum((n) => n + 1);
		},
		[piece, all_pieces]
	);

	return (
		<div style={{ height: '100vh', display: 'grid', placeContent: 'center', backgroundColor: '#3b3b3b' }} id='page'>
			<idContext.Provider value={id}>
				<capturedPieces.Provider value={value}>
					<BoardMemo />
					<Card className='w-100' style={{ maxWidth: 800, backgroundColor: '#0a0a0a9a' }}>
						<div className={classes['captured-bg']}>{all_pieces}</div>
					</Card>
					<div id='fuck' />
				</capturedPieces.Provider>
				<button
					id='blue'
					onClick={() =>
						socket.emit('new-operations', {
							editorId: id.current,
							ops: 'blue'
						})}
				>
					Blue
				</button>
				<button id='red' onClick={() => socket.emit('show-users')}>
					Red
				</button>
			</idContext.Provider>
		</div>
	);
}
