/* eslint-disable no-loop-func */
import $ from 'jquery';
import findPositionOf, { findAllPieces, copyArrayofArray } from './utilityFunctions';

export default function getPossibleMoves(checkingPieces, kingPos, piecesArray, boardArray, color, enPassentSquare) {
  // if there are checking pieces, then that means that the move that this player makes has to block those checking pieces
  // use isCheck on all of the possibilities, if its a bishop for example, that means that the move either has to be the king moving out of the way
  // (that can be true for all of them, as long as that next position doesnt return a true in isCheck()), or it can be a piece moving into that diag
  // if there are no possible moves to stop isCheck() as in it always returns true, then it is checkmate and the game ends
  const tempPossibleSquares = new Set();

  checkingPieces.forEach((checkingPiece) => {
    if (
      (checkingPiece[0].toLowerCase() === 'q' || checkingPiece[0].toLowerCase() === 'b') &&
      checkingPiece[1] !== kingPos[1]
    ) {
      const squares = DiagPieceAttackingSquares(checkingPiece, kingPos, boardArray);
      if (Array.isArray(squares)) squares.forEach((square) => tempPossibleSquares.add(square));
    }
    if (
      (checkingPiece[0].toLowerCase() === 'r' || checkingPiece[0].toLowerCase() === 'q') &&
      (checkingPiece[1] === kingPos[1] || checkingPiece[2] === kingPos[2])
    ) {
      const squares = VertLatAttackingSquares(checkingPiece, kingPos, boardArray);
      if (Array.isArray(squares)) squares.forEach((square) => tempPossibleSquares.add(square));
    }
    tempPossibleSquares.add(checkingPiece[1] + checkingPiece[2]); // can capture the checking piece to stop the check
    // if the piece is a pawn or a knight, the only way to get unchecked is to move out of the way or to capture them
  });

  console.log(tempPossibleSquares);
  const possibleMoves = [];

  piecesArray.forEach((piece) => {
    // if a piece going to this square triggers a discovered check, then dont put this into possible moves
    // since you have the possible squares in which the pieces must go into to protect the king, the next step is to check every piece and see if
    // they can move to protect the king, (not including the king)
    tempPossibleSquares.forEach((square) => {
      if (moveFunctions[piece[0].toLowerCase()]('S' + square, piece, boardArray, enPassentSquare)) {
        const temp_board = copyArrayofArray(boardArray);
        temp_board[7 - (parseInt(square[1]) - 1)][square.charCodeAt(0) - 'a'.charCodeAt(0)] = piece[0];
        temp_board[7 - (parseInt(piece[2]) - 1)][piece.charCodeAt(1) - 'a'.charCodeAt(0)] = '1';
        if (!isCheck(kingPos, temp_board)) {
          possibleMoves.push([piece, square]);
        }
        else {
          console.error(piece, square);
        }
      }
    });
  });
  console.log(possibleMoves, 'possibleMoves');

  if (getKingMoves(kingPos, color, boardArray).length === 0 && possibleMoves.length === 0) {
    console.log('CHECKMATE'); // IT WORKS!!!
    return false;
  }
  else return true;
}

export function isCheck(kingPos, boardArray) {
  if (!kingPos) return false;
  const pieces = findAllPieces(boardArray, getColor(kingPos[0])); //select all of the pieces except for the kings as they cant check each other
  // checks if the move is legal by putting in the destination and looking for checks before actually appending to new square
  const potentialCheckingPieces = [...pieces];
  const checkingPieces = [];
  potentialCheckingPieces.forEach((piece) => {
    const returnVal = moveFunctions[piece[0].toLowerCase()]('S' + kingPos[1] + kingPos[2], piece, boardArray);
    if (returnVal && returnVal !== 'p') checkingPieces.push(piece); // if a piece is attacking a king
  });
  return checkingPieces.length > 0 ? checkingPieces : false;
}

function DiagPieceAttackingSquares(destination, origin, board) {
  const destLetter = destination.charCodeAt(1);
  const origLetter = origin.charCodeAt(1);
  const destNumber = parseInt(destination[2]);
  const origNumber = parseInt(origin[2]);

  const arrayOfAttack = [];

  if (Math.abs(destLetter - origLetter) === 1) return true; // dist = 1 so no squares in between to seperate

  if (destLetter - origLetter > 0) {
    for (let i = 1; i < destLetter - origLetter; i++) {
      let num;
      destNumber - origNumber > 0 ? (num = origNumber + i) : (num = origNumber - i);
      const str = String.fromCharCode(origLetter + i) + num;
      arrayOfAttack.push(str);
      if (board[8 - num][origLetter + i - 'a'.charCodeAt(0)] !== '1') return false;
    }
  }
  else {
    for (let i = -1; i > destLetter - origLetter; i--) {
      let num;
      destNumber - origNumber > 0 ? (num = origNumber - i) : (num = origNumber + i);
      const str = String.fromCharCode(origLetter + i) + num;
      arrayOfAttack.push(str);
      if (board[8 - num][origLetter + i - 'a'.charCodeAt(0)] !== '1') return false;
    }
  }
  return arrayOfAttack;
}

function VertLatAttackingSquares(destination, origin, board) {
  const destLetter = destination.charCodeAt(1);
  const origLetter = origin.charCodeAt(1);
  const destNumber = parseInt(destination[2]);
  const origNumber = parseInt(origin[2]);
  if (origin.length < 3) console.log(destination, origin, board);
  const arrayOfAttack = [];

  // distance = 1 means nothing can be in the way of the move except the destination itself
  if (
    (Math.abs(destLetter - origLetter) === 1 && destination[2] === origin[2]) ||
    (Math.abs(destNumber - origNumber) === 1 && destLetter === origLetter)
  )
    return true;
  else if (destLetter > origLetter) {
    for (let i = 1; i < destLetter - origLetter; i++) {
      const str = String.fromCharCode(origLetter + i) + origin[2];
      arrayOfAttack.push(str);

      if (board[8 - origNumber][origLetter + i - 'a'.charCodeAt(0)] !== '1') return false;
    }
  }
  else if (destLetter < origLetter) {
    for (let i = -1; i > destLetter - origLetter; i--) {
      const str = String.fromCharCode(origLetter + i) + origin[2];
      arrayOfAttack.push(str);

      if (board[8 - origNumber][origLetter + i - 'a'.charCodeAt(0)] !== '1') return false;
    }
    return arrayOfAttack;
  }
  else {
    // vertical movement
    if (destNumber > origNumber) {
      for (let i = 1; i < destNumber - origNumber; i++) {
        const num = origNumber + i;
        const str = origin[1] + num;

        arrayOfAttack.push(str);
        if (board[8 - num][origLetter - 'a'.charCodeAt(0)] !== '1') return false;
      }
    }
    else if (destNumber < origNumber) {
      for (let i = -1; i > destNumber - origNumber; i--) {
        const num = origNumber + i;
        const str = origin[1] + num;

        arrayOfAttack.push(str);
        if (board[8 - num][origLetter - 'a'.charCodeAt(0)] !== '1') return false;
      }
    }
    console.log(arrayOfAttack);
    return arrayOfAttack;
  }
}

export function getColor(pieceType) {
  if (pieceType && pieceType.toUpperCase() === pieceType) return 'w';
  else return 'b';
}

export function highlightSquares(piece, enPassentSquare, boardArray, castling) {
  const position = piece[1] + piece[2];

  switch (piece[0]) {
    case 'p':
      return getBlackPawnMoves(position, 'b', enPassentSquare, boardArray);
    case 'P':
      return getWhitePawnMoves(position, 'w', enPassentSquare, boardArray);
    case 'n':
      return getKnightMoves(position, 'b', boardArray);
    case 'N':
      return getKnightMoves(position, 'w', boardArray);
    case 'q':
      return getQueenMoves(position, 'b', boardArray);
    case 'Q':
      return getQueenMoves(position, 'w', boardArray);
    case 'r':
      return getRookMoves(position, 'b', boardArray);
    case 'R':
      return getRookMoves(position, 'w', boardArray);
    case 'b':
      return getBishopMoves(position, 'b', boardArray);
    case 'B':
      return getBishopMoves(position, 'w', boardArray);
    case 'k':
      return getKingMoves(position, 'b', boardArray, castling);
    case 'K':
      return getKingMoves(position, 'w', boardArray, castling);

    default:
      break;
  }
}

function getKingMoves(position, color, boardArray, castling) {
  const possibleMoves = [];
  const destinations = [[-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]];
  const positionLetter = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);

  for (let i = 0; i < 8; i++) {
    const newLetter = positionLetter + destinations[i][0];
    const newNumber = positionNum + destinations[i][1];
    if (newNumber <= 8 && newNumber > 0 && newLetter >= 'a'.charCodeAt(0) && newLetter <= 'h'.charCodeAt(0)) {
      const square = $('#S' + String.fromCharCode(newLetter) + newNumber);
      const temp_board = copyArrayofArray(boardArray);
      temp_board[7 - (newNumber - 1)][newLetter - 'a'.charCodeAt(0)] = color === 'w' ? 'K' : 'k';
      temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
      if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) continue;
      else if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
      }
      else if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  if (castling !== '') {
    if(color === 'w') {
      if (castling.includes('K')) {
        for (let i = 1; i < 3; i++) {
          const temp_board = copyArrayofArray(boardArray);
          if (temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0) + i] !== '1') break;
          temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0) + i] = 'K';
          temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
          console.log(temp_board, isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board), i);
          if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) break;
          if (i === 2) possibleMoves.push('O' + String.fromCharCode(positionLetter + i) + '1');
        }
      }
      if (castling.includes('Q')) {
        for (let i = 1; i < 3; i++) {
          const temp_board = copyArrayofArray(boardArray);
          if (temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0) - i] !== '1') break;
          temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0) - i] = 'K';
          temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
          console.log(temp_board, isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board), i);
          if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) break;
          if (i === 2) possibleMoves.push('O' + String.fromCharCode(positionLetter - i) + '1');
        }
      }
    }
    
    else if(color === 'b') {
      if (castling.includes('k')) {
        for (let i = 1; i < 3; i++) {
          const temp_board = copyArrayofArray(boardArray);
          if (temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0) + i] !== '1') break;
          temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0) + i] = 'K';
          temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
          console.log(temp_board, isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board), i);
          if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) break;
          if (i === 2) possibleMoves.push('O' + String.fromCharCode(positionLetter + i) + '8');
        }
      }
      if (castling.includes('q')) {
        for (let i = 1; i < 3; i++) {
          const temp_board = copyArrayofArray(boardArray);
          if (temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0) - i] !== '1') break;
          temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0) - i] = 'K';
          temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
          console.log(temp_board, isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board), i);
          if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) break;
          if (i === 2) possibleMoves.push('O' + String.fromCharCode(positionLetter - i) + '8');
        }
      }
    }
    
  }
  return possibleMoves;
}

function getKnightMoves(position, color, boardArray) {
  const possibleMoves = [];
  const destinations = [[-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1]]; // all the knight moves
  const positionLetter = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);

  for (let i = 0; i < 8; i++) {
    const newLetter = positionLetter + destinations[i][0];
    const newNumber = positionNum + destinations[i][1];
    if (newNumber <= 8 && newNumber > 0 && newLetter >= 'a'.charCodeAt(0) && newLetter <= 'h'.charCodeAt(0)) {
      const square = $('#S' + String.fromCharCode(newLetter) + newNumber);
      const temp_board = copyArrayofArray(boardArray);
      temp_board[7 - (newNumber - 1)][newLetter - 'a'.charCodeAt(0)] = color === 'w' ? 'N' : 'n';
      temp_board[7 - (positionNum - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
      if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) continue;
      else if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]);
        }
      }
      else if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  return possibleMoves;
}

function getWhitePawnMoves(position, color, enPassentSquare, boardArray) {
  const possibleMoves = [];
  const positionLetter = position.charCodeAt(0);

  if (!$('#S' + position[0] + (parseInt(position[1]) + 1))[0].firstChild) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - parseInt(position[1])][positionLetter - 'a'.charCodeAt(0)] = 'P';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push(position[0] + (parseInt(position[1]) + 1));
    }
  }
  if (position[1] === '2' && !$('#S' + position[0] + (parseInt(position[1]) + 2))[0].firstChild) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) + 1)][positionLetter - 'a'.charCodeAt(0)] = 'P';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push(position[0] + (parseInt(position[1]) + 2));
    }
  }

  const upLeft =
    positionLetter - 1 >= 'a'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter - 1) + (parseInt(position[1]) + 1))
      : null;
  const upRight =
    positionLetter + 1 <= 'h'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter + 1) + (parseInt(position[1]) + 1))
      : null;

  if (upLeft && upLeft[0].firstChild !== null && getColor(upLeft[0].firstChild.id[0]) !== color) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - parseInt(position[1])][positionLetter - 1 - 'a'.charCodeAt(0)] = 'P';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push('C' + upLeft[0].id[1] + upLeft[0].id[2]);
    }
  }
  if (upRight && upRight[0].firstChild !== null && getColor(upRight[0].firstChild.id[0]) !== color) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - parseInt(position[1])][positionLetter + 1 - 'a'.charCodeAt(0)] = 'P';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push('C' + upRight[0].id[1] + upRight[0].id[2]);
    }
  }
  if (
    enPassentSquare &&
    position[1] === '5' &&
    enPassentSquare[1] === '6' &&
    Math.abs(enPassentSquare.charCodeAt(0) - positionLetter) === 1
  ) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    temp_board[7 - (parseInt(enPassentSquare[1]) - 1)][enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0)] = 'P';
    temp_board[7 - parseInt(enPassentSquare[1])][enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0)] = '1'; // pawn that is getting captured
    if (!isCheck(findPositionOf(temp_board, 'K'), temp_board)) {
      possibleMoves.push('E' + enPassentSquare);
    }
  }

  return possibleMoves;
}

function getBlackPawnMoves(position, color, enPassentSquare, boardArray) {
  const possibleMoves = [];
  const positionLetter = position.charCodeAt(0);

  if (!$('#S' + position[0] + (parseInt(position[1]) - 1))[0].firstChild) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 2)][positionLetter - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, 'k'), temp_board)) {
      possibleMoves.push(position[0] + (parseInt(position[1]) - 1));
    }
  }
  if (position[1] === '7' && !$('#S' + position[0] + (parseInt(position[1]) - 2))[0].firstChild) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 3)][positionLetter - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, 'k'), temp_board)) {
      possibleMoves.push(position[0] + (parseInt(position[1]) - 2));
    }
  }

  const upLeft =
    positionLetter + 1 <= 'h'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter + 1) + (parseInt(position[1]) - 1))
      : null;
  const upRight =
    positionLetter - 1 >= 'a'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter - 1) + (parseInt(position[1]) - 1))
      : null;

  if (upLeft && upLeft[0].firstChild !== null && getColor(upLeft[0].firstChild.id[0]) !== color) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 2)][positionLetter + 1 - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push('C' + upLeft[0].id[1] + upLeft[0].id[2]);
    }
  }
  if (upRight && upRight[0].firstChild !== null && getColor(upRight[0].firstChild.id[0]) !== color) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 2)][positionLetter - 1 - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push('C' + upRight[0].id[1] + upRight[0].id[2]);
    }
  }
  if (
    enPassentSquare &&
    position[1] === '4' &&
    enPassentSquare[1] === '3' &&
    Math.abs(enPassentSquare.charCodeAt(0) - positionLetter) === 1
  ) {
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(enPassentSquare[1]) - 1)][enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    temp_board[7 - parseInt(enPassentSquare[1])][enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0)] = '1';
    console.log(temp_board);
    if (!isCheck(findPositionOf(temp_board, 'k'), temp_board)) {
      possibleMoves.push('E' + enPassentSquare);
      console.log(possibleMoves);
    }
  }

  return possibleMoves;
}

function getVerticalMoves(position, color, boardArray) {
  const possibleMoves = [];

  const positionNum = parseInt(position[1]);
  const differenceFromTop = 8 - positionNum;
  const differenceFromBottom = positionNum - 1;

  for (let i = 0; i < differenceFromTop; i++) {
    const square = $('#S' + position[0] + (positionNum + i + 1));
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (positionNum + i)][position.charCodeAt(0) - 'a'.charCodeAt(0)] = color === 'w' ? 'R' : 'r'; // the piece actually shouldnt matter, as long as the positions are accurate to see if its a discovered check
    temp_board[7 - (positionNum - 1)][position.charCodeAt(0) - 'a'.charCodeAt(0)] = '1';
    if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      break;
    }
    else if (square[0].firstChild) {
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
    const square = $('#S' + position[0] + (positionNum - i - 1));
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (positionNum - i - 2)][position.charCodeAt(0) - 'a'.charCodeAt(0)] = color === 'w' ? 'R' : 'r';
    temp_board[7 - (positionNum - 1)][position.charCodeAt(0) - 'a'.charCodeAt(0)] = '1';
    if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      break;
    }
    else if (square[0].firstChild) {
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

function getRookMoves(position, color, boardArray) {
  const possibleMoves = [];
  possibleMoves.push(...getVerticalMoves(position, color, boardArray));

  const positionCharCode = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);
  const differenceFromLeft = positionCharCode - 'a'.charCodeAt(0);
  const differenceFromRight = 'h'.charCodeAt(0) - positionCharCode;

  for (let i = 0; i < differenceFromLeft; i++) {
    const square = $('#S' + String.fromCharCode(positionCharCode - i - 1) + positionNum);

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
    const square = $('#S' + String.fromCharCode(positionCharCode + i + 1) + positionNum);
    const temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (positionNum - 1)][positionCharCode + i + 1 - 'a'.charCodeAt(0)] = color === 'w' ? 'R' : 'r';
    temp_board[7 - (positionNum - 1)][differenceFromLeft - 1] = '1';
    if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      break;
    }
    else if (square[0].firstChild) {
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

function getBishopMoves(position, color, boardArray) {
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
    const squares = [];
    if (lbDiag && positionNum - i - 1 > 0)
      squares.push([
        boardArray[7 - (positionNum - i - 2)][differenceFromLeft - i - 1],
        String.fromCharCode(positionCharCode - i - 1) + (positionNum - i - 1),
        'lbDiag'
      ]);
    if (ltDiag && positionNum + i + 1 <= 8)
      squares.push([
        boardArray[7 - (positionNum + i)][differenceFromLeft - i - 1],
        String.fromCharCode(positionCharCode - i - 1) + (positionNum + i + 1),
        'ltDiag'
      ]);
    for (let j = 0; j < squares.length; j++) {
      const square = squares[j];
      const temp_board = copyArrayofArray(boardArray);
      temp_board[7 - (parseInt(square[1][1]) - 1)][differenceFromLeft - i - 1] = color === 'w' ? 'B' : 'b';
      temp_board[7 - (positionNum - 1)][differenceFromLeft] = '1';
      console.log(isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board));

      if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
        if (square[2] === 'lbDiag') lbDiag = false;
        else if (square[2] === 'ltDiag') ltDiag = false;
      }
      else if (square[0] !== '1') {
        if (color !== getColor(square[0])) {
          possibleMoves.push('C' + square[1]); // 'C' for captureHint
        }
        if (square[2] === 'lbDiag') lbDiag = false;
        else if (square[2] === 'ltDiag') ltDiag = false;
      }
      else if (square[0] === '1') possibleMoves.push(square[1]);
    }
  }
  for (let i = 0; i < differenceFromRight; i++) {
    const squares = [];
    if (rbDiag && positionNum - i - 1 > 0) {
      squares.push([
        boardArray[7 - (positionNum - i - 2)][differenceFromLeft + i + 1],
        String.fromCharCode(positionCharCode + i + 1) + (positionNum - i - 1),
        'rbDiag'
      ]);
    }
    if (rtDiag && positionNum + i + 1 <= 8)
      squares.push([
        boardArray[7 - (positionNum + i)][differenceFromLeft + i + 1],
        String.fromCharCode(positionCharCode + i + 1) + (positionNum + i + 1),
        'rtDiag'
      ]);

    for (let j = 0; j < squares.length; j++) {
      const square = squares[j];
      const temp_board = copyArrayofArray(boardArray);
      temp_board[7 - (parseInt(square[1][1]) - 1)][differenceFromLeft + i + 1] = color === 'w' ? 'B' : 'b';
      temp_board[7 - (positionNum - 1)][differenceFromLeft] = '1';
      console.log(isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board));

      if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
        if (square[2] === 'rbDiag') rbDiag = false;
        else if (square[2] === 'rtDiag') rtDiag = false;
      }
      else if (square[0] !== '1') {
        if (color !== getColor(square[0])) {
          possibleMoves.push('C' + square[1]); // 'C' for captureHint
        }
        if (square[2] === 'rbDiag') rbDiag = false;
        else if (square[2] === 'rtDiag') rtDiag = false;
      }
      else if (square[0] === '1') possibleMoves.push(square[1]);
    }
  }
  return possibleMoves;
}

function getQueenMoves(position, color, boardArray) {
  const possibleMoves = [];
  possibleMoves.push(...getVerticalMoves(position, color, boardArray));

  const positionCharCode = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);
  const differenceFromLeft = positionCharCode - 'a'.charCodeAt(0);
  const differenceFromRight = 'h'.charCodeAt(0) - positionCharCode;

  let lbDiag, lMid, ltDiag, rbDiag, rMid, rtDiag;
  lbDiag = lMid = ltDiag = rbDiag = rMid = rtDiag = true;

  for (let i = 0; i < differenceFromLeft; i++) {
    // make this into diagonals function so that bishop can use
    // get left horizontal, top left diag, bottom left diag
    const squares = [];
    if (lbDiag && positionNum - i - 1 > 0)
      squares.push([
        boardArray[7 - (positionNum - i - 2)][differenceFromLeft - i - 1],
        String.fromCharCode(positionCharCode - i - 1) + (positionNum - i - 1),
        'lbDiag'
      ]);
    if (lMid)
      squares.push([
        boardArray[7 - (positionNum - 1)][differenceFromLeft - i - 1],
        String.fromCharCode(positionCharCode - i - 1) + positionNum,
        'lMid'
      ]);
    if (ltDiag && positionNum + i + 1 <= 8)
      squares.push([
        boardArray[7 - (positionNum + i)][differenceFromLeft - i - 1],
        String.fromCharCode(positionCharCode - i - 1) + (positionNum + i + 1),
        'ltDiag'
      ]);
    for (let j = 0; j < squares.length; j++) {
      const square = squares[j];
      const temp_board = copyArrayofArray(boardArray);
      temp_board[7 - (parseInt(square[1][1]) - 1)][differenceFromLeft - i - 1] = color === 'w' ? 'Q' : 'q';
      temp_board[7 - (positionNum - 1)][differenceFromLeft] = '1';
      console.log(square, temp_board, isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board));
      if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
        if (square[2] === 'lbDiag') lbDiag = false;
        else if (square[2] === 'lMid') lMid = false;
        else if (square[2] === 'ltDiag') ltDiag = false;
      }
      else if (square[0] !== '1') {
        if (color !== getColor(square[0])) {
          possibleMoves.push('C' + square[1]); // 'C' for captureHint
        }
        if (square[2] === 'lbDiag') lbDiag = false;
        else if (square[2] === 'lMid') lMid = false;
        else if (square[2] === 'ltDiag') ltDiag = false;
      }
      else if (square[0] === '1') possibleMoves.push(square[1]);
    }
  }
  for (let i = 0; i < differenceFromRight; i++) {
    const squares = [];
    if (rbDiag && positionNum - i - 1 > 0) {
      squares.push([
        boardArray[7 - (positionNum - i - 2)][differenceFromRight + i],
        String.fromCharCode(positionCharCode + i + 1) + (positionNum - i - 1),
        'rbDiag'
      ]);
    }
    if (rMid)
      squares.push([
        boardArray[7 - (positionNum - 1)][differenceFromRight + i],
        String.fromCharCode(positionCharCode + i + 1) + positionNum,
        'rMid'
      ]);
    if (rtDiag && positionNum + i + 1 <= 8) {
      console.log(7 - (positionNum + i), differenceFromRight + i);
      squares.push([
        boardArray[7 - (positionNum + i)][differenceFromRight + i],
        String.fromCharCode(positionCharCode + i + 1) + (positionNum + i + 1),
        'rtDiag'
      ]);
    }

    for (let j = 0; j < squares.length; j++) {
      const square = squares[j];
      const temp_board = copyArrayofArray(boardArray);
      temp_board[7 - (parseInt(square[1][1]) - 1)][differenceFromRight + i] = color === 'w' ? 'Q' : 'q';
      temp_board[7 - (positionNum - 1)][differenceFromLeft] = '1';

      if (isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
        if (square[2] === 'rbDiag') rbDiag = false;
        else if (square[2] === 'rMid') rMid = false;
        else if (square[2] === 'rtDiag') rtDiag = false;
      }
      else if (square[0] !== '1') {
        if (color !== getColor(square[0])) {
          possibleMoves.push('C' + square[1]); // 'C' for captureHint
        }
        if (square[2] === 'rbDiag') rbDiag = false;
        else if (square[2] === 'rMid') rMid = false;
        else if (square[2] === 'rtDiag') rtDiag = false;
      }
      else if (square[0] === '1') possibleMoves.push(square[1]);
    }
  }
  return possibleMoves;
}

export const moveFunctions = {
  n: function Knight(destination, origin) {
    const destLetter = destination[1].charCodeAt(0);
    const origLetter = origin[1].charCodeAt(0);
    if (
      (Math.abs(destLetter - origLetter) === 2 && Math.abs(destination[2] - origin[2]) === 1) ||
      (Math.abs(destLetter - origLetter) === 1 && Math.abs(destination[2] - origin[2]) === 2)
    )
      return true;
  },
  b: function Bishop(destination, origin, board) {
    const destLetter = destination[1].charCodeAt(0);
    const origLetter = origin[1].charCodeAt(0);
    if (Math.abs(destLetter - origLetter) === Math.abs(destination[2] - origin[2])) {
      if (DiagPieceAttackingSquares(destination, origin, board)) return true;
    }
  },
  r: function Rook(destination, origin, board) {
    const destLetter = destination[1].charCodeAt(0);
    const origLetter = origin[1].charCodeAt(0);
    if (destLetter === origLetter || destination[2] === origin[2]) {
      if (VertLatAttackingSquares(destination, origin, board)) return true;
    }
  },
  q: function Queen(destination, origin, board) {
    const destLetter = destination[1].charCodeAt(0);
    const origLetter = origin[1].charCodeAt(0);
    if (
      (destLetter === origLetter || destination[2] === origin[2]) &&
      VertLatAttackingSquares(destination, origin, board)
    ) {
      return true;
    }
    else if (
      Math.abs(destLetter - origLetter) === Math.abs(destination[2] - origin[2]) &&
      DiagPieceAttackingSquares(destination, origin, board)
    )
      return true;
  },
  k: function King(destination, origin) {
    const destLetter = destination[1].charCodeAt(0);
    const origLetter = origin[1].charCodeAt(0);
    if (
      (Math.abs(destLetter - origLetter) === 1 || Math.abs(destLetter - origLetter) === 0) &&
      (Math.abs(destination[2] - origin[2]) === 1 || Math.abs(destination[2] - origin[2]) === 0)
    )
      return true;
  },
  p: function Pawn(destination, origin, board, enPassentSquare) {
    const destLetter = destination.charCodeAt(1);
    const origLetter = origin.charCodeAt(1);
    const destNumber = parseInt(destination[2]);
    const origNumber = parseInt(origin[2]);
    if (enPassentSquare && destination === enPassentSquare) {
      if (
        getColor(origin[0]) === 'w' &&
        origin[2] === '5' &&
        enPassentSquare[1] === '6' &&
        Math.abs(origLetter - enPassentSquare.charCodeAt(0)) === 1
      )
        return true;
      else if (
        getColor(origin[0]) === 'b' &&
        origin[2] === '4' &&
        enPassentSquare[1] === '3' &&
        Math.abs(origLetter - enPassentSquare.charCodeAt(0)) === 1
      )
        return true;
      // no other way to reach en passent square than en passent for a pawn
    }
    else if (
      Math.abs(destLetter - origLetter) === 1 &&
      Math.abs(destNumber - origNumber) === 1 &&
      board[destLetter - 'a'.charCodeAt(0)][8 - destNumber] !== '1'
    ) {
      return true;
    }
    else if (destLetter === origLetter && board[destLetter - 'a'.charCodeAt(0)][8 - destNumber] === '1') {
      if (getColor(origin[0]) === 'w' && origin[2] === '2' && destination[2] === '4') return 'p';
      else if (getColor(origin[0]) === 'b' && origin[2] === '7' && destination[2] === '5') return 'p';
      else if (getColor(origin[0]) === 'w' && destNumber - origNumber === 1) return 'p';
      else if (getColor(origin[0]) === 'b' && destNumber - origNumber === -1) return 'p';
    }
    return false;
  }
};
