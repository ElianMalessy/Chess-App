import { useContext, useState, useRef } from 'react';
import { Card, Form } from 'react-bootstrap';
import { database } from '../../firebase';
import { PlayerContext } from './Game';
import classes from './Chat.module.css';

export default function Chat({ dbMessages }) {
  const player = useContext(PlayerContext);
  const [messages, setMessages] = useState(dbMessages ? dbMessages : []);
  const [typingMessage, setTypingMessage] = useState('');
  const time = useRef([]);

  function handleChange(event) {
    setTypingMessage(event.target.value);
  }
  function handleAdd(e) {
    e.preventDefault();
    if (typingMessage === '') return;
    let today = new Date();
    time.current.push(
      today.getHours() + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
    );
    const newList = messages.concat(typingMessage);
    setMessages(newList);
    setTypingMessage('');
  }

  return (
    <Card className='w-100'>
      <Card.Header>Chat</Card.Header>
      <Card.Body className={`${classes.chatBox}`} style={{ flexDirection: 'column' }}>
        <ul className={classes.chat} aria-live='polite'>
          {messages &&
            messages.map((message, index) => {
              return (
                <li key={index} className='d-flex align-items-center'>
                  {`${player}: ${message}`}
                  <span style={{ color: 'rgba(56, 56, 56, 0.825)', fontSize: '0.9rem', marginLeft: 'auto' }}>
                    {time.current[index]}
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
