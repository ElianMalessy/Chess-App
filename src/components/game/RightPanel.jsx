import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function RightPanel({ turn, FEN, lastMove }) {
  return (
    <Card className='h-100 w-100'>
      <Card.Body>
        <Card style={{ backgroundColor: 'grey', borderRadius: '1rem' }}>
          <Card.Body
            style={{
              color: turn[0].length === 1 ? turn : turn[0],
              fontSize: 20
            }}
          >
            Turn: {turn[0].length === 1 ? turn : turn[0]}
          </Card.Body>
        </Card>
        <div className='w-100' style={{ position: 'absolute', bottom: '0.5rem' }}>
          <small style={{ color: 'black' }}>FEN: </small>
          <Card.Text className='d-flex align-items-center'>
            <input spellCheck='false' readOnly='readonly' value={FEN} style={{ width: '78.5%' }} />
            <Button
              style={{ borderRadius: '50%', marginLeft: '0.225rem' }}
              onClick={() => {
                navigator.clipboard.writeText(FEN);
                alert('Copied to clipboard');
              }}
            >
              <i className='fa fa-link' />
            </Button>
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}
