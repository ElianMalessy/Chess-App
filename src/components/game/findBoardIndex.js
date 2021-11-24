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
  console.log(allPieces);
  return allPieces;
}
