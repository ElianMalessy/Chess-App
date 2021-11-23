import { useState, useEffect, useMemo, useRef, useCallback, createContext, memo } from 'react';
import classes from './Board.module.css';
import { BoardMemo } from './Board';
import $ from 'jquery';
import CapturedPanel from './CapturedPanel';
import Chat from './Chat';
import RightPanel from './RightPanel';
import { database } from '../../firebase';
import { ref, update, set, get, onValue, off } from '@firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Row, Col } from 'react-bootstrap';

export const PlayerContext = createContext();
export const TurnContext = createContext({ turn: ['white', 'pe2', 'pe4'], setTurn: () => {} });
export const BoardContext = createContext();
export const EnPassentContext = createContext();

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

  let path = props.location.pathname;
  const gameID = useRef(path.substring(path.lastIndexOf('/') + 1));

  const { currentUser } = useAuth();
  const currentUserID = useRef();
  if (currentUser) currentUserID.current = currentUser.uid;
  else {
    currentUserID.current = 'temporaryID';
  }

  const setUpTurnChange = useRef(false);
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
    console.log(tempboard);
    setBoardArray(tempboard);
  }, []);

  const fixTurnFromFEN = useCallback((FEN) => {
    // switching from b in FEN to w immediately after a white move, in both local storage and in firebase
    for (let i = FEN.length - 1; i >= 0; i--) {
      if (FEN[i] === 'w') {
        setTurn('white');
        setUpTurnChange.current = true;
        break;
      }
      else if (FEN[i] === 'b') {
        setTurn('black');
        setUpTurnChange.current = true;
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
            let temp_FEN = snapshot.val().FEN;
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
    (reload) => {
      let localStorage_FEN = localStorage.getItem('FEN');
      if (!localStorage_FEN) getFEN(gameID.current);
      else {
        fixBoardArray(localStorage_FEN);
        if (reload) fixTurnFromFEN(localStorage_FEN);
      }
    },
    [fixBoardArray, getFEN, fixTurnFromFEN]
  );

  const foundColor = useRef(false);
  useEffect(() => {
    let col = localStorage.getItem(currentUserID.current);
    if (col) {
      foundColor.current = true;
      setplayerColor(col);
    }
  }, []);

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
              console.log(snapshot.val(), playerID);
              if (p2 === undefined && playerID !== p1) {
                // new user, color = black
                setplayerColor('black');
                if (foundColor.current === false) localStorage.setItem(currentUserID.current, 'black');

                update(dbRef, {
                  player2: playerID
                }).then(() => fixStuffOnLoad(false));
              }
              else {
                // old users
                console.log(playerID, p2)
                if (playerID === p1) {
                  setplayerColor('white');
                  if (foundColor.current === false) localStorage.setItem(currentUserID.current, 'white');
                }
                else if (playerID === p2) {
                  setplayerColor('black');
                  if (foundColor.current === false) localStorage.setItem(currentUserID.current, 'black');
                }
                fixStuffOnLoad(true);
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
              fixStuffOnLoad(false);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    [fixStuffOnLoad]
  );

  const setLastMoveFromOtherUser = useRef(true);
  const setFENFromOtherUser = useRef(true);
  useEffect(
    () => {
      // if turn is 'white' or 'black' then this is the wrong user/socket as it has no newLocation
      if (turn.length === 5) return;

      let newLocation = [turn[1], turn[2]];
      console.log(newLocation, boardArray);
      setLastMoveFromOtherUser.current = false;
      setFENFromOtherUser.current = false;

      let column = newLocation[0].charCodeAt(1) - 97; // gets e from pe2 and converts that to 4th column (3 in array)
      let row = parseInt(newLocation[0][2]) - 1; // gets 2 from pe2 and converts that to the 2nd column (1 in array)

      let piece = boardArray[7 - row][column];
      const tempBoard = boardArray;
      tempBoard[7 - row][column] = '1'; // prev square is now empty
      let newColumn = newLocation[1].charCodeAt(1) - 97;
      let newRow = parseInt(newLocation[1][2]) - 1;
      tempBoard[7 - newRow][newColumn] = piece;

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
      if (true) temp_FEN += ' KQkq'; // for castling ***NEEDS FIX***
      if (piece[0].toLowerCase() === 'p' && Math.abs(parseInt(newLocation[0][2]) - parseInt(newLocation[1][2])) === 2) {
        // pe2 to pe4 gets an enPassentSquare of e3
        let enPassentSquare;
        turn[0] === 'black'
          ? (enPassentSquare = parseInt(newLocation[0][2]) + 1)
          : (enPassentSquare = parseInt(newLocation[1][2]) + 1);
        temp_FEN += ' ' + newLocation[0][1] + enPassentSquare;
      }
      else temp_FEN += ' -';

      console.log(temp_FEN);
      setBoardArray(tempBoard);
      setFEN(temp_FEN);
      localStorage.setItem('FEN', temp_FEN);
      update(ref(database, 'Games/' + gameID.current), {
        FEN: temp_FEN,
        lastMove: newLocation
      });
      if (turn[3] !== undefined) {
        update(ref(database, 'Games/' + gameID.current), {
          check: turn[3]
        });
      }
      else {
        update(ref(database, 'Games/' + gameID.current), {
          check: null
        });
      }

      if (playerColor === 'white') setTurn('black');
      else setTurn('white');
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
        console.log(snapshot.val());
        fixBoardArray(temp_FEN);
        localStorage.setItem('FEN', temp_FEN);
        setFEN(temp_FEN);
        off(dbRef);
      }
      else if (snapshot.exists() && setFENFromOtherUser.current === false) {
        setFENFromOtherUser.current = true;
        off(dbRef);
      }
      off(dbRef);
    });
  });

  const [check, setCheck] = useState(null);
  useEffect(() => {
    const dbRef = ref(database, 'Games/' + gameID.current + '/check');
    onValue(dbRef, (snapshot) => {
      if (!snapshot.exists()) return;
      console.log(JSON.stringify(snapshot.val()), JSON.stringify(check));
      let checkingPiece = snapshot.val()[0][0];
      if (
        ((checkingPiece === checkingPiece.toLowerCase() && playerColor === 'white') ||
          (checkingPiece === checkingPiece.toUpperCase() && playerColor === 'black')) &&
        (check === null || JSON.stringify(snapshot.val()) !== JSON.stringify(check))
      ) {
        setCheck(snapshot.val());
        off(dbRef);
      }
      off(dbRef);
    });
  });

  useEffect(() => {
    const dbRef = ref(database, 'Games/' + gameID.current + '/lastMove');
    onValue(dbRef, (snapshot) => {
      if (!snapshot.exists()) return;
      else if (setLastMoveFromOtherUser.current === false) setLastMoveFromOtherUser.current = true;
      else {
        let newLocation = snapshot.val();
        let oldLocation = $('#' + newLocation[0]);
        if (oldLocation.length === 0) return;

        let destination = boardArray[newLocation[1].charCodeAt(1) - 'a'.charCodeAt(0)][8 - parseInt(newLocation[1][2])];
        console.log(boardArray, newLocation[1].charCodeAt(1) - 'a'.charCodeAt(0), 8 - parseInt(newLocation[1][2]));
        if (destination !== '1') {
          $('#' + destination + newLocation[1][1] + newLocation[1][2]).remove();
        }

        oldLocation.appendTo($('#S' + newLocation[1][1] + newLocation[1][2]));
        oldLocation.attr('id', oldLocation[0].id[0] + newLocation[1][1] + newLocation[1][2]);

        if (playerColor === 'white') setTurn('white');
        else setTurn('black');
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

  const enPassentSquare = useMemo(
    () => {
      return FEN[FEN.length - 2] + FEN[FEN.length - 1];
      // enPassent Position
    },
    [FEN]
  );
  return (
    <div className={classes['mainPage']} id='page'>
      <Container>
        <Row>
          <PlayerContext.Provider value={playerColor}>
            <Col>
              <Chat gameID={gameID.current} />
            </Col>

            <Col>
              <CapturedPanel>
                <BoardContext.Provider value={boardArray}>
                  <TurnContext.Provider value={turnValue}>
                    <EnPassentContext.Provider value={enPassentSquare}>
                      <BoardMemo FEN={FEN} check={check} />
                    </EnPassentContext.Provider>
                  </TurnContext.Provider>
                </BoardContext.Provider>
              </CapturedPanel>
            </Col>
          </PlayerContext.Provider>

          <Col>
            <RightPanel turn={turn} FEN={FEN} />
          </Col>
        </Row>
      </Container>
    </div>
  );
});
