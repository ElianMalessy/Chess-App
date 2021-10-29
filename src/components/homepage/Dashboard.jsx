/* eslint-disable default-case */
import { useState, useRef, useEffect, Fragment, memo, useCallback } from 'react';
import { Alert, Image, Container, Nav, Button, Row } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import classes from './Dashboard.module.css';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import Modal from './Modal/Modal';
import dataURLtoFile, { toDataURL } from './convertToFile';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default memo(function Dashboard() {
  const [error, setError] = useState('');
  const { currentUser, logout, updateProfilePic } = useAuth();
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

  // 'https://images.chesscomfiles.com/uploads/v1/news/133624.b2e6ae86.668x375o.9d61b2d492ec@2x.jpeg' <-- magnus carlsen pfp
  const [profilePic, setProfilePic] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Font_Awesome_5_solid_user-circle.svg/991px-Font_Awesome_5_solid_user-circle.svg.png'
  );
  const [hidden, setHidden] = useState(true);
  const [inputField, setInputField] = useState(false);

  const changeProfilePic = useCallback(
    (file) => {
      const storage = getStorage();
      const uploadTask = uploadBytesResumable(ref(storage, `profile-pictures/${currentUser.uid}.jpg`), file);
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
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateProfilePic(downloadURL);
          });
        }
      );
    },
    [currentUser, updateProfilePic]
  );

  useEffect(
    () => {
      const storage = getStorage();

      if (currentUser) {
        if (currentUser.photoURL) setProfilePic(currentUser.photoURL);
        else {
          getDownloadURL(ref(storage, `profile-pictures/${currentUser.uid}.jpg`))
            .then((url) => {
              setProfilePic(url);
            })
            .catch((error) => {
              const img =
                'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Font_Awesome_5_solid_user-circle.svg/991px-Font_Awesome_5_solid_user-circle.svg.png';
              setProfilePic(img);
              toDataURL(img).then((dataUrl) => {
                const fileData = dataURLtoFile(dataUrl, `${currentUser.uid}.jpg`);
                changeProfilePic(fileData);
              });
            });
        }
      }
    },
    [currentUser, changeProfilePic]
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
        <Nav>
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
        </Nav>
        <Nav className={classes.profileNav}>
          <div
            className='d-flex align-items-center justify-content-center'
            style={{
              overflow: 'hidden',
              height: '4.5rem',
              width: '4.5rem',
              borderRadius: '50%',
              transform: 'translate(-1rem, 0)'
            }}
          >
            <Image
              src={profilePic}
              alt='profile-picture'
              id='profile-pic'
              onClick={() => setInputField(true)}
              className={classes.profilePic}
            />
          </div>
          <div ref={clickRef} className='d-flex align-items-center'>
            <Button
              className={classes.dropDownButton}
              onClick={() => (hidden === true ? setHidden(false) : setHidden(true))}
              style={{ boxShadow: 'none' }}
            >
              <pre>
                {currentUser && currentUser.displayName ? (
                  currentUser.displayName
                ) : currentUser && currentUser.email ? (
                  currentUser.email
                ) : (
                  'anonymous'
                )}
                <i className='fa fa-chevron-down' style={{ marginLeft: '0.5rem' }} aria-hidden='true' />
              </pre>
              <div hidden={hidden} className={classes.dropDownMenu}>
                <Link to='/update-profile' className={classes['dropdown-item']}>
                  <i className='fa fa-user-circle-o' aria-hidden='true' /> Update Profile
                </Link>
                <Link to='#' className={classes['dropdown-item']} onClick={handleLogout}>
                  <i className='fa fa-sign-out' aria-hidden='true' /> Logout
                </Link>
              </div>
            </Button>
          </div>
        </Nav>
      </header>
      <Container className={`d-flex justify-content-center ${classes.bg}`} fluid>
        <div style={{ alignSelf: 'flex-end' }}>
          {error && <Alert variant='danger'>{error}</Alert>}

          <Row className='d-flex align-items-center' style={{ height: '5rem' }}>
            <input
              id='playWithFriend'
              spellCheck='false'
              readOnly='readonly'
              value={'localhost:3000/Game/' + randomURL.current}
              className={classes.linkInput}
            />
            <Button
              className={classes.roundedCirc}
              onClick={() => {
                navigator.clipboard.writeText('localhost:3000/Game/' + randomURL.current);
                alert('Copied to clipboard');
              }}
            >
              <i className='fa fa-link' />
            </Button>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
});