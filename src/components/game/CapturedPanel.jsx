import { useState, useEffect, useMemo, useRef, createContext } from 'react';
import { Card } from 'react-bootstrap';
import classes from './Board.module.css';
import $ from 'jquery';

export const CapturedPieces = createContext({ pieces: null, setPiece: () => {} });

export default function CapturedPanel({ children }) {
  const [num, setNum] = useState(0);
  const [piece, setPiece] = useState(null);
  const value = { piece, setPiece };

  const pieceDiv = useMemo(() => <div id={'end' + num} className={classes['captured']} key={num} />, [num]);
  const dereferenceObjPieces = pieceDiv;
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
      const newPiece = $('<span> </span>').addClass(piece);
      $('#end' + (all_pieces.length - 1)).append(newPiece);
      setNum((n) => n + 1);
    },
    [piece, all_pieces]
  );

  return (
    <CapturedPieces.Provider value={value}>
      {children}
      <Card className='w-100' style={{ maxWidth: '35em', backgroundColor: '#0a0a0a9a' }}>
        <div className={classes['captured-bg']}>{all_pieces}</div>
      </Card>
    </CapturedPieces.Provider>
  );
}
