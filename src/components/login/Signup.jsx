import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import Background from './Background';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, anonSignup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }
    try {
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      history.push('/');

      setLoading(false);
    } catch (error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode === 'email-already-in-use') {
        setError('You already have an account with that email.');
      }
      else if (errorCode === 'auth/invalid-email') {
        setError('Please provide a valid email');
      }
      else if (errorCode === 'auth/weak-password') {
        setError('The password is too weak.');
      }
      else {
        setError(errorMessage);
      }
    }
  }
  async function handleGuest(e) {
    e.preventDefault();

    try {
      await anonSignup();
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Fragment>
      <Background />
      <Container className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
        <Card className='w-100' style={{ backgroundColor: '#1F1F1F', maxWidth: 500, color: 'white' }}>
          <Card.Body>
            <h2 className='text-center mb-4'>Sign Up</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' ref={emailRef} required />
              </Form.Group>
              <Form.Group id='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' ref={passwordRef} required />
              </Form.Group>
              <Form.Group id='password-confirm'>
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type='password' ref={passwordConfirmRef} required />
              </Form.Group>
              <Button disabled={loading} className='w-100 mt-2' type='submit'>
                Sign Up
              </Button>
            </Form>
            <div className='w-100 text-center mt-2'>
              <Button onClick={handleGuest} variant='link' style={{ textDecoration: 'none' }}>
                Play as guest
              </Button>
            </div>
            <div className='w-100 text-center mt-2'>
              Already have an account? <Link to='/Login'>Log In</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
}
