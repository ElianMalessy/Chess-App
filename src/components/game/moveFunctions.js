import $ from 'jquery';
export default function findPossibleMoves(checkingPieces, kingPos) {
  // if there are checking pieces, then that means that the move that this player makes has to block those checking pieces
  // use isCheck on all of the possibilities, if its a bishop for example, that means that the move either has to be the king moving out of the way
  // (that can be true for all of them, as long as that next position doesnt return a true in isCheck()), or it can be a piece moving into that diag
  // if there are no possible moves to stop isCheck() as in it always returns true, then it is checkmate and the game ends

  const possibleMoves = [];
  let pieces = kingPos.attr('color')[0] === 'w' ? $('span[class*=white]') : $('span[class*=black]');

  const piecesArray = [...pieces]; // dont know if this works
  const tempPossibleSquares = new Set();
  console.log(kingPos);
  checkingPieces.forEach((checkingPiece) => {
    const checkingPiecePosition = checkingPiece[1] + checkingPiece[2];
    console.log(checkingPiecePosition, kingPos.attr('id'));
    if (
      (checkingPiece[0].toLowerCase() === 'q' && checkingPiece[1] !== kingPos.attr('id')[1]) ||
      checkingPiece[0] === 'b'
    ) {
      let square = movePiecesDiag(checkingPiecePosition, kingPos.attr('id'));
      console.log(square);
      if (square) tempPossibleSquares.add(square); // needs fix
    }
    else if (checkingPiece[0].toLowerCase() === 'r' || checkingPiece[0].toLowerCase() === 'q') {
      let square = movePiecesVertLat(checkingPiecePosition, kingPos.attr('id'));
      console.log(square)
      if(square) tempPossibleSquares.add(square);
    }
    tempPossibleSquares.add(checkingPiecePosition); // can capture the checking piece to stop the check
  });
  console.log(tempPossibleSquares);
  // if the piece is a pawn or a knight, the only way to get unchecked is to move out of the way or to capture them
  piecesArray.forEach((piece) => {
    // if a piece going to this square triggers a discovered check, then dont put this into possible moves
    // since you have the possible squares in which the pieces must go into to protect the king, the next step is to check every piece and see if
    // they can move to protect the king, (not including the king)
    tempPossibleSquares.forEach((square) => {
      console.log(piece);
      if (moveFunctions[piece.id[0]](square, piece.id[1] + piece.id[2])) {
        possibleMoves.push(piece.id, square);
      }
    });
  });
  console.log(possibleMoves);
  return possibleMoves;
}

export function isCheck(kingPos) {
  let pieces = $('#' + kingPos).attr('color')[0] === 'b' ? $('span[class*=white]') : $('span[class*=black]'); //select all of the pieces except for the kings as they cant check each other
  console.log(pieces, kingPos);
  // checks if the move is legal by putting in the destination and looking for checks before actually appending to new square
  const potential_check_pieces = [...pieces];
  const checking_pieces = [];
  potential_check_pieces.forEach((piece) => {
    if (piece.id[0].toUpperCase() !== 'K' && moveFunctions[piece.id[0]]('S' + kingPos[1] + kingPos[2], piece.id))
      checking_pieces.push(piece.id); // if a piece is attacking a king
  });
  return checking_pieces.length > 0 ? checking_pieces : false;
}

function movePiecesDiag(destination, origin) {
  let destLetter = destination[1].charCodeAt(0);
  let origLetter = origin[1].charCodeAt(0);
  const arrayOfAttack = [];

  if (Math.abs(destLetter - origLetter) === 1) return true; // dist = 1
  if (destLetter - origLetter > 0) {
    for (let i = 1; i < destLetter - origLetter; i++) {
      let num;
      destination[2] - origin[2] > 0 ? (num = parseInt(origin[2]) + i) : (num = parseInt(origin[2]) - i);
      let str = String.fromCharCode(origLetter + i) + num;
      arrayOfAttack.push(str);
      if ($('[id$=' + str).length !== 1) return false;
    }
  }
  else {
    for (let i = -1; i > destLetter - origLetter; i--) {
      let num;
      destination[2] - origin[2] > 0 ? (num = parseInt(origin[2]) - i) : (num = parseInt(origin[2]) + i);
      let str = String.fromCharCode(origLetter + i) + num;
      arrayOfAttack.push(str);
      if ($('[id$=' + str).length !== 1) return false;
    }
  }
  console.log(arrayOfAttack, destination, origin);
  return arrayOfAttack;
}

function movePiecesVertLat(destination, origin) {
  console.log(destination, origin);
  let destLetter = destination[1].charCodeAt(0);
  let origLetter = origin[1].charCodeAt(0);
  const arrayOfAttack = [];

  if (Math.abs(destLetter - origLetter) === 1 || Math.abs(destination[2] - origin[2]) === 1) return true;
  else if (destLetter - origLetter > 0) {
    // distance = 1 means nothing can be in the way
    for (let i = 1; i < destLetter - origLetter; i++) {
      let str = String.fromCharCode(origLetter + i) + origin[2];
      console.log(str);
      arrayOfAttack.push(str);
      if ($('[id$=' + str).length !== 1) return false;
    }
  }
  else if (destLetter - origLetter < 0) {
    for (let i = -1; i > destLetter - origLetter; i--) {
      let str = String.fromCharCode(origLetter + i) + origin[2];
      arrayOfAttack.push(str);
      if ($('[id$=' + str).length !== 1) return false;
    }
  }
  else {
    // vertical movement
    if (destination[2] - origin[2] > 0) {
      for (let i = 1; i < destination[2] - origin[2]; i++) {
        let num = parseInt(origin[2]) + i;
        let str = String.fromCharCode(origLetter) + num;
        arrayOfAttack.push(str);
        if ($('[id$=' + str).length !== 1) return false;
      }
    }
    else if (destination[2] - origin[2] < 0) {
      for (let i = -1; i > destination[2] - origin[2]; i--) {
        let num = parseInt(origin[2]) + i;
        let str = String.fromCharCode(origLetter) + num;
        arrayOfAttack.push(str);
        if ($('[id$=' + str).length !== 1) return false;
      }
    }
    console.log(arrayOfAttack, destination, origin);
    return arrayOfAttack;
  }
}

// for every piece move except a pawn, the way u calculate possible moves, is u look at the destination and u backtrack
// say rook a1 and pawn a4, destination is rook a1 - a5. u start with checking if rook a2 is possible, then rook a3 and so forth
// for king check, you ask if it can be captured next move
export const moveFunctions = {
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
      if (movePiecesDiag(destination, origin)) return true;
    }
  },
  r: function canMoveRook(destination, origin) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if (destLetter === origLetter || destination[2] === origin[2]) {
      if (movePiecesVertLat(destination, origin)) return true;
    }
  },
  q: function canMoveQueen(destination, origin) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if ((destLetter === origLetter || destination[2] === origin[2]) && movePiecesVertLat(destination, origin))
      return true;
    else if (
      Math.abs(destLetter - origLetter) === Math.abs(destination[2] - origin[2]) &&
      movePiecesDiag(destination, origin)
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
    let pawnColor = pawn.attr('color');

    if (Math.abs(destLetter - origLetter) === 1) {
      //let enPassent_sqaure;
      //FEN[1] === '-' ? (enPassent_sqaure = null) : (enPassent_sqaure = FEN);
      let attemptedEnPassent_sqaure;
      if ($('#' + destination).children().length > 0 && Math.abs(destination[2] - origin[2]) === 1) {
        return true;
      }
      else if (pawnColor === 'white') {
        attemptedEnPassent_sqaure = $('#S' + destination[1] + (parseInt(destination[2]) - 1));
        //console.log(enPassent_sqaure, attemptedEnPassent_sqaure);
      }
      else if (pawnColor === 'black') {
        attemptedEnPassent_sqaure = $('#S' + destination[1] + (parseInt(destination[2]) + 1));
        //console.log(enPassent_sqaure, attemptedEnPassent_sqaure);
      }
      if (attemptedEnPassent_sqaure) {
        //console.log(attemptedEnPassent_sqaure.children());
      }
    }
    else if (destLetter - origLetter === 0 && pawnColor === 'white') {
      if (destination[2] - origin[2] === 2 || destination[2] - origin[2] === 1) {
        return 'p';
      }
    }
    else if (destLetter - origLetter === 0 && pawnColor === 'black') {
      if (destination[2] - origin[2] === -2 || destination[2] - origin[2] === -1) {
        return 'p';
      }
    }
  }
};
