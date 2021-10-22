import { useState, useRef, useEffect, Fragment, createContext } from 'react';
import { Alert, Image, Container, Nav, Button, Row } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import classes from './Dashboard.module.css';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import Modal from './Modal/Modal';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ImageContext = createContext({ img: 'src', setImg: () => {} });
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

  // 'https://images.chesscomfiles.com/uploads/v1/news/133624.b2e6ae86.668x375o.9d61b2d492ec@2x.jpeg --magnus carlsen pfp'
  const [profilePic, setProfilePic] = useState({
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Font_Awesome_5_solid_user-circle.svg/991px-Font_Awesome_5_solid_user-circle.svg.png',
    scale: 1
  });
  const storage = getStorage();

  const [hidden, setHidden] = useState(true);
  const [inputField, setInputField] = useState(false);
  function changeProfilePic(file) {
    uploadBytes(ref(storage, `profile-pictures/${currentUser}.jpg`), file).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
    });
  }
  useEffect(
    () => {
      const storage = getStorage();
      getDownloadURL(ref(storage, `profile-pictures/${currentUser}.jpg`))
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            const blob = xhr.response;
            console.log(blob);
          };
          xhr.open('GET', url);
          xhr.send();

          setProfilePic(url);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [currentUser]
  );
  const clickRef = useRef();
  useEffect(
    () => {
      function handleClickOutside(event) {
        if (clickRef.current && !clickRef.current.contains(event.target)) {
          setHidden(true);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    },
    [clickRef]
  );

  return (
    <Fragment>
      <ImageContext.Provider value={{ profilePic, setProfilePic }}>
        <Modal
          changeProfilePic={changeProfilePic}
          setOpen={setInputField}
          isOpen={inputField}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
        />
      </ImageContext.Provider>
      <header className={classes.header}>
        <div className={classes.logo}>
          <Image
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUZZloLNz2F11mD77ey5TLZezGlFueOWuFqw&usqp=CAU'
            alt='logo'
            className={classes.logoImage}
            onClick={() => history.push('/development')}
            roundedCircle
          />
          WeChess
        </div>
        <ul>
          <li>
            <Link to='/Game/1' className={`h-50 ${classes.headerLink}`}>
              Testing
            </Link>
          </li>
          <li>
            <Link to={`/Game/${randomURL.current}`} className={`h-50 ${classes.headerLink}`}>
              Play
            </Link>
          </li>
        </ul>

        <Nav className={classes.profileNav}>
          <div
            className='d-flex align-items-center justify-content-center'
            style={{ overflow: 'hidden', height: '4.5rem', width: '4.5rem', borderRadius: '50%' }}
          >
            <Image
              src={profilePic.image}
              alt='profile-picture'
              style={{
                transform: `scale(${profilePic.scale})`
              }}
              id='profile-pic'
              onClick={() => setInputField(true)}
              className={classes.profilePic}
            />
          </div>
          <Button
            className={classes.dropDownButton}
            onClick={() => (hidden === true ? setHidden(false) : setHidden(true))}
            ref={clickRef}
            style={{ boxShadow: 'none' }}
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
