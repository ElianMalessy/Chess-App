import { useState, Fragment, useRef, useEffect } from 'react';
import { Alert, Image, Container, Nav, Button, Card, Form, Row } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import classes from './Dashboard.module.css';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const randomURL = useRef(Math.floor(Math.random() * 100 + 1));

  async function handleLogout() {
    setError('');
    try {
      await logout();
      history.push('/Login');
    } catch (error) {
      console.log(error);
      setError('Failed to log out');
    }
  }

  const [profilePic, setProfilePic] = useState(
    'https://images.chesscomfiles.com/uploads/v1/news/133624.b2e6ae86.668x375o.9d61b2d492ec@2x.jpeg'
  );
  const storage = getStorage();

  const [hidden, setHidden] = useState(true);
  const [inputField, setInputField] = useState(false);
  function changeProfilePic(file) {
    uploadBytes(ref(storage, `profile-pictures/${currentUser}.jpg`), file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  }

  const imageRef = useRef();
  const clickRef = useRef();
  useEffect(
    () => {
      function handleClickOutside(event) {
        if (clickRef.current && !clickRef.current.contains(event.target)) {
          setHidden(true);
        }
        if (imageRef.current && !imageRef.current.contains(event.target)) {
          setInputField(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    },
    [clickRef, imageRef]
  );

  return (
    <Fragment>
      <header className={classes.header}>
        <div className={classes.logo}>WeChess</div>
        <ul>
          <li>
            <Link to='/Game/1' className={`h-50 ${classes.headerLink}`}>
              TESTING
            </Link>
          </li>
          <li>
            <Link to={`/Game/${randomURL.current}`} className={`h-50 ${classes.headerLink}`}>
              Play
            </Link>
          </li>
        </ul>

        <Nav className={classes.profileNav}>
          <Image src={profilePic} alt='profile-picture' onClick={() => setInputField(true)} roundedCircle />
          <Button
            className={classes.dropDownButton}
            onClick={() => (hidden === true ? setHidden(false) : setHidden(true))}
            ref={clickRef}
            style={{ backgroundColor: 'inherit', boxShadow: 'none' }}
          >
            <pre>
              <strong>Email: </strong>
              {currentUser && currentUser.email ? currentUser.email : currentUser && currentUser.uid}
              <i className='fa fa-chevron-down' aria-hidden='true' style={{ marginLeft: '0.5rem' }} />
            </pre>
          </Button>
          <div hidden={hidden} className={classes.dropDownMenu}>
            <Link to='/update-profile' className={classes['dropdown-item']}>
              <i className='fa fa-user-circle-o' aria-hidden='true' /> Update Profile
            </Link>
            <Link to='/' className={classes['dropdown-item']}>
              <i className='fa fa-user-plus' aria-hidden='true' /> Add Friend
            </Link>
            <Link to='/' className={classes['dropdown-item']}>
              <i className='fa fa-users' aria-hidden='true' /> Friends
            </Link>
            <Link to='/forgot-password' className={classes['dropdown-item']}>
              <i className='fa fa-key' aria-hidden='true' /> Change Password
            </Link>
            <Link to='#' className={classes['dropdown-item']} onClick={handleLogout}>
              <i className='fa fa-sign-out' aria-hidden='true' /> Logout
            </Link>
          </div>
        </Nav>
      </header>
      <Container className={`d-flex justify-content-center ${classes.bg}`} fluid>
        {error && <Alert variant='danger'>{error}</Alert>}
        {inputField === true ? (
          <Row className='position-absolute mt-5'>
          <Card className={classes.imageCard} ref={imageRef}>
            <Card.Body>
              <h2 className='text-center mb-4'>Change Profile Picture</h2>
              <Form onSubmit={changeProfilePic}>
                <Form.Group id='image'>
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control type='url' required />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          </Row>
        ) : null}
        <div style={{ color: 'white', textAlign: 'center', fontSize: '2.25rem' }}>
          <Row style={{ maxWidth: '50rem' }}>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum."
          </Row>

          <Row className='justify-content-center mt-5' style={{ height: '5rem' }}>
            <input
              id='playWithFriend'
              spellCheck='false'
              readOnly='readonly'
              value={'localhost:3000/Game/' + randomURL.current}
              className={classes.linkInput}
            />
            <button
              className={`btn btn-primary ${classes.roundedCirc}`}
              onClick={() => {
                // needa get a diff userID than passing it from useLocation
                navigator.clipboard.writeText('localhost:3000/Game/' + randomURL.current);
                alert('Copied to clipboard');
              }}
            >
              <i className='fa fa-link' />
            </button>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
}
