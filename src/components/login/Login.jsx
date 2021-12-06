import { Fragment, useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import Background from './Background';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, anonSignup } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoginError('');
      setLoading(true);

      login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      history.push('/');
    } catch (error) {
      setLoading(false);
      setLoginError('Failed to log in');
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
      <Container
        className='d-flex align-items-center justify-content-center'
        style={{
          minHeight: '100vh',
          minWidth: '100vw',
          backgroundSize: 'cover',
          backgroundImage:
            'url(https://images.chesscomfiles.com/uploads/v1/article/17623.87bb05cd.668x375o.47d81802f1eb@2x.jpeg)'
        }}
      >
        <Card className='w-100' style={{ maxWidth: 500, backgroundColor: '#1F1F1F', color: 'white' }}>
          <Card.Body>
            <h2 className='text-center mb-4'>Log In</h2>
            {loginError && <Alert variant='danger'>{loginError}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' ref={emailRef} required />
              </Form.Group>
              <Form.Group id='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' ref={passwordRef} required />
              </Form.Group>
              <Button disabled={loading} className='w-100 mt-2' type='submit'>
                Log In
              </Button>
            </Form>
            <div className='w-100 text-center mt-2'>
              <Link to='/forgot-password'>
                Forgot Password? <i className='fa fa-key' aria-hidden='true' />
              </Link>
            </div>
            <div className='w-100 text-center mt-1'>
              <Button onClick={handleGuest} variant='link' style={{ textDecoration: 'none' }}>
                Play as guest
              </Button>
            </div>
            <div className='w-100 text-center mt-1'>
              Need an account? <Link to='/Signup'>Sign Up</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
}
