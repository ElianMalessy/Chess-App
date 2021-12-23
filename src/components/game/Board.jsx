import { useContext, useEffect, useState, useRef, memo } from 'react';
import classes from './Board.module.css';
import PieceMemo from './Piece';
import { PlayerContext, TurnContext, BoardContext } from './Game';
import findPossibleMoves from './moveFunctions';
import findPositionOf, { findAllPieces } from './findBoardIndex';

function Board({ FEN, check }) {
  const boardArray = useContext(BoardContext);
  const playerColor = useContext(PlayerContext);
  const { turn } = useContext(TurnContext);

  const [board, setBoard] = useState([]);
  const boardFiller = useRef([]);
  const firstRender = useRef(true);

  useEffect(
    () => {
      console.log(FEN, firstRender.current, playerColor)
      if (firstRender.current && FEN && playerColor) firstRender.current = false;
      else if (!firstRender.current && FEN && playerColor) return;

      console.log('board-render', FEN);
      const emptyBoard = [];
      boardFiller.current = emptyBoard;
      let index = FEN.length;
      while (true) {
        if (FEN[index] === 'w' || FEN[index] === 'b') {
          index -= 2;
          break;
        }
        index--;
      }

      // goes backwards in FEN.
      if (playerColor === 'black') {
        for (let i = index, row = 1, column = 0; i >= 0; i--, column++) {
          if (FEN[i] === ' ') break;
          if (FEN[i] === '/') {
            row++;
            column = -1;
            continue;
          }

          // board squares starting from top left to right bottom. a8, b8 to g1, h1
          const num = parseInt(FEN[i]);
          if (num) {
            for (let j = parseInt(FEN[i]); j > 0; j--, column++) {
              const key = String.fromCharCode(104 - column) + '' + row;
              const tile_class = (column + row) % 2 === 1 ? 'non-colored-tile' : 'colored-tile';
              boardFiller.current.push(<div key={key} className={classes[tile_class]} id={'S' + key} />);
            }
            if (num < 8) {
              column--;
            }
          }
          else {
            // add fmove from fen, also en passent square
            const color = FEN[i] === FEN[i].toUpperCase() ? 'white' : 'black';
            const key = String.fromCharCode(104 - column) + '' + row;
            const tile_class = (column + row) % 2 === 1 ? 'non-colored-tile' : 'colored-tile';

            let pos = FEN[i] + key;
            boardFiller.current.push(
              <div key={key} className={classes[tile_class]} id={'S' + key}>
                <PieceMemo color={color} position={pos} />
              </div>
            );
          }
        }
      }
      else {
        for (let i = 0, row = 8, column = 0; i < FEN.length; i++, column++) {
          if (FEN[i] === ' ') break;
          if (FEN[i] === '/') {
            row--;
            column = -1;
            continue;
          }

          const num = parseInt(FEN[i]);
          if (num) {
            for (let j = num; j > 0; j--, column++) {
              const key = String.fromCharCode(97 + column) + '' + row;
              const tile_class = (column + row) % 2 === 0 ? 'non-colored-tile' : 'colored-tile';
              boardFiller.current.push(<div key={key} className={classes[tile_class]} id={'S' + key} />);
            }
            if (num < 8) {
              column--;
            }
          }
          else {
            const color = FEN[i] === FEN[i].toUpperCase() ? 'white' : 'black';
            const key = String.fromCharCode(97 + column) + '' + row;
            const tile_class = (column + row) % 2 === 0 ? 'non-colored-tile' : 'colored-tile';
            // use key instead of ID to move around pieces as that is immutable from the client side
            let pos = FEN[i] + key;
            boardFiller.current.push(
              <div key={key} className={classes[tile_class]} id={'S' + key}>
                <PieceMemo color={color} position={pos} />
              </div>
            );
          }
        }
      }
      setBoard(boardFiller.current);
    },
    [playerColor, FEN]
  );

  useEffect(
    () => {
      if (check) {
        console.log(check);
        let kingPos;

        if (turn[0] === 'w') {
          kingPos = findPositionOf(boardArray, 'K');
        }
        else if (turn[0] === 'b') {
          kingPos = findPositionOf(boardArray, 'k');
        }
        findPossibleMoves(check, kingPos, findAllPieces(boardArray, turn[0]), boardArray, turn[0]);
        // only use for determining checkmate and possible moves if there is a check
      }
    },
    //eslint-disable-next-line
    [check]
  );

  return (
    <div className={classes.chessboard} id='board'>
      {board}
    </div>
  );
}
export const BoardMemo = memo(Board);
