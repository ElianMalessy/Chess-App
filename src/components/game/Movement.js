import $ from 'jquery';

export default function drag(me) {
	if (me.button !== 0) return false;
	let move = $(me.target);
	var rect = document.elementFromPoint(me.pageX, me.pageY).getBoundingClientRect();
	move.css('z-index', 10);

	let lastOffset = move.data('lastTransform');
	let lastOffsetX = lastOffset ? lastOffset.dx : 0,
		lastOffsetY = lastOffset ? lastOffset.dy : 0;

	let startX = me.pageX - lastOffsetX,
		startY = me.pageY - lastOffsetY;

	var x_centered = startX - (rect.left + 35);
	var y_centered = startY - (rect.top + 35);
	move.css('transform', 'translate(' + x_centered + 'px, ' + y_centered + 'px)');
	move.data('lastTransform', { dx: x_centered, dy: y_centered });

	$(document).on('mousemove', function(e) {
		let newDx = e.pageX - startX + x_centered,
			newDy = e.pageY - startY + y_centered;
		//console.log('dragging', e.pageX - startX, e.pageY - startY);
		move.css('transform', 'translate(' + newDx + 'px, ' + newDy + 'px)');
		move.data('lastTransform', { dx: newDx, dy: newDy });
	});
}
export function endDrag(me) {
	let moving_piece = $(me.target);
	moving_piece.css('z-index', -100);
	let destination = document.elementFromPoint(me.pageX, me.pageY).id;

	if (destination) {
		let func = moveFunctions[me.target.id[0]](destination, me.target.id);
		if (func) {

			if (destination[0] !== 'S') {
				if ($('#' + destination).attr('color') !== me.target.getAttribute('color') && func !== 'p') {
					$('#' + destination).detach();
					let destination2 = document.elementFromPoint(me.pageX, me.pageY);
					$('#' + me.target.id).appendTo('#' + destination2.id);
					$('#' + me.target.id).attr('id', '' + me.target.id[0] + destination[1] + '' + destination[2]);
				}
			}
			else {
				$('#' + me.target.id).appendTo('#' + destination);
				$('#' + me.target.id).attr('id', '' + me.target.id[0] + destination[1] + '' + destination[2]);
			}
		}
	}
	$(document).off('mousemove');
	moving_piece.css('z-index', 3);
	moving_piece.css('transform', 'translate(' + 0 + 'px, ' + 0 + 'px)');
	moving_piece.data('lastTransform', { dx: 0, dy: 0 });
}
function moveThruPiecesDiag(destination, origin) {
	let destLetter = destination[1].charCodeAt(0);
	let origLetter = origin[1].charCodeAt(0);

	if (destLetter - origLetter > 0) {
		for (let i = 1; i < destLetter - origLetter; i++) {
			let num;
			destination[2] - origin[2] > 0 ? (num = parseInt(origin[2]) + i) : (num = parseInt(origin[2]) - i);
			let str = String.fromCharCode(origLetter + i) + num;
			if ($('[id$=' + str).length !== 1) return false;
		}
		return true;
	}
	else {
		for (let i = -1; i > destLetter - origLetter; i--) {
			let num;
			destination[2] - origin[2] > 0 ? (num = parseInt(origin[2]) - i) : (num = parseInt(origin[2]) + i);
			let str = String.fromCharCode(origLetter + i) + num;
			if ($('[id$=' + str).length !== 1) return false;
		}
		return true;
	}
}
function moveThruPiecesVertLat(destination, origin) {
	let destLetter = destination[1].charCodeAt(0);
	let origLetter = origin[1].charCodeAt(0);
	//horizontal movement
	if (destLetter - origLetter > 0) {
		for (let i = 1; i < destLetter - origLetter; i++) {
			let str = String.fromCharCode(origLetter + i) + origin[2];
			if ($('[id$=' + str).length !== 1) return false;
		}
		return true;
	}
	else if (destLetter - origLetter < 0) {
		for (let i = -1; i > destLetter - origLetter; i--) {
			let str = String.fromCharCode(origLetter + i) + origin[2];
			if ($('[id$=' + str).length !== 1) return false;
		}
		return true;
	}
	else {
		// vertical movement
		if (destination[2] - origin[2] > 0) {
			for (let i = 1; i < destination[2] - origin[2]; i++) {
				let num = parseInt(origin[2]) + i;
				let str = String.fromCharCode(origLetter) + num;
				if ($('[id$=' + str).length !== 1) return false;
			}
			return true;
		}
		else if (destination[2] - origin[2] < 0) {
			for (let i = -1; i > destination[2] - origin[2]; i--) {
				let num = parseInt(origin[2]) + i;
				let str = String.fromCharCode(origLetter) + num;
				if ($('[id$=' + str).length !== 1) return false;
			}
			return true;
		}
	}
}
// for every piece move except a pawn, the way u calculate possible moves, is u look at the destination and u backtrack
// say rook a1 and pawn a4, destination is rook a1 - a5. u start with checking if rook a2 is possible, then rook a3 and so forth
// for king check, you ask if it can be captured next move
var moveFunctions = {
	n: function canMoveKnight(destination, origin) {
		let destLetter = destination[1].charCodeAt(0);
		let origLetter = origin[1].charCodeAt(0);
		if (
			(Math.abs(destLetter - origLetter) === 2 && Math.abs(destination[2] - origin[2]) === 1) ||
			(Math.abs(destLetter - origLetter) === 1 && Math.abs(destination[2] - origin[2]) === 2)
		)
			return true;
	},
	b: function canMoveBishop(destination, origin) {
		let destLetter = destination[1].charCodeAt(0);
		let origLetter = origin[1].charCodeAt(0);
		if (Math.abs(destLetter - origLetter) === Math.abs(destination[2] - origin[2])) {
			if (moveThruPiecesDiag(destination, origin)) return true;
		}
	},
	r: function canMoveRook(destination, origin) {
		let destLetter = destination[1].charCodeAt(0);
		let origLetter = origin[1].charCodeAt(0);
		if (destLetter === origLetter || destination[2] === origin[2]) {
			if (moveThruPiecesVertLat(destination, origin)) return true;
		}
	},
	q: function canMoveQueen(destination, origin) {
		let destLetter = destination[1].charCodeAt(0);
		let origLetter = origin[1].charCodeAt(0);
		if ((destLetter === origLetter || destination[2] === origin[2]) && moveThruPiecesVertLat(destination, origin))
			return true;
		else if (
			Math.abs(destLetter - origLetter) === Math.abs(destination[2] - origin[2]) &&
			moveThruPiecesDiag(destination, origin)
		)
			return true;
	},
	k: function canMoveKing(destination, origin) {
		let destLetter = destination[1].charCodeAt(0);
		let origLetter = origin[1].charCodeAt(0);
		if (
			(Math.abs(destLetter - origLetter) === 1 || Math.abs(destLetter - origLetter) === 0) &&
			(Math.abs(destination[2] - origin[2]) === 1 || Math.abs(destination[2] - origin[2]) === 0)
		)
			return true;
	},
	p: function canMovePawn(destination, origin) {
		let destLetter = destination[1].charCodeAt(0);
		let origLetter = origin[1].charCodeAt(0);
		let pawn = $('#' + origin);
		let pawnAttr = pawn.attr('fmove');

		if (Math.abs(destLetter - origLetter) === 1) {
			if (destination[0] !== 'S' && Math.abs(destination[2] - origin[2]) === 1) {
				pawn.removeAttr('fmove');
				return true;
			}
		}
		else if (destLetter - origLetter === 0 && pawn.attr('color') === 'white') {
			if (pawnAttr) {
				if (destination[2] - origin[2] === 2 && pawnAttr === 'true') {
					pawn.attr('fmove', 'enPassent');
					return 'p';
				}
				else if (destination[2] - origin[2] === 1) {
					pawn.removeAttr('fmove');
					return 'p';
				}
			}
			else if (destination[2] - origin[2] === 1) return 'p';
		}
		else if (destLetter - origLetter === 0 && pawn.attr('color') === 'black') {
			if (pawnAttr) {
				if (destination[2] - origin[2] === -2 && pawnAttr === 'true') {
					pawn.attr('fmove', 'enPassent');
					return 'p';
				}
				else if (destination[2] - origin[2] === -1) {
					pawn.removeAttr('fmove');
					return 'p';
				}
			}
			else if (destination[2] - origin[2] === -1) return 'p';
		}
	}
};
