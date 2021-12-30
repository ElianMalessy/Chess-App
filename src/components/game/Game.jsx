import { useState, useEffect, useMemo, useRef, useCallback, createContext, memo } from 'react';
import classes from './Board.module.css';
import { BoardMemo } from './Board';
import $ from 'jquery';
import CapturedPanel from './CapturedPanel';
import Chat from './Chat';
import RightPanel from './RightPanel';
import { database } from '../../firebase';
import { ref, update, set, get, onValue, off, remove } from '@firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Row, Col } from 'react-bootstrap';
import { getColor, isCheck } from './moveFunctions';
import findPositionOf, { updateCastling } from './utilityFunctions';

export const PlayerContext = createContext();
export const TurnContext = createContext();
export const BoardContext = createContext();
export const EnPassentContext = createContext();
export const CheckmateContext = createContext();
export const CastlingContext = createContext();

export default memo(function Game(props) {
  // default FEN notation: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -
  // after e4: rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3
  // e3 is the en passent square, the numbers tell you how many consecutive squares are emtpy from left to right from the perspective of white
  // 8 represents an empty row and on the 4P3 represents 4 empty squares from left to right on the fourth rank
  // a4, b4, c4, d4. Then a white pawn at e4, then 3 empty squares to the right of the pawn, f4, g4, h4.
  // CAPITAL LETTERS REPRESENT WHITE, lowercase is black. the 'w' or 'b' represent whose turn it is and the KQkq is castling rights
  $(function() {
    $('#board').on('contextmenu', function() {
      return false;
    });
  });

  const [checkmate, setCheckmate] = useState(false);
  const [boardArray, setBoardArray] = useState([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // black
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['1', '1', '1', '1', '1', '1', '1', '1'], // add these up to get the FEN, from left to right
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // white
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ]);

  const [playerColor, setplayerColor] = useState(null);
  const [turn, setTurn] = useState('white');

  const path = props.location.pathname;
  const gameID = useRef(path.substring(path.lastIndexOf('/') + 1));

  const { currentUser } = useAuth();
  const currentUserID = useRef();
  if (currentUser) currentUserID.current = currentUser.uid;
  else currentUserID.current = 'temporaryID';

  useEffect(
    () => {
      if (checkmate)
        update(ref(database, 'Games/' + gameID.current), {
          checkmate: checkmate
        });
    },
    [checkmate]
  );

  const fixBoardArray = useCallback((FEN) => {
    // takes FEN as an argument, and fixes the board which we use as a middleman between a move, 'pe2, pe4' to putting that in FEN
    // 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3'
    let FEN_index = 0;
    const tempboard = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++, FEN_index++) {
        if (FEN[FEN_index] === '/') FEN_index++;
        let num = parseInt(FEN[FEN_index]);
        if (num) {
          if (num === 1) {
            row.push('1');
          }
          else {
            while (num > 0) {
              row.push('1');
              num--;
              j++;
            }
            j--;
          }
        }
        else {
          row.push(FEN[FEN_index]);
        }
      }
      tempboard.push(row);
    }
    setBoardArray(tempboard);
  }, []);

  const fixTurnFromFEN = useCallback((FEN) => {
    // switching from b in FEN to w immediately after a white move, in both local storage and in firebase
    for (let i = FEN.length - 1; i >= 0; i--) {
      if (FEN[i] === 'w') {
        setTurn('white');
        break;
      }
      else if (FEN[i] === 'b') {
        setTurn('black');
        break;
      }
    }
  }, []);

  const [FEN, setFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -');
  const getFEN = useCallback(
    async (gameID) => {
      const dbRef = ref(database, 'Games/' + gameID);
      await get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const temp_FEN = snapshot.val().FEN;
            setFEN(temp_FEN);
            fixTurnFromFEN(temp_FEN);
            fixBoardArray(temp_FEN);
          }
          else {
            console.log('No data available');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [fixBoardArray, fixTurnFromFEN]
  );
  const fixStuffOnLoad = useCallback(
    () => {
      getFEN(gameID.current);
    },
    [getFEN]
  );

  // userHandler gets triggered on every load of the page
  useEffect(
    () => {
      userHandler(gameID.current, currentUserID.current, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -');
      async function userHandler(gameID, playerID, FEN) {
        const dbRef = ref(database, 'Games/' + gameID);
        console.log('newUserHandler');
        await get(dbRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              let p1 = snapshot.val().player1;
              let p2 = snapshot.val().player2;
              if (p2 === undefined && playerID !== p1) {
                // new user, color = black
                setplayerColor('black');

                update(dbRef, {
                  player2: playerID
                }).then(() => fixStuffOnLoad());
              }
              else {
                // old users
                if (playerID === p1) {
                  setplayerColor('white');
                }
                else if (playerID === p2) {
                  setplayerColor('black');
                }
                fixStuffOnLoad();
              }
            }
            else {
              // new user, color = white
              setplayerColor('white');
              localStorage.setItem(currentUserID.current, 'white');
              localStorage.setItem('FEN', FEN);
              set(dbRef, {
                player1: playerID,
                FEN: FEN
              });
              fixStuffOnLoad();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    [fixStuffOnLoad]
  );

  const [castling, setCastling] = useState('KQkq'); // 'K' is white kingside castling 'q' is black queenside castling
  const [enPassentSquare, setEnpassentSquare] = useState(null);
  const setLastMoveFromOtherUser = useRef(true);
  const setFENFromOtherUser = useRef(true);

  useEffect(
    () => {
      // if turn is 'white' or 'black' then this is the wrong user/socket as it has no newLocation
      if (turn.length === 5) return;

      const oldToNewLocations = [turn[1], turn[2]];
      setLastMoveFromOtherUser.current = false;
      setFENFromOtherUser.current = false;

      const column = oldToNewLocations[0].charCodeAt(1) - 97; // gets e from pe2 and converts that to 4th column (3 in array)
      const row = parseInt(oldToNewLocations[0][2]) - 1; // gets 2 from pe2 and converts that to the 2nd column (1 in array)

      const piece = boardArray[7 - row][column];
      const tempBoard = boardArray;
      tempBoard[7 - row][column] = '1'; // prev square is now empty
      const newColumn = oldToNewLocations[1].charCodeAt(1) - 97;
      const newRow = parseInt(oldToNewLocations[1][2]) - 1;
      tempBoard[7 - newRow][newColumn] = piece;

      if (Array.isArray(turn[3])) {
        tempBoard[7 - (parseInt(turn[3][0][1]) - 1)][turn[3][0].charCodeAt(0) - 'a'.charCodeAt(0)] = '1';
        tempBoard[7 - (parseInt(turn[3][1][1]) - 1)][turn[3][1].charCodeAt(0) - 'a'.charCodeAt(0)] = turn[3][2];
      }
      else if (turn[3]) {
        tempBoard[7 - (parseInt(turn[3][1]) - 1)][turn[3].charCodeAt(0) - 'a'.charCodeAt(0)] = '1';
      }

      // counts pieces from left to right, counting up 1's inbetween pieces to get new FEN
      let temp_FEN = '';
      for (let i = 0; i < 8; i++) {
        let spaces = 0;
        for (let j = 0; j < 8; j++) {
          if (tempBoard[i][j] === '1') spaces++;
          else {
            if (spaces > 0) {
              temp_FEN += spaces;
              spaces = 0;
            }
            temp_FEN += tempBoard[i][j];
          }
        }
        if (spaces > 0) {
          temp_FEN += spaces;
          spaces = 0;
        }
        if (i !== 7) temp_FEN += '/';
      }

      temp_FEN += ' ' + turn[0][0];
      if (castling !== '') {
        let temp_castling = castling;
        switch (turn[1]) {
          case 'Ke1':
            temp_castling = updateCastling(castling, 'KQ');
            break;
          case 'ke8':
            temp_castling = updateCastling(castling, 'kq');
            break;
          case 'Ra1':
            temp_castling = updateCastling(castling, 'Q');
            break;
          case 'Rh1':
            temp_castling = updateCastling(castling, 'k');
            break;
          case 'ra8':
            temp_castling = updateCastling(castling, 'q');
            break;
          case 'rh8':
            temp_castling = updateCastling(castling, 'k');
            break;

          default:
            break;
        }
        console.log(temp_castling);
        temp_FEN += ' ' + temp_castling;
        setCastling(temp_castling);
      }

      if (
        piece[0].toLowerCase() === 'p' &&
        Math.abs(parseInt(oldToNewLocations[0][2]) - parseInt(oldToNewLocations[1][2])) === 2
      ) {
        // pe2 to pe4 gets an enPassentSquare of e3
        let temp_enPassentSquare = oldToNewLocations[0][1];
        turn[0] === 'black'
          ? (temp_enPassentSquare += parseInt(oldToNewLocations[0][2]) + 1)
          : (temp_enPassentSquare += parseInt(oldToNewLocations[1][2]) + 1);

        temp_FEN += ' ' + temp_enPassentSquare;
      }
      else {
        temp_FEN += ' -';
      }
      const whiteKingPos = findPositionOf(tempBoard, 'K');
      const blackKingPos = findPositionOf(tempBoard, 'k');
      const check1 = playerColor === 'white' ? isCheck(blackKingPos, tempBoard) : isCheck(whiteKingPos, tempBoard);
      setBoardArray(tempBoard);
      setFEN(temp_FEN);
      localStorage.setItem('FEN', temp_FEN);
      if (turn[3]) {
        update(ref(database, 'Games/' + gameID.current), {
          FEN: temp_FEN,
          lastMove: Array.isArray(turn[3])
            ? ['O' + oldToNewLocations[0], oldToNewLocations[1]]
            : ['E' + oldToNewLocations[0], oldToNewLocations[1]]
        });
      }
      else {
        update(ref(database, 'Games/' + gameID.current), {
          FEN: temp_FEN,
          lastMove: oldToNewLocations
        });
      }
      if (check1) {
        update(ref(database, 'Games/' + gameID.current), {
          check: check1
        });
      }
      else {
        update(ref(database, 'Games/' + gameID.current), {
          check: null
        });
      }

      playerColor === 'white' ? setTurn('black') : setTurn('white');
    },
    //eslint-disable-next-line
    [turn]
  );

  // these onValue events are for sockets listening that did not trigger the event.
  // e.g, white makes a move, so black's event listener is triggered and events follow from there.
  // event listeners are triggered for both as of now, but only black's code is triggered
  useEffect(() => {
    const dbRef = ref(database, 'Games/' + gameID.current + '/FEN');
    onValue(dbRef, (snapshot) => {
      // if snapshot.val() === FEN that means that the user who updated the FEN in the first place is running this
      if (snapshot.exists() && setFENFromOtherUser.current === true && snapshot.val() !== FEN) {
        const temp_FEN = snapshot.val();
        fixBoardArray(temp_FEN);
        setFEN(temp_FEN);
        if (temp_FEN[temp_FEN.length - 1] !== '-') {
          setEnpassentSquare(temp_FEN[temp_FEN.length - 2] + temp_FEN[temp_FEN.length - 1]);
        }
        else setEnpassentSquare(null);
        off(dbRef);
      }
      else if (snapshot.exists() && setFENFromOtherUser.current === false) {
        setFENFromOtherUser.current = true;
        off(dbRef);
      }
    });
  });

  useEffect(() => {
    const dbRef = ref(database, 'Games/' + gameID.current + '/checkmate');
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists() && !checkmate) {
        setCheckmate(snapshot.val());
        remove(ref(database, 'Games/' + gameID.current));
      }
    });
  });

  const [check, setCheck] = useState(null);
  useEffect(() => {
    const dbRef = ref(database, 'Games/' + gameID.current + '/check');
    onValue(dbRef, (snapshot) => {
      if (!snapshot.exists()) return;
      let checkingPiece = snapshot.val()[0][0];
      if (
        ((checkingPiece === checkingPiece.toLowerCase() && playerColor === 'white') ||
          (checkingPiece === checkingPiece.toUpperCase() && playerColor === 'black')) &&
        (check === null || JSON.stringify(snapshot.val()) !== JSON.stringify(check))
      ) {
        setCheck(snapshot.val());
        off(dbRef);
      }
    });
  });

  useEffect(() => {
    const dbRef = ref(database, 'Games/' + gameID.current + '/lastMove');
    onValue(dbRef, (snapshot) => {
      if (
        !snapshot.exists() ||
        !playerColor ||
        getColor(snapshot.val()[1][0]) === playerColor[0] ||
        FEN === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -'
      ) {
        off(dbRef);
        return;
      }
      else if (setLastMoveFromOtherUser.current === false) {
        setLastMoveFromOtherUser.current = true;
      }
      else {
        let oldToNewLocation = snapshot.val();

        if (oldToNewLocation[0][0] === 'E') {
          const captureSquare = oldToNewLocation[1][1] + oldToNewLocation[0][3];
          const capturedPiece = $('#S' + captureSquare)[0].firstChild;
          if (capturedPiece) $('#' + capturedPiece.id).remove();
          oldToNewLocation[0] = oldToNewLocation[0][1] + oldToNewLocation[0][2] + oldToNewLocation[0][3];
        }
        else if (oldToNewLocation[0][0] === 'O') {
          switch (oldToNewLocation[1]) {
            case 'Kg1':
              $('#Rh1').appendTo('#Sf1');
              $('#Rh1').attr('id', 'Rf1');

              break;
            case 'Kc1':
              $('#Ra1').appendTo('#Sd1');
              $('#Ra1').attr('id', 'Rd1');
              break;
            case 'kc8':
              $('#ra8').appendTo('#Sd8');
              $('#ra8').attr('id', 'rd8');

              break;
            case 'kg8':
              $('#rh8').appendTo('#Sf8');
              $('#rh8').attr('id', 'rf8');
              break;

            default:
              break;
          }
          oldToNewLocation[0] = oldToNewLocation[0][1] + oldToNewLocation[0][2] + oldToNewLocation[0][3];
        }
        const oldLocation = $('#' + oldToNewLocation[0]);

        if (oldLocation.length === 0) {
          off(dbRef);
          return;
        }
        const capturedPiece = $('#S' + oldToNewLocation[1][1] + oldToNewLocation[1][2])[0].firstChild;
        if (capturedPiece) $('#' + capturedPiece.id).remove();

        oldLocation.appendTo($('#S' + oldToNewLocation[1][1] + oldToNewLocation[1][2]));
        oldLocation.attr('id', oldToNewLocation[1]);

        playerColor === 'white' ? setTurn('white') : setTurn('black');
      }
      off(dbRef);
    });
  });

  const turnValue = useMemo(
    () => {
      return { turn, setTurn };
    },
    [turn]
  );

  return (
    <div className={classes['mainPage']} id='page'>
      <Container>
        <Row>
          <CheckmateContext.Provider value={{ checkmate, setCheckmate }}>
            <PlayerContext.Provider value={playerColor}>
              <Col>
                <Chat gameID={gameID.current} />
              </Col>

              <Col>
                <CapturedPanel>
                  <BoardContext.Provider value={boardArray}>
                    <TurnContext.Provider value={turnValue}>
                      <EnPassentContext.Provider value={enPassentSquare}>
                        <CastlingContext.Provider value={castling}>
                          <BoardMemo FEN={FEN} check={check} />
                        </CastlingContext.Provider>
                      </EnPassentContext.Provider>
                    </TurnContext.Provider>
                  </BoardContext.Provider>
                </CapturedPanel>
              </Col>
            </PlayerContext.Provider>
          </CheckmateContext.Provider>

          <Col>
            <RightPanel turn={turn} FEN={FEN} />
          </Col>
        </Row>
      </Container>
    </div>
  );
});
