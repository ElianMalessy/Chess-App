import { useContext, memo } from 'react';
import classes from './Board.module.css';
import classNames from 'classnames';
import { TurnContext, PlayerContext } from './Game';
import { CapturedPieces } from './CapturedPanel';
import $ from 'jquery';

export default memo(function PieceMemo({ color, position }) {
  const { turn, setTurn } = useContext(TurnContext);
  const { setPiece } = useContext(CapturedPieces);
  const { playerColor } = useContext(PlayerContext);
  //const { FEN } = useContext(FenContext);

  function drag(me) {
    const move = $(me.target);
    const rect = document.elementFromPoint(me.pageX, me.pageY).getBoundingClientRect();
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
  // check if the move being made will cause a check to ones own king, if so move is illegal
  // change id of moving piece to "NaN" and pretend as if its in its moved position on the destination square
  // do this while checking for attacks on ones on king (during ones own turn) but not while checking for attacks on the opponents king
  // at that time you shouldve already switched the id from NaN to the destination position and put it in the destination square on the DOM
  function endDrag(me) {
    let moving_piece = $(me.target);
    const target_id = me.target.id;
    moving_piece.css('z-index', -100);
    let destination = document.elementFromPoint(me.pageX, me.pageY).id;
    console.log(target_id, destination);
    if (destination && !(destination[1] === target_id[1] && destination[2] === target_id[2])) {
      let func = moveFunctions[target_id[0]](destination, target_id);
      if (func) {
        let kingPos = $('[id^=k][class*=wh]')[0];
        let kingPos2 = $('[id^=k][class*=bl]')[0];
        $('#' + target_id).attr('id', 'NaN');

        var endLocation = [];
        let capturedPiece = $('#' + destination)[0].firstChild;
        if (capturedPiece) {
          if ($('#' + capturedPiece.id).attr('color') !== me.target.getAttribute('color') && func !== 'p') {
            var moved = true;
            const check = turn === 'white' ? isCheck(kingPos.id) : isCheck(kingPos2.id);
            if (check) {
              $('#NaN').attr('id', target_id);
              moved = false;
            }
            else {
              setPiece($('#' + capturedPiece.id)[0]);
              $('#' + capturedPiece.id).css('opacity', 0);
              $('#' + capturedPiece.id).remove();

              let destination2 = document.elementFromPoint(me.pageX, me.pageY);
              $('#NaN').appendTo('#' + destination2.id);
              $('#NaN').attr('id', target_id[0] + destination[1] + destination[2]);
              endLocation.push(target_id, target_id[0] + destination[1] + destination[2]);
              //const check1 = turn === 'white' ? isCheck(kingPos2.id) : isCheck(kingPos.id);
            }
          }
        }
        else {
          const check = turn === 'white' ? isCheck(kingPos.id) : isCheck(kingPos2.id);
          //console.log(check, turn === 'white' ? kingPos.id : kingPos2.id);
          if (check) {
            $('#NaN').attr('id', target_id);
            moved = false;
          }
          else {
            moved = true;
            $('#NaN').appendTo('#' + destination);
            $('#NaN').attr('id', target_id[0] + destination[1] + destination[2]);
            endLocation.push(target_id, target_id[0] + destination[1] + destination[2]);
            //const check1 = turn === 'white' ? isCheck(kingPos2.id) : isCheck(kingPos.id);
            //console.log(check1, turn === 'white' ? kingPos2.id : kingPos.id);
          }
        }
      }
    }
    $(document).off('mousemove');
    moving_piece.css('z-index', 10);
    moving_piece.css('transform', 'translate(' + 0 + 'px, ' + 0 + 'px)');
    moving_piece.data('lastTransform', { dx: 0, dy: 0 });
    if (moved) {
      // when this player has made a move, broadcast that to the other player
      turn === 'white' ? setTurn(['black', ...endLocation]) : setTurn(['white', ...endLocation]);
      //socket.emit('turn-location', endLocation, gameID.current, turn === 'white' ? 'black' : 'white');
    }
  }
  function isCheck(kingPos) {
    let pieces =
      $('#' + kingPos).attr('color')[0] === 'b'
        ? $('span[class*=wh][id!=capturedPiece][id!=NaN]')
        : $('span[class*=bl][id!=capturedPiece][id!=NaN]');
    // checks if the move is legal by putting in the destination and looking for checks before actually appending to new square
    const potential_check_pieces = [...pieces];
    const checking_pieces = [];
    potential_check_pieces.forEach((item) => {
      //console.log(item.id, kingPos);
      if (moveFunctions[item.id[0]]('S' + kingPos[1] + kingPos[2], item.id) === true) checking_pieces.push(item.id);
    });
    return checking_pieces.length > 0 ? checking_pieces : false;
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

  let the_piece = color + '-' + position[0];
  const Classes = classNames(classes[color], classes[the_piece]);
  if (playerColor) {
    if (position[0] === 'p') {
      return (
        <span
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
        <span
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
      <span
        className={Classes}
        onMouseDown={drag}
        onMouseUp={endDrag}
        id={position}
        style={{ pointerEvents: turn === color ? 'inherit' : 'none' }}
        color={color}
      />
    );
  }
});
