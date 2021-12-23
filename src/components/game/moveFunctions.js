/* eslint-disable no-loop-func */
import $ from 'jquery';
import findPositionOf, { findAllPieces, copyArrayofArray } from './findBoardIndex';

export default function getPossibleMoves(checkingPieces, kingPos, piecesArray, boardArray, color) {
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
      const squares = movePiecesDiag(checkingPiece, kingPos, boardArray);
      console.log(squares);
      if (Array.isArray(squares)) tempPossibleSquares.add(...squares); // needs fix
    }
    if (
      (checkingPiece[0].toLowerCase() === 'r' || checkingPiece[0].toLowerCase() === 'q') &&
      (checkingPiece[1] === kingPos[1] || checkingPiece[2] === kingPos[2])
    ) {
      const squares = movePiecesVertLat(checkingPiece, kingPos, boardArray);
      if (Array.isArray(squares)) tempPossibleSquares.add(...squares);
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
    console.log(piece);
    tempPossibleSquares.forEach((square) => {
      if (moveFunctions[piece[0]](square, piece[1] + piece[2])) {
        possibleMoves.push([piece, square]);
        console.log(piece, square);
      }
    });
  });
  console.log(possibleMoves, 'possibleMoves');

  if (getKingMoves(kingPos, color, boardArray).length === 0 && possibleMoves.length === 0) return 'checkMate';
  else return true;
}

export function isCheck(kingPos, boardArray) {
  const pieces = findAllPieces(boardArray, kingPos[0].toLowerCase() === kingPos[0] ? 'b' : 'w'); //select all of the pieces except for the kings as they cant check each other
  // checks if the move is legal by putting in the destination and looking for checks before actually appending to new square
  const potentialCheckingPieces = [...pieces];
  const checkingPieces = [];
  potentialCheckingPieces.forEach((piece) => {
    if (moveFunctions[piece[0].toLowerCase()]('S' + kingPos[1] + kingPos[2], piece, boardArray))
      checkingPieces.push(piece); // if a piece is attacking a king
  });
  return checkingPieces.length > 0 ? checkingPieces : false;
}

function movePiecesDiag(destination, origin, board) {
  let destLetter = destination[1].charCodeAt(0);
  let origLetter = origin[1].charCodeAt(0);
  const arrayOfAttack = [];

  if (Math.abs(destLetter - origLetter) === 1) return true; // dist = 1 so no squares in between to seperate

  if (destLetter - origLetter > 0) {
    for (let i = 1; i < destLetter - origLetter; i++) {
      let num;
      destination[2] - origin[2] > 0 ? (num = parseInt(origin[2]) + i) : (num = parseInt(origin[2]) - i);
      let str = String.fromCharCode(origLetter + i) + num;
      arrayOfAttack.push(str);
      if (board[origLetter + i - 'a'.charCodeAt(0)][8 - num] !== '1') return false;
    }
  }
  else {
    for (let i = -1; i > destLetter - origLetter; i--) {
      let num;
      destination[2] - origin[2] > 0 ? (num = parseInt(origin[2]) - i) : (num = parseInt(origin[2]) + i);
      let str = String.fromCharCode(origLetter + i) + num;
      arrayOfAttack.push(str);
      if (board[origLetter + i - 'a'.charCodeAt(0)][8 - num] !== '1') return false;
    }
  }
  return arrayOfAttack;
}

function movePiecesVertLat(destination, origin, board) {
  let destLetter = destination[1].charCodeAt(0);
  let origLetter = origin[1].charCodeAt(0);
  console.log(destination, origin);
  const arrayOfAttack = [];

  // distance = 1 means nothing can be in the way of the move except the destination itself
  if (
    (Math.abs(destLetter - origLetter) === 1 && destination[2] === origin[2]) ||
    (Math.abs(destination[2] - origin[2]) === 1 && destLetter === origLetter)
  )
    return true;
  else if (destLetter > origLetter) {
    for (let i = 1; i < destLetter - origLetter; i++) {
      let str = String.fromCharCode(origLetter + i) + origin[2];
      arrayOfAttack.push(str);

      if (board[origLetter + i - 'a'.charCodeAt(0)][8 - parseInt(origin[2])] !== '1') return false;
    }
  }
  else if (destLetter < origLetter) {
    for (let i = -1; i > destLetter - origLetter; i--) {
      let str = String.fromCharCode(origLetter + i) + origin[2];
      arrayOfAttack.push(str);

      if (board[origLetter + i - 'a'.charCodeAt(0)][8 - parseInt(origin[2])] !== '1') return false;
    }
    return arrayOfAttack;
  }
  else {
    // vertical movement
    if (destination[2] > origin[2]) {
      for (let i = 1; i < destination[2] - origin[2]; i++) {
        let num = parseInt(origin[2]) + i;
        let str = origin[1] + num;

        arrayOfAttack.push(str);
        if (board[origLetter - 'a'.charCodeAt(0)][8 - num] !== '1') return false;
      }
    }
    else if (destination[2] < origin[2]) {
      for (let i = -1; i > destination[2] - origin[2]; i--) {
        let num = parseInt(origin[2]) + i;
        let str = origin[1] + num;

        arrayOfAttack.push(str);
        if (board[origLetter - 'a'.charCodeAt(0)][8 - num] !== '1') return false;
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

export function highlightSquares(piece, enPassentSquare, boardArray) {
  const pieceType = piece[0];
  const position = piece[1] + piece[2];

  switch (pieceType) {
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
      return getKingMoves(position, 'b', boardArray);
    case 'K':
      return getKingMoves(position, 'w', boardArray);

    default:
      break;
  }
}

function getKingMoves(position, color, boardArray) {
  const possibleMoves = [];
  const destinations = [[-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]];
  const positionLetter = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);

  for (let i = 0; i < 8; i++) {
    const newLetter = positionLetter + destinations[i][0];
    const newNumber = positionNum + destinations[i][1];
    if (newNumber <= 8 && newNumber > 0 && newLetter >= 'a'.charCodeAt(0) && newLetter <= 'h'.charCodeAt(0)) {
      let square = $('#S' + String.fromCharCode(newLetter) + newNumber);
      let temp_board = copyArrayofArray(boardArray);
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
      let square = $('#S' + String.fromCharCode(newLetter) + newNumber);
      let temp_board = copyArrayofArray(boardArray);
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
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - parseInt(position[1])][positionLetter - 'a'.charCodeAt(0)] = 'P';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push(position[0] + (parseInt(position[1]) + 1));
    }
  }
  if (position[1] === '2' && !$('#S' + position[0] + (parseInt(position[1]) + 2))[0].firstChild) {
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) + 1)][positionLetter - 'a'.charCodeAt(0)] = 'P';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push(position[0] + (parseInt(position[1]) + 2));
    }
  }

  let upLeft =
    positionLetter - 1 >= 'a'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter - 1) + (parseInt(position[1]) + 1))
      : null;
  let upRight =
    positionLetter + 1 <= 'h'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter + 1) + (parseInt(position[1]) + 1))
      : null;

  if (upLeft && upLeft[0].firstChild !== null && getColor(upLeft[0].firstChild.id[0]) !== color) {
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - parseInt(position[1])][positionLetter - 1 - 'a'.charCodeAt(0)] = 'P';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push('C' + upLeft[0].id[1] + upLeft[0].id[2]);
    }
  }
  if (upRight && upRight[0].firstChild !== null && getColor(upRight[0].firstChild.id[0]) !== color) {
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - parseInt(position[1])][positionLetter + 1 - 'a'.charCodeAt(0)] = 'P';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push('C' + upRight[0].id[1] + upRight[0].id[2]);
    }
  }
  if (
    enPassentSquare &&
    position[1] === '5' &&
    enPassentSquare[1] === '5' &&
    Math.abs(enPassentSquare.charCodeAt(0) - positionLetter) === 1
  ) {
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    temp_board[7 - (parseInt(enPassentSquare[1]) - 1)][enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0)] = 'P';
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
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 2)][positionLetter - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, 'k'), temp_board)) {
      possibleMoves.push(position[0] + (parseInt(position[1]) - 1));
    }
  }
  if (position[1] === '7' && !$('#S' + position[0] + (parseInt(position[1]) - 2))[0].firstChild) {
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 3)][positionLetter - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, 'k'), temp_board)) {
      possibleMoves.push(position[0] + (parseInt(position[1]) - 2));
    }
  }

  let upLeft =
    positionLetter + 1 <= 'h'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter + 1) + (parseInt(position[1]) - 1))
      : null;
  let upRight =
    positionLetter - 1 >= 'a'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter - 1) + (parseInt(position[1]) - 1))
      : null;

  if (upLeft && upLeft[0].firstChild !== null && getColor(upLeft[0].firstChild.id[0]) !== color) {
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 2)][positionLetter + 1 - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push('C' + upLeft[0].id[1] + upLeft[0].id[2]);
    }
  }
  if (upRight && upRight[0].firstChild !== null && getColor(upRight[0].firstChild.id[0]) !== color) {
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(position[1]) - 2)][positionLetter - 1 - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board)) {
      possibleMoves.push('C' + upRight[0].id[1] + upRight[0].id[2]);
    }
  }

  if (
    enPassentSquare &&
    position[1] === '4' &&
    enPassentSquare[1] === '4' &&
    Math.abs(enPassentSquare.charCodeAt(0) - positionLetter) === 1
  ) {
    let temp_board = copyArrayofArray(boardArray);
    temp_board[7 - (parseInt(enPassentSquare[1]) - 1)][enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0)] = 'p';
    temp_board[7 - (parseInt(position[1]) - 1)][positionLetter - 'a'.charCodeAt(0)] = '1';
    if (!isCheck(findPositionOf(temp_board, 'k'), temp_board)) {
      possibleMoves.push('E' + enPassentSquare);
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
    let square = $('#S' + position[0] + (positionNum + i + 1));
    let temp_board = copyArrayofArray(boardArray);
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
    let square = $('#S' + position[0] + (positionNum - i - 1));
    let temp_board = copyArrayofArray(boardArray);
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
    let square = $('#S' + String.fromCharCode(positionCharCode - i - 1) + positionNum);

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
    let temp_board = copyArrayofArray(boardArray);
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
    let squares = [];
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
      let square = squares[j];
      let temp_board = copyArrayofArray(boardArray);
      temp_board[parseInt(square[1][1]) - 1][differenceFromLeft + i] = color === 'w' ? 'B' : 'b';
      temp_board[positionNum - 1][differenceFromLeft - 1] = '1';
      console.log(isCheck(findPositionOf(boardArray, color === 'w' ? 'K' : 'k'), boardArray));
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
    let squares = [];
    if (rbDiag && positionNum - i - 1 > 0) {
      squares.push([
        boardArray[7 - (positionNum - i - 2)][differenceFromLeft + i + 1],
        String.fromCharCode(positionCharCode + i + 1) + (positionNum - i - 1),
        'rbDiag'
      ]);
    }
    if (rtDiag && positionNum + i + 1 <= 8) {
      console.log(
        boardArray,
        7 - (positionNum + i),
        differenceFromRight + i + 1,
        String.fromCharCode(positionCharCode + i + 1) + (positionNum + i + 1)
      );
      squares.push([
        boardArray[7 - (positionNum + i)][differenceFromLeft + i + 1],
        String.fromCharCode(positionCharCode + i + 1) + (positionNum + i + 1),
        'rtDiag'
      ]);
    }

    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];
      let temp_board = copyArrayofArray(boardArray);
      temp_board[parseInt(square[1][1]) - 1][differenceFromLeft + i] = color === 'w' ? 'B' : 'b';
      temp_board[positionNum - 1][differenceFromLeft - 1] = '1';
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
    let squares = [];
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
      let square = squares[j];
      let temp_board = copyArrayofArray(boardArray);
      temp_board[parseInt(square[1][1]) - 1][differenceFromLeft + i] = color === 'w' ? 'Q' : 'q';
      temp_board[positionNum - 1][differenceFromLeft - 1] = '1';
      console.log(isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board));
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
    let squares = [];
    if (rbDiag && positionNum - i - 1 > 0)
      squares.push([
        boardArray[7 - (positionNum - i - 2)][differenceFromRight + i],
        String.fromCharCode(positionCharCode + i + 1) + (positionNum - i - 1),
        'rbDiag'
      ]);
    if (rMid)
      squares.push([
        boardArray[7 - (positionNum - 1)][differenceFromRight + i],
        String.fromCharCode(positionCharCode + i + 1) + positionNum,
        'rMid'
      ]);
    if (rtDiag && positionNum + i + 1 <= 8)
      squares.push([
        boardArray[7 - (positionNum + i)][differenceFromRight + i],
        String.fromCharCode(positionCharCode + i + 1) + (positionNum + i + 1),
        'rtDiag'
      ]);

    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];
      let temp_board = copyArrayofArray(boardArray);
      console.log(temp_board, boardArray);
      temp_board[parseInt(square[1][1]) - 1][differenceFromLeft + i] = color === 'w' ? 'Q' : 'q';
      temp_board[positionNum - 1][differenceFromLeft - 1] = '1';
      console.log(isCheck(findPositionOf(temp_board, color === 'w' ? 'K' : 'k'), temp_board));

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
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if (
      (Math.abs(destLetter - origLetter) === 2 && Math.abs(destination[2] - origin[2]) === 1) ||
      (Math.abs(destLetter - origLetter) === 1 && Math.abs(destination[2] - origin[2]) === 2)
    )
      return true;
  },
  b: function Bishop(destination, origin, board) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if (Math.abs(destLetter - origLetter) === Math.abs(destination[2] - origin[2])) {
      if (movePiecesDiag(destination, origin, board)) return true;
    }
  },
  r: function Rook(destination, origin, board) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if (destLetter === origLetter || destination[2] === origin[2]) {
      if (movePiecesVertLat(destination, origin, board)) return true;
    }
  },
  q: function Queen(destination, origin, board) {
    let destLetter = destination[1].charCodeAt(0);
    let origLetter = origin[1].charCodeAt(0);
    if (movePiecesVertLat(destination, origin, board)) {
      return true;
    }
    else if (
      Math.abs(destLetter - origLetter) === Math.abs(destination[2] - origin[2]) &&
      movePiecesDiag(destination, origin, board)
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
  p: function Pawn(destination, origin, board) {
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
