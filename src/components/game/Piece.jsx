import { useContext, memo, useRef } from 'react';
import classes from './Board.module.css';
import classNames from 'classnames';
import { TurnContext, PlayerContext, EnPassentContext, BoardContext, CastlingContext } from './Game';
import { CapturedPieces } from './CapturedPanel';
import $ from 'jquery';
import { highlightSquares } from './moveFunctions';

export default memo(function PieceMemo({ color, position }) {
  const { turn, setTurn } = useContext(TurnContext);
  const { setPiece } = useContext(CapturedPieces);
  const enPassentSquare = useContext(EnPassentContext);
  const castling = useContext(CastlingContext);
  const playerColor = useContext(PlayerContext);
  const boardArray = useContext(BoardContext);
  const possibleSquares = useRef([]);
  const captureHintClass = classes.captureHint;
  const hintClass = classes.hint;

  function drag(mouse) {
    const move = $(mouse.target);
    possibleSquares.current = highlightSquares(mouse.target.id, enPassentSquare, boardArray, castling);
    if (!possibleSquares.current) {
      return;
    }
    possibleSquares.current.forEach((square, index) => {
      let position = square;
      if (square[0] === 'C' || square[0] === 'E' || square[0] === 'O') {
        position = square[1] + square[2];
      }
      const overlay = $(`<div id=${index}></div>`);
      $('#S' + position).append(overlay);
      if (square[0] === 'C' || square[0] === 'E') overlay.addClass(captureHintClass);
      else overlay.addClass(hintClass);
    });

    const rect = document.elementFromPoint(mouse.pageX, mouse.pageY).getBoundingClientRect();
    move.css('z-index', 10);

    let lastOffset = move.data('lastTransform');
    let lastOffsetX = lastOffset ? lastOffset.dx : 0,
      lastOffsetY = lastOffset ? lastOffset.dy : 0;

    let startX = mouse.pageX - lastOffsetX,
      startY = mouse.pageY - lastOffsetY;

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

  function endDrag(mouse) {
    const moving_piece = $(mouse.target);
    const original_id = mouse.target.id;
    moving_piece.css('z-index', -100);
    if (possibleSquares.current) {
      possibleSquares.current.forEach((squareID, index) => {
        $('#' + index).remove();
      });
    }

    const destinationSquare = document.elementFromPoint(mouse.pageX, mouse.pageY).id;
    const destinationPosition = destinationSquare[1] + destinationSquare[2];
    let moved = true;
    const endLocation = [];

    // if same square as original, then end
    if (
      destinationSquare &&
      !(destinationSquare[1] === original_id[1] && destinationSquare[2] === original_id[2]) &&
      possibleSquares.current
    ) {
      const final_id = original_id[0] + destinationPosition;
      $('#' + original_id).attr('id', final_id);

      if (
        possibleSquares.current.includes(destinationPosition) ||
        possibleSquares.current.includes('C' + destinationPosition) ||
        possibleSquares.current.includes('E' + destinationPosition) ||
        possibleSquares.current.includes('O' + destinationPosition)
      ) {
        let capturedPiece;
        let captureSquare;
        let castleSquare;
        if (possibleSquares.current.includes('C' + destinationPosition)) {
          capturedPiece = $('#' + destinationSquare)[0].firstChild;
        }
        else if (possibleSquares.current.includes('E' + destinationPosition)) {
          captureSquare =
            playerColor === 'white'
              ? enPassentSquare[0] + (parseInt(enPassentSquare[1]) - 1)
              : enPassentSquare[0] + (parseInt(enPassentSquare[1]) + 1);
          capturedPiece =
            playerColor === 'white' ? $('#S' + captureSquare)[0].firstChild : $('#S' + captureSquare)[0].firstChild;
        }
        else if (possibleSquares.current.includes('O' + destinationPosition)) {
          switch (destinationPosition) {
            case 'g1':
              $('#Rh1').appendTo('#Sf1');
              $('#Rh1').attr('id', 'Rf1');

              castleSquare = ['h1', 'f1', 'R'];
              break;
            case 'c1':
              $('#Ra1').appendTo('#Sd1');
              $('#Ra1').attr('id', 'Rd1');

              castleSquare = ['a1', 'd1', 'R'];
              break;
            case 'c8':
              $('#ra8').appendTo('#Sd8');
              $('#ra8').attr('id', 'rd8');

              castleSquare = ['a8', 'd8', 'r'];
              break;
            case 'g8':
              $('#rh8').appendTo('#Sf8');
              $('#rh8').attr('id', 'rf8');

              castleSquare = ['h8', 'f8', 'r'];
              break;

            default:
              break;
          }
        }

        if (capturedPiece) {
          setPiece($('#' + capturedPiece.id).attr('class'));
          $('#' + capturedPiece.id).remove();
        }

        moved = true;
        $('#' + final_id).appendTo('#S' + destinationPosition);
        endLocation.push(original_id, final_id);
        if (captureSquare) endLocation.push(captureSquare);
        else if (castleSquare) endLocation.push(castleSquare);
      }
    }

    possibleSquares.current = [];
    $(document).off('mousemove');
    moving_piece.css('z-index', '');
    moving_piece.css('transform', 'translate(' + 0 + 'px, ' + 0 + 'px)');
    moving_piece.data('lastTransform', { dx: 0, dy: 0 });
    if (moved) {
      // when this player has made a move, broadcast that to the other player
      if (!endLocation[0] || !endLocation[1]) return;
      turn === 'white' ? setTurn(['black', ...endLocation]) : setTurn(['white', ...endLocation]);
    }
  }

  const pieceClass = color + '-' + position[0].toLowerCase();
  const Classes = classNames(classes[color], classes[pieceClass]);
  if (playerColor) {
    return (
      <div
        className={Classes}
        onMouseDown={drag}
        onMouseUp={endDrag}
        id={position}
        style={{ pointerEvents: turn === color && playerColor === color ? 'inherit' : 'none' }}
        color={color}
      />
    );
  }
  else {
    return (
      <div
        className={Classes}
        onMouseDown={drag}
        onMouseUp={endDrag}
        id={position}
        style={{ pointerEvents: 'none' }}
        color={color}
      />
    );
  }
});
