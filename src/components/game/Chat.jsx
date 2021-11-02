import { useContext, useState, useRef, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { database } from '../../firebase';
import { onValue, ref, push, get, set, child } from '@firebase/database';
import { PlayerContext } from './Game';
import classes from './Chat.module.css';

export default function Chat({ gameID }) {
  const player = useContext(PlayerContext);
  const [message, setMessage] = useState([]);
  const [typingMessage, setTypingMessage] = useState('');
  const sentMessage = useRef(null);
  const history = useRef([]);

  useEffect(
    () => {
      const dbRef = ref(database, 'Games/' + gameID + '/messages');
      const tempMessages = [];
      async function getHistory() {
        await get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            Object.values(snapshot.val()).forEach((val) => {
              history.current.push(val);
              tempMessages.push(val);

            });
            setMessage(tempMessages);
          }
        });
      }
      getHistory();
    },
    [gameID]
  );

  function getTime() {
    let today = new Date();
    return today.getHours() + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes() + 1);
  }

  function handleChange(event) {
    setTypingMessage(event.target.value);
  }

  function handleAdd(e) {
    const dbRef = ref(database, 'Games/' + gameID + '/messages');
    e.preventDefault();
    if (typingMessage === '') return;

    const currTime = getTime();
    sentMessage.current = [player, typingMessage, currTime];
    const newList = message.concat([sentMessage.current]);

    setMessage(newList);
    setTypingMessage('');

    const key = push(dbRef).key;
    set(child(dbRef, key), sentMessage.current);
  }

  return (
    <Card className='w-100'>
      <Card.Header>Chat</Card.Header>
      <Card.Body className={`${classes.chatBox}`} style={{ flexDirection: 'column' }}>
        <ul className={classes.chat} aria-live='polite'>
          {message &&
            message.map((message, index) => {
              return (
                <li key={index} className='d-flex align-items-center'>
                  {`${message[0] ? message[0] : player}: ${message[1]}`}
                  <span style={{ color: 'rgba(56, 56, 56, 0.825)', fontSize: '0.9rem', marginLeft: 'auto' }}>
                    {message[2] ? message[2] : getTime()}
                  </span>
                </li>
              );
            })}
        </ul>
      </Card.Body>
      <div className={`w-100 ${classes.textInput}`}>
        <Form onSubmit={handleAdd}>
          <input
            placeholder='type to chat...'
            type='text'
            onChange={handleChange}
            value={typingMessage}
            aria-label='Chat input'
            className={`w-100 ${classes.chatInput}`}
          />
        </Form>
      </div>
    </Card>
  );
}
