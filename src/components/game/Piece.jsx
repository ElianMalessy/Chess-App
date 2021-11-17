import { useContext, memo, useRef } from 'react';
import classes from './Board.module.css';
import classNames from 'classnames';
import { TurnContext, PlayerContext, EnPassentContext } from './Game';
import { CapturedPieces } from './CapturedPanel';
import $ from 'jquery';
import { isCheck, highlightSquares } from './moveFunctions';

export default memo(function PieceMemo({ color, position }) {
  const { turn, setTurn } = useContext(TurnContext);
  const { setPiece } = useContext(CapturedPieces);
  const { enPassentSquare } = useContext(EnPassentContext);
  const playerColor = useContext(PlayerContext);

  const possibleSquares = useRef([]);
  const captureHintClass = classes.captureHint;
  const hintClass = classes.hint;

  function drag(mouse) {
    possibleSquares.current = highlightSquares(mouse.target.id, enPassentSquare);
    possibleSquares.current.forEach((square, index) => {
      if (square[0] === 'C') {
        // en passent square
        let overlay = $(`<div id=${index}></div>`);
        $('#S' + square[1] + square[2]).append(overlay);
        overlay.addClass(captureHintClass);
      }
      else {
        if (square[0] === 'E') square = square[2] + square[3];

        let overlay = $(`<div id=${index}></div>`);
        $('#S' + square).append(overlay);
        overlay.addClass(hintClass);
      }
    });

    const move = $(mouse.target);
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
  // check if the move being made will cause a check to ones own king, if so move is illegal
  // change id of moving piece to "NaN" and pretend as if its in its moved position on the destination square
  // do this while checking for attacks on ones on king (during ones own turn) but not while checking for attacks on the opponents king
  // at that time you shouldve already switched the id from NaN to the destination position and put it in the destination square on the DOM
  function endDrag(mouse) {
    const moving_piece = $(mouse.target);
    const original_id = mouse.target.id;
    moving_piece.css('z-index', -100);
    possibleSquares.current.forEach((squareID, index) => {
      $('#' + index).remove();
    });

    const destinationSquare = document.elementFromPoint(mouse.pageX, mouse.pageY).id;
    const destinationPosition = destinationSquare[1] + destinationSquare[2];
    let moved = true;
    const endLocation = [];

    // if same square as original, then end
    if (destinationSquare && !(destinationSquare[1] === original_id[1] && destinationSquare[2] === original_id[2])) {
      let whiteKingPos = $('[id^=K][class*=white]')[0];
      let blackKingPos = $('[id^=k][class*=black]')[0];

      const finalPosition = original_id[0] + destinationPosition;
      $('#' + original_id).attr('id', finalPosition); // id change to see that if in new position there are any checks

      const check = turn === 'white' ? isCheck(whiteKingPos.id) : isCheck(blackKingPos.id);

      if (
        possibleSquares.current.includes(destinationPosition) ||
        possibleSquares.current.includes('C' + destinationPosition) ||
        possibleSquares.current.includes('E' + destinationPosition)
      ) {
        if (possibleSquares.current.includes('C' + destinationPosition)) {
          let capturedPiece = $('#' + destinationSquare)[0].firstChild;
          setPiece($('#' + capturedPiece.id)[0]);
          $('#' + capturedPiece.id).css('opacity', 0);
          $('#' + capturedPiece.id).remove();
        }
        else if (possibleSquares.current.includes('E' + destinationPosition)) {
          let capturedPiece = $('#S' + enPassentSquare)[0].firstChild; // dont know if this works
          setPiece($('#' + capturedPiece.id)[0]);
          $('#' + capturedPiece.id).css('opacity', 0);
          $('#' + capturedPiece.id).remove();
        }

        moved = true;
        $('#' + finalPosition).appendTo('#S' + destinationPosition);
        endLocation.push(original_id, finalPosition);

        const check1 = turn === 'white' ? isCheck(blackKingPos.id) : isCheck(whiteKingPos.id);
        if (check1) {
          console.log(check1);
          endLocation.push(check1);
        }
      }
      else {
        if (check) {
          // if the move causes a discovered check to ones own king, then it is not a legal move
          // this works out for a king move as well bc moving into another kings space will count as a check towards the moved king
          console.log('isCheck', check);
        }
        console.log(finalPosition, original_id);
        $('#' + finalPosition).attr('id', original_id);
        moved = false;
      }
    }

    possibleSquares.current = [];
    $(document).off('mousemove');
    moving_piece.css('z-index', 10);
    moving_piece.css('transform', 'translate(' + 0 + 'px, ' + 0 + 'px)');
    moving_piece.data('lastTransform', { dx: 0, dy: 0 });
    if (moved) {
      // when this player has made a move, broadcast that to the other player
      if (endLocation[0] === undefined || endLocation[1] === undefined) return;
      turn === 'white' ? setTurn(['black', ...endLocation]) : setTurn(['white', ...endLocation]);
    }
  }

  let pieceClass = color + '-' + position[0].toLowerCase();
  const Classes = classNames(classes[color], classes[pieceClass]);
  if (playerColor) {
    if (position[0].toLowerCase() === 'p') {
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
          style={{ pointerEvents: turn === color && playerColor === color ? 'inherit' : 'none' }}
          color={color}
        />
      );
    }
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
