/* eslint-disable no-loop-func */
import $ from 'jquery';

export default function getPossibleMoves(checkingPieces, yourKing) {
  // if there are checking pieces, then that means that the move that this player makes has to block those checking pieces
  // use isCheck on all of the possibilities, if its a bishop for example, that means that the move either has to be the king moving out of the way
  // (that can be true for all of them, as long as that next position doesnt return a true in isCheck()), or it can be a piece moving into that diag
  // if there are no possible moves to stop isCheck() as in it always returns true, then it is checkmate and the game ends

  const possibleMoves = [];
  const pieces = yourKing.attr('color')[0] === 'w' ? $('span[class*=white]') : $('span[class*=black]');
  const piecesArray = [...pieces];
  const tempPossibleSquares = new Set();

  checkingPieces.forEach((checkingPiece) => {
    if (
      (checkingPiece[0].toLowerCase() === 'q' && checkingPiece[1] !== yourKing.attr('id')[1]) ||
      checkingPiece[0] === 'b'
    ) {
      const squares = movePiecesDiag(checkingPiece, yourKing.attr('id'));
      if (Array.isArray(squares)) tempPossibleSquares.add(...squares); // needs fix
    }
    else if (checkingPiece[0].toLowerCase() === 'r' || checkingPiece[0].toLowerCase() === 'q') {
      const squares = movePiecesVertLat(checkingPiece, yourKing.attr('id'));
      if (Array.isArray(squares)) tempPossibleSquares.add(...squares);
    }
    tempPossibleSquares.add(checkingPiece[1] + checkingPiece[2]); // can capture the checking piece to stop the check
    // if the piece is a pawn or a knight, the only way to get unchecked is to move out of the way or to capture them
  });
  console.log(tempPossibleSquares);
  piecesArray.forEach((piece) => {
    // if a piece going to this square triggers a discovered check, then dont put this into possible moves
    // since you have the possible squares in which the pieces must go into to protect the king, the next step is to check every piece and see if
    // they can move to protect the king, (not including the king)
    tempPossibleSquares.forEach((square) => {
      if (moveFunctions[piece.id[0]](square, piece.id[1] + piece.id[2])) {
        possibleMoves.push(piece.id, square);
      }
    });
  });
  console.log(possibleMoves, 'possibleMoves');

  return tempPossibleSquares;
}

export function isCheck(kingPos) {
  let pieces = $('#' + kingPos).attr('color')[0] === 'b' ? $('span[class*=white]') : $('span[class*=black]'); //select all of the pieces except for the kings as they cant check each other
  // checks if the move is legal by putting in the destination and looking for checks before actually appending to new square
  const potential_check_pieces = [...pieces];
  const checking_pieces = [];
  potential_check_pieces.forEach((piece) => {
    if (
      piece.id[0].toUpperCase() !== 'K' &&
      moveFunctions[piece.id[0].toLowerCase()]('S' + kingPos[1] + kingPos[2], piece.id)
    )
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
      if ($('[id$=' + str)[0].firstChild !== null) return false;
    }
  }
  else {
    for (let i = -1; i > destLetter - origLetter; i--) {
      let num;
      destination[2] - origin[2] > 0 ? (num = parseInt(origin[2]) - i) : (num = parseInt(origin[2]) + i);
      let str = String.fromCharCode(origLetter + i) + num;
      arrayOfAttack.push(str);
      if ($('[id$=' + str)[0].firstChild !== null) return false;
    }
  }
  return arrayOfAttack;
}

function movePiecesVertLat(destination, origin) {
  let destLetter = destination[1].charCodeAt(0);
  let origLetter = origin[1].charCodeAt(0);
  console.log(destination, origin);
  const arrayOfAttack = [];

  if (
    (Math.abs(destLetter - origLetter) === 1 && destination[2] === origin[2]) ||
    (Math.abs(destination[2] - origin[2]) === 1 && destLetter === origLetter)
  )
    return true;
  else if (destLetter - origLetter > 0) {
    // distance = 1 means nothing can be in the way
    for (let i = 1; i < destLetter - origLetter; i++) {
      let str = String.fromCharCode(origLetter + i) + origin[2];
      console.log(str, $('[id$=' + str)[0].firstChild);
      arrayOfAttack.push(str);
      if ($('[id$=' + str)[0].firstChild !== null) return false;
    }
  }
  else if (destLetter - origLetter < 0) {
    for (let i = -1; i > destLetter - origLetter; i--) {
      let str = String.fromCharCode(origLetter + i) + origin[2];
      console.log(str, $('[id$=' + str)[0].firstChild);

      arrayOfAttack.push(str);
      if ($('[id$=' + str)[0].firstChild !== null) {
        console.log(str, 'here');
        return false;
      }
    }
    return arrayOfAttack;
  }
  else {
    // vertical movement
    if (destination[2] - origin[2] > 0) {
      for (let i = 1; i < destination[2] - origin[2]; i++) {
        let num = parseInt(origin[2]) + i;
        let str = String.fromCharCode(origLetter) + num;

        arrayOfAttack.push(str);
        if ($('[id$=' + str)[0].firstChild !== null) {
          console.log(str);
          return false;
        }
      }
    }
    else if (destination[2] - origin[2] < 0) {
      for (let i = -1; i > destination[2] - origin[2]; i--) {
        let num = parseInt(origin[2]) + i;
        let str = String.fromCharCode(origLetter) + num;

        arrayOfAttack.push(str);
        if ($('[id$=' + str)[0].firstChild !== null) {
          console.log(str);
          return false;
        }
      }
    }
    console.log(arrayOfAttack);
    return arrayOfAttack;
  }
}

function getColor(pieceType) {
  if (pieceType.toUpperCase() === pieceType) return 'w';
  else return 'b';
}

export function highlightSquares(piece, enPassentSquare) {
  const pieceType = piece[0];
  const position = piece[1] + piece[2];

  switch (pieceType) {
    case 'p':
      return getBlackPawnMoves(position, 'b', enPassentSquare);
    case 'P':
      return getWhitePawnMoves(position, 'w', enPassentSquare);
    case 'n':
      return getKnightMoves(position, 'b');
    case 'N':
      return getKnightMoves(position, 'w');
    case 'q':
      return getQueenMoves(position, 'b');
    case 'Q':
      return getQueenMoves(position, 'w');
    case 'r':
      return getRookMoves(position, 'b');
    case 'R':
      return getRookMoves(position, 'w');
    case 'b':
      return getBishopMoves(position, 'b');
    case 'B':
      return getBishopMoves(position, 'w');
    default:
      break;
  }
}

function getWhitePawnMoves(position, color, enPassentSquare) {
  const possibleMoves = [];
  const positionLetter = position.charCodeAt(0);

  if (!$('#S' + position[0] + (parseInt(position[1]) + 1))[0].firstChild)
    possibleMoves.push(position[0] + (parseInt(position[1]) + 1));
  if (position[1] === '2' && !$('#S' + position[0] + (parseInt(position[1]) + 2))[0].firstChild)
    possibleMoves.push(position[0] + (parseInt(position[1]) + 2));

  let upLeft =
    positionLetter - 1 >= 'a'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter - 1) + (parseInt(position[1]) + 1))
      : null;
  let upRight =
    positionLetter + 1 <= 'h'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter + 1) + (parseInt(position[1]) + 1))
      : null;

  if (upLeft && upLeft[0].firstChild !== null && getColor(upLeft[0].firstChild.id[0]) !== color)
    possibleMoves.push('C' + upLeft[0].id[1] + upLeft[0].id[2]);
  if (upRight && upRight[0].firstChild !== null && getColor(upRight[0].firstChild.id[0]) !== color)
    possibleMoves.push('C' + upRight[0].id[1] + upRight[0].id[2]);

  if (
    position[1] === '5' &&
    enPassentSquare[1] === '5' &&
    Math.abs(enPassentSquare.charCodeAt(0) - positionLetter) === 1
  ) {
    possibleMoves.push('E' + enPassentSquare[0] + '4'); // 'E' for enPassent
  }

  return possibleMoves;
}

function getBlackPawnMoves(position, color, enPassentSquare) {
  const possibleMoves = [];
  const positionLetter = position.charCodeAt(0);

  if (!$('#S' + position[0] + (parseInt(position[1]) - 1))[0].firstChild)
    possibleMoves.push(position[0] + (parseInt(position[1]) - 1));
  if (position[1] === '7' && !$('#S' + position[0] + (parseInt(position[1]) - 2))[0].firstChild)
    possibleMoves.push(position[0] + (parseInt(position[1]) - 2));

  let upLeft =
    positionLetter + 1 <= 'h'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter + 1) + (parseInt(position[1]) - 1))
      : null;
  let upRight =
    positionLetter - 1 >= 'a'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter - 1) + (parseInt(position[1]) - 1))
      : null;

  if (upLeft && upLeft[0].firstChild !== null && getColor(upLeft[0].firstChild.id[0]) !== color)
    possibleMoves.push('C' + upLeft[0].id[1] + upLeft[0].id[2]);
  if (upRight && upRight[0].firstChild !== null && getColor(upRight[0].firstChild.id[0]) !== color)
    possibleMoves.push('C' + upRight[0].id[1] + upRight[0].id[2]);

  if (
    position[1] === '4' &&
    enPassentSquare[1] === '4' &&
    Math.abs(enPassentSquare.charCodeAt(0) - positionLetter) === 1
  ) {
    possibleMoves.push('E' + enPassentSquare[0] + '3'); // 'E' for enPassent
  }

  return possibleMoves;
}

function getKnightMoves(position, color) {
  const possibleMoves = [];
  const destinations = [[-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1]]; // all the knight moves
  const positionLetter = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);

  for (let i = 0; i < 8; i++) {
    const newLetter = positionLetter + destinations[i][0];
    const newNumber = positionNum + destinations[i][1];
    if (newNumber <= 8 && newNumber > 0 && newLetter >= 'a'.charCodeAt(0) && newLetter <= 'h'.charCodeAt(0)) {
      let square = $('#S' + String.fromCharCode(newLetter) + newNumber);
      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
      }
      if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  return possibleMoves;
}

function getVerticalMoves(position, color) {
  const possibleMoves = [];

  const positionNum = parseInt(position[1]);
  const differenceFromTop = 8 - positionNum;
  const differenceFromBottom = positionNum - 1;

  for (let i = 0; i < differenceFromTop; i++) {
    let square = $('#S' + position[0] + (positionNum + i + 1));
    console.log(square);

    if (square[0].firstChild) {
      if (color !== getColor(square[0].firstChild.id[0])) {
        possibleMoves.push('C' + square[0].id[1] + square[0].id[2]);
      }
      break;
    }
    else if (!square[0].firstChild) {
      possibleMoves.push(square[0].id[1] + square[0].id[2]);
    }
  }
  for (let i = 0; i < differenceFromBottom; i++) {
    let square = $('#S' + position[0] + (positionNum - i - 1));
    console.log(square);
    if (square[0].firstChild) {
      if (color !== getColor(square[0].firstChild.id[0])) {
        possibleMoves.push('C' + square[0].id[1] + square[0].id[2]);
      }
      break;
    }
    else if (!square[0].firstChild) {
      possibleMoves.push(square[0].id[1] + square[0].id[2]);
    }
  }
  console.log(possibleMoves);
  return possibleMoves;
}

function getRookMoves(position, color) {
  const possibleMoves = [];
  possibleMoves.push(...getVerticalMoves(position, color));

  const positionCharCode = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);
  const differenceFromLeft = positionCharCode - 'a'.charCodeAt(0);
  const differenceFromRight = 'h'.charCodeAt(0) - positionCharCode;

  for (let i = 0; i < differenceFromLeft; i++) {
    let square = $('#S' + String.fromCharCode(positionCharCode - i - 1) + positionNum);
    console.log(square);

    if (square[0].firstChild) {
      if (color !== getColor(square[0].firstChild.id[0])) {
        possibleMoves.push('C' + square[0].id[1] + square[0].id[2]);
      }
      break;
    }
    else if (!square[0].firstChild) {
      possibleMoves.push(square[0].id[1] + square[0].id[2]);
    }
  }
  for (let i = 0; i < differenceFromRight; i++) {
    let square = $('#S' + String.fromCharCode(positionCharCode + i + 1) + positionNum);
    console.log(square);

    if (square[0].firstChild) {
      if (color !== getColor(square[0].firstChild.id[0])) {
        possibleMoves.push('C' + square[0].id[1] + square[0].id[2]);
      }
      break;
    }
    else if (!square[0].firstChild) {
      possibleMoves.push(square[0].id[1] + square[0].id[2]);
    }
  }
  return possibleMoves;
}

function getBishopMoves(position, color) {
  const possibleMoves = [];

  const positionCharCode = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);
  const differenceFromLeft = positionCharCode - 'a'.charCodeAt(0);
  const differenceFromRight = 'h'.charCodeAt(0) - positionCharCode;

  let lbDiag, ltDiag, rbDiag, rtDiag;
  lbDiag = ltDiag = rbDiag = rtDiag = true;
  for (let i = 0; i < differenceFromLeft; i++) {
    // make this into diagonals function so that bishop can use
    // get left horizontal, top left diag, bottom left diag
    let squares = [];
    if (lbDiag && positionNum - i - 1 > 0)
      squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + (positionNum - i - 1))[0], 'lbDiag']);
    if (ltDiag && positionNum + i + 1 <= 8)
      squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + (positionNum + i + 1))[0], 'ltDiag']);
    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];
      console.log(square);

      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
        if (square[1] === 'lbDiag') lbDiag = false;
        else if (square[1] === 'ltDiag') ltDiag = false;
      }
      else if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  for (let i = 0; i < differenceFromRight; i++) {
    let squares = [];
    if (rbDiag && positionNum - i - 1 > 0)
      squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + (positionNum - i - 1))[0], 'rbDiag']);
    if (rtDiag && positionNum + i + 1 <= 8)
      squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + (positionNum + i + 1))[0], 'rtDiag']);

    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];
      console.log(square);
      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
        if (square[1] === 'rbDiag') rbDiag = false;
        else if (square[1] === 'rtDiag') rtDiag = false;
      }
      else if (!square[0].firstChild) {
        console.log(square[0]);
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  return possibleMoves;
}

function getQueenMoves(position, color) {
  const possibleMoves = [];
  possibleMoves.push(...getVerticalMoves(position, color));

  const positionCharCode = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);
  const differenceFromLeft = positionCharCode - 'a'.charCodeAt(0);
  const differenceFromRight = 'h'.charCodeAt(0) - positionCharCode;

  let lbDiag, lMid, ltDiag, rbDiag, rMid, rtDiag;
  lbDiag = lMid = ltDiag = rbDiag = rMid = rtDiag = true;

  for (let i = 0; i < differenceFromLeft; i++) {
    // make this into diagonals function so that bishop can use
    // get left horizontal, top left diag, bottom left diag
    let squares = [];
    if (lbDiag && positionNum - i - 1 > 0)
      squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + (positionNum - i - 1))[0], 'lbDiag']);
    if (lMid) squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + positionNum)[0], 'lMid']);
    if (ltDiag && positionNum + i + 1 <= 8)
      squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + (positionNum + i + 1))[0], 'ltDiag']);
    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];
      console.log(square);

      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
        if (square[1] === 'lbDiag') lbDiag = false;
        else if (square[1] === 'lMid') lMid = false;
        else if (square[1] === 'ltDiag') ltDiag = false;
      }
      else if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  for (let i = 0; i < differenceFromRight; i++) {
    let squares = [];
    if (rbDiag && positionNum - i - 1 > 0)
      squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + (positionNum - i - 1))[0], 'rbDiag']);
    if (rMid) squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + positionNum)[0], 'rMid']);
    if (rtDiag && positionNum + i + 1 <= 8)
      squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + (positionNum + i + 1))[0], 'rtDiag']);

    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];
      console.log(square);
      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
        if (square[1] === 'rbDiag') rbDiag = false;
        else if (square[1] === 'rMid') rMid = false;
        else if (square[1] === 'rtDiag') rtDiag = false;
      }
      else if (!square[0].firstChild) {
        console.log(square[0]);
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  return possibleMoves;
}

export const moveFunctions = {
  n: function Knight(destination, origin) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if (
      (Math.abs(destLetter - origLetter) === 2 && Math.abs(destination[2] - origin[2]) === 1) ||
      (Math.abs(destLetter - origLetter) === 1 && Math.abs(destination[2] - origin[2]) === 2)
    )
      return true;
  },
  b: function Bishop(destination, origin) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if (Math.abs(destLetter - origLetter) === Math.abs(destination[2] - origin[2])) {
      if (movePiecesDiag(destination, origin)) return true;
    }
  },
  r: function Rook(destination, origin) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if (destLetter === origLetter || destination[2] === origin[2]) {
      if (movePiecesVertLat(destination, origin)) return true;
    }
  },
  q: function Queen(destination, origin) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if ((destLetter === origLetter || destination[2] === origin[2]) && movePiecesVertLat(destination, origin)) {
      return true;
    }
    else if (
      Math.abs(destLetter - origLetter) === Math.abs(destination[2] - origin[2]) &&
      movePiecesDiag(destination, origin)
    )
      return true;
  },
  k: function King(destination, origin) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if (
      (Math.abs(destLetter - origLetter) === 1 || Math.abs(destLetter - origLetter) === 0) &&
      (Math.abs(destination[2] - origin[2]) === 1 || Math.abs(destination[2] - origin[2]) === 0)
    )
      return true;
  },
  p: function Pawn(destination, origin) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    let pawn = $('#' + origin);
    let pawnColor = pawn.attr('color');

    if (Math.abs(destLetter - origLetter) === 1) {
      //let enPassent_sqaure;
      //FEN[1] === '-' ? (enPassent_sqaure = null) : (enPassent_sqaure = FEN);
      let attemptedEnPassent_sqaure;
      if ($('#' + destination)[0].firstChild !== null && Math.abs(destination[2] - origin[2]) === 1) {
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
