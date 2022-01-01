import { useState, useRef, useEffect, Fragment, memo, useCallback } from 'react';
import { Alert, Image, Container, Nav, Button, Row, FormControl } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import classes from './Dashboard.module.css';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import Modal from './Modal/Modal';
import dataURLtoFile, { toDataURL } from './convertToFile';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChessModel from './ChessModel';

export default memo(function Dashboard() {
  const [error, setError] = useState('');
  const { currentUser, logout, updateProfilePic } = useAuth();
  const history = useHistory();
  const gameID = useRef(Math.floor(Math.random() * 100 + 1));
  const [randomURL, setRandomURL] = useState(window.location.href + 'Game/' + gameID.current);

  useEffect(() => {
    if (!currentUser) history.push('/Login');
  });

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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Font_Awesome_5_solid_user-circle.svg/991px-Font_Awesome_5_solid_user-circle.svg.png'
  );
  const [hidden, setHidden] = useState(true);
  const [inputField, setInputField] = useState(false);

  const changeProfilePic = useCallback(
    (file) => {
      console.log(file);
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
            default:
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
        if (currentUser.photoURL) {
          setProfilePic(currentUser.photoURL);
        }
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

  useEffect(() => {
    function apply(element, o, u) {
      var output;
      let i = document.getElementById(element);
      if (!i) return;
      if (u) {
        output = i.value + (u + '');
      }
      else {
        output = Number(i.value);
      }
      document.documentElement.style.setProperty(o, output);
      i.nextElementSibling.innerHTML = output;
    }
    setTimeout(function() {
      // apply default values
      apply('x_axis', '--x', 'deg');
      apply('y_axis', '--y', 'deg');
      apply('z_axis', '--z', 'deg');
      apply('tx_axis', '--tx', 'px');
      apply('ty_axis', '--ty', 'px');
      apply('tz_axis', '--tz', 'px');
      apply('perspective', '--p', 'px');
      apply('scale', '--s');

      setTimeout(function() {
        document.documentElement.classList.add('scalable');
      }, 1000);
    }, 1000);
  });

  return (
    <Fragment>
      <div className={classes.page}>
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
                <Link to={`/Game/${gameID.current}`} className={`h-50 ${classes.headerLink}`}>
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
                onMouseEnter={() => setHidden(false)}
                onClick={() => (hidden ? setHidden(false) : setHidden(true))}
                style={{ boxShadow: 'none' }}
                variant='outline-secondary'
              >
                <pre>
                  {currentUser && currentUser.displayName ? (
                    currentUser.displayName
                  ) : currentUser && currentUser.email ? (
                    currentUser.email
                  ) : (
                    '(anonymous)'
                  )}
                  <i className='fa fa-chevron-down' style={{ marginLeft: '0.5rem' }} aria-hidden='true' />
                </pre>
                <div hidden={hidden} className={classes.dropDownMenu}>
                  <Link to='/update-profile' className={classes['dropdown-item']}>
                    <i className='fa fa-user-circle-o' aria-hidden='true' /> Profile
                  </Link>
                  <Link to='#' className={classes['dropdown-item']} onClick={handleLogout}>
                    <i className='fa fa-sign-out' aria-hidden='true' /> Logout
                  </Link>
                </div>
              </Button>
            </div>
          </Nav>
        </header>
        <Container className={`d-flex justify-content-center h-100 w-100`} fluid>
          <ChessModel />

          {error && <Alert variant='danger'>{error}</Alert>}
          <Row
            className={`d-flex justify-content-center align-items-center ${classes.linkRow}`}
            style={{ zIndex: 100 }}
          >
            <FormControl
              value={randomURL}
              className={classes.linkInput}
              onChange={(e) => setRandomURL(e.target.value)}
              style={{ fontSize: '1.25rem' }}
            />

            <Button
              className={classes.roundedCirc}
              onClick={() => {
                navigator.clipboard.writeText(randomURL);
                alert('Copied to clipboard');
              }}
            >
              <i className='fa fa-link' />
            </Button>
          </Row>
        </Container>
      </div>

      <div className={classes.shape}>
        <svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'>
          <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' />
        </svg>
      </div>
    </Fragment>
  );
});
