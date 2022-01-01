import { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function UpdateProfile() {
  const userNameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, updateUsername, deleteCurrentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    const promises = [];
    setLoading(true);
    setError('');

    if (userNameRef.current.value !== currentUser.email) {
      promises.push(updateUsername(userNameRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history.push('/');
      })
      .catch((error) => {
        console.log(error);
        setError('Failed to update account');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className='w-100 h-100' style={{ backgroundColor: '#1f1e1e', position: 'absolute' }}>
      <Card style={{ backgroundColor: '#1f1e1e' }}>
        <Card.Body style={{ color: 'white' }}>
          <h2 className='text-center mb-4'>Update Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id='email'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                ref={userNameRef}
                required
                defaultValue={
                  currentUser.displayName ? (
                    currentUser.displayName
                  ) : currentUser.email ? (
                    currentUser.email
                  ) : (
                    '(anonymous)'
                  )
                }
                maxLength='20'
              />
            </Form.Group>
            <Form.Group id='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' ref={passwordRef} placeholder='Leave blank to keep the same' />
            </Form.Group>
            <Form.Group id='password-confirm'>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type='password' ref={passwordConfirmRef} placeholder='Leave blank to keep the same' />
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-3' type='submit'>
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Link to='/'>Cancel</Link>
      </div>
      <Button
        disabled={loading}
        onClick={deleteCurrentUser}
        className='mt-3'
        type='submit'
        style={{ marginLeft: '1rem' }}
      >
        Delete Account
      </Button>
    </div>
  );
}
