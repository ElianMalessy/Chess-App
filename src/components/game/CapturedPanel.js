import { useState, useEffect, useMemo, useRef, createContext } from 'react';
import { Card } from 'react-bootstrap';
import classes from './Board.module.css';
import $ from 'jquery';

export const CapturedPieces = createContext({ pieces: null, setPiece: () => {} });

export default function CapturedPanel(props) {
  const [num, setNum] = useState(0);
  const [piece, setPiece] = useState(null);
  const value = { piece, setPiece };

  const pieceMemo = useMemo(() => <div id={'end' + num} className={classes['captured']} key={num} />, [num]);
  const dereferenceObjPieces = pieceMemo;
  const all_pieces = useMemo(() => [], []);
  useEffect(
    () => {
      all_pieces.push(dereferenceObjPieces);
    },
    [dereferenceObjPieces, all_pieces, num]
  );

  const firstUpdate2 = useRef(true);
  useEffect(
    () => {
      if (firstUpdate2.current) {
        firstUpdate2.current = false;
        return;
      }
      $(piece).appendTo('#end' + (all_pieces.length - 1));
      $(piece).css('opacity', 1);
      setNum((n) => n + 1);
    },
    [piece, all_pieces]
  );

  return (
    <div>
      <CapturedPieces.Provider value={value}>
        {props.children}
        <Card className='w-100' style={{ maxWidth: 800, backgroundColor: '#0a0a0a9a' }}>
          <div className={classes['captured-bg']}>{all_pieces}</div>
        </Card>
      </CapturedPieces.Provider>
    </div>
  );
}
