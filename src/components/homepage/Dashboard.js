/* eslint-disable default-case */
import { useState, useRef, useEffect, Fragment, memo } from 'react';
import { Alert, Image, Container, Nav, Button, Row } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import classes from './Dashboard.module.css';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import Modal from './Modal/Modal';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default memo(function Dashboard() {
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
  useEffect(
    () => {
      if (profilePic.scale !== 1) localStorage.setItem('scale', profilePic.scale);
    },
    [profilePic]
  );

  const [hidden, setHidden] = useState(true);
  const [inputField, setInputField] = useState(false);
  function changeProfilePic(file) {
    const storage = getStorage();
    const uploadTask = uploadBytesResumable(ref(storage, `profile-pictures/${currentUser.email}.jpg`), file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          localStorage.setItem('profile-pic', downloadURL);
        });
      }
    );
  }

  useEffect(
    () => {
      const localStorageImg = localStorage.getItem('profile-pic');
      const scale = localStorage.getItem('scale');
      if (localStorageImg) {
        setProfilePic({ image: localStorageImg, scale: scale ? scale : 1 });
      }
      else {
        const storage = getStorage();
        getDownloadURL(ref(storage, `profile-pictures/${currentUser.email}.jpg`))
          .then((url) => {
            setProfilePic({ image: url, scale: scale ? scale : 1 });
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
      <Modal
        changeProfilePic={changeProfilePic}
        setOpen={setInputField}
        isOpen={inputField}
        profilePic={profilePic}
        setProfilePic={setProfilePic}
      />
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
                transform: `scale(${profilePic.scale * 1.2})`
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
              {currentUser && currentUser.email ? (
                currentUser.email
              ) : currentUser && currentUser.uid ? (
                currentUser.uid
              ) : (
                'loading...'
              )}
            </pre>
            <div className='position-absolute mb-1' style={{ width: '91%', textAlign: 'right' }}>
              <i className='fa fa-chevron-down' aria-hidden='true' />
            </div>
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

        <div style={{ color: 'black', textAlign: 'center', fontSize: '2.25rem' }}>
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
});
