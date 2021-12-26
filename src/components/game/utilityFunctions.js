export default function findPositionOf(arrayofArray, target) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (arrayofArray[i][j] === target) {
        return target + String.fromCharCode('a'.charCodeAt(0) + j) + (8 - i);
        // e.g, i = 0 and j = 0 means a8 i = 3 and j = 2 means c5
      }
    }
  }
  return false;
}

export function findAllPieces(arrayofArray, color) {
  const allPieces = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let piece = arrayofArray[i][j].toLowerCase();
      if (piece === 'k' || piece === '1') continue;

      if (piece === arrayofArray[i][j] && color === 'w')
        allPieces.push(arrayofArray[i][j] + String.fromCharCode('a'.charCodeAt(0) + j) + (8 - i));
      else if (arrayofArray[i][j].toUpperCase() === arrayofArray[i][j] && color === 'b')
        allPieces.push(arrayofArray[i][j] + String.fromCharCode('a'.charCodeAt(0) + j) + (8 - i));
    }
  }
  return allPieces;
}

export function copyArrayofArray(arrayofArray) {
  const newArray = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      newArray[i][j] = arrayofArray[i][j];
    }
  }
  return newArray;
}

export function updateCastling(castling, removals) {
  let newCastling = '';
  console.log(castling, removals);
  if (removals.length === 2) {
    for (let i = 0; i < castling.length; i++) {
      if (castling[i] !== removals[0] && castling[i] !== removals[1]) newCastling += castling[i];
    }
  }
  else {
    for (let i = 0; i < castling.length; i++) {
      if (castling[i] !== removals) newCastling += castling[i];
    }
  }
  console.log(newCastling);
  return newCastling;
}
