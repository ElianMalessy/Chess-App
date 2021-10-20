import { useState, Fragment, useRef, useEffect } from 'react';
import { Alert, Image, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import classes from './Dashboard.module.css';
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
  const [profilePic, setProfilePic] = useState();
  const [hidden, setHidden] = useState(true);
  function changeProfilePic() {}

  /*
	useEffect(
		() => {
			setTimeout(() => {
				if (currentUser === null) {
					console.log(currentUser);
					history.push('/Login');
				}
			}, 2000);
		},
		[currentUser, history]
	);
	*/
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
          <Image
            src='https://images.chesscomfiles.com/uploads/v1/news/133624.b2e6ae86.668x375o.9d61b2d492ec@2x.jpeg'
            alt='profile-picture'
            onClick={changeProfilePic}
            roundedCircle
          />
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
      <Container className={`d-flex align-items-center justify-content-center ${classes.bg}`}>
        {error && <Alert variant='danger'>{error}</Alert>}

        <div className='w-100 text-center mt-2'>
          <div />
          <div className='mt-2 d-flex align-items-center justify-content-center' style={{transform: 'translate(0, 10rem)'}}>
            <input
              id='playWithFriend'
              spellCheck='false'
              readOnly='readonly'
              value={'localhost:3000/Game/' + randomURL.current}
              className={classes.linkInput}
            />
            <button
              className={`btn btn-primary ${classes['roundedCirc']}`}
              onClick={() => {
                // needa get a diff userID than passing it from useLocation
                navigator.clipboard.writeText('localhost:3000/Game/' + randomURL.current);
                alert('Copied to clipboard');
              }}
            >
              <i className='fa fa-link' />
            </button>
          </div>
          <div />
        </div>
      </Container>
    </Fragment>
  );
}
