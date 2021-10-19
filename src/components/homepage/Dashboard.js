import { useState, Fragment } from 'react';
import { Alert, Image, Container, NavDropdown, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import classes from './Dashboard.module.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard() {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const randomURL = Math.floor(Math.random() * 100 + 1);

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
  function toUpdateProfile() {
    history.push('./update-profile');
  }
  function resetPassword() {
    history.push('./forgot-password');
  }
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
  const css = `div.dropdown-menu.show {
      background-color: #161616;
      height: 13rem;
      width: 13rem;
      font-size: 1.25rem;
      padding: 0.5rem 0.5rem 0.5rem 0.5rem;
      margin: 10px;
      transform: translate(0.75rem, -1.1rem)
    } 
    a.dropdown-item {
      text-align: left;
      padding: 0.25rem 0.25rem 0.25rem 0.25rem
    }
    a.dropdown-toggle {
      text-decoration: none;
    }
    a.dropdown-toggle::after {
      display: none;
    }
    a.dropdown-item:hover{
      background-color: #161616;
      color: rgb(167, 164, 164);
    }`;

  return (
    <Fragment>
      <style>{css}</style>
      <style />
      <header className={classes.header}>
        <div className={classes.logo}>WeChess</div>
        <nav>
          <ul>
            <li>
              <Link to='/Game/1' className={`h-50 ${classes.headerLink}`}>
                TESTING
              </Link>
            </li>
            <li>
              <Link to={`/Game/${randomURL}`} className={`h-50 ${classes.headerLink}`}>
                Play
              </Link>
            </li>
          </ul>
        </nav>
        <Navbar variant='dark'>
          <Container>
            <Navbar.Toggle aria-controls='navbar-dark-example' />
            <Navbar.Collapse id='navbar-dark-example'>
              <Image
                src='https://images.chesscomfiles.com/uploads/v1/news/133624.b2e6ae86.668x375o.9d61b2d492ec@2x.jpeg'
                alt='profile-picture'
                className='profilePic'
                onClick={changeProfilePic}
                roundedCircle
              />
              <Nav className={classes.navButton}>
                <NavDropdown
                  title={<i className='fa fa-chevron-down' aria-hidden='true' />}
                  id='nav-dropdown-dark-example'
                >
                  <NavDropdown.Item onClick={toUpdateProfile}>
                    <i className='fa fa-user-circle-o' aria-hidden='true' /> Update Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <i className='fa fa-user-plus' aria-hidden='true' /> Add Friend
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <i className='fa fa-users' aria-hidden='true' /> Friends
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={resetPassword}>
                    <i className='fa fa-key' aria-hidden='true' /> Change Password
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className='fa fa-sign-out' aria-hidden='true' /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
            <pre>
              <strong>Email: </strong>
              {currentUser && currentUser.email ? currentUser.email : currentUser && currentUser.uid}
            </pre>
          </Container>
        </Navbar>
      </header>
      <Container className={`d-flex align-items-center justify-content-center ${classes.bg}`}>
        {error && <Alert variant='danger'>{error}</Alert>}
        <ul className='w-100' style={{ listStyleType: 'none', padding: 10, margin: 0 }}>
          <li>
            <strong>Rating: </strong>1600
          </li>
        </ul>

        <div className='w-100 text-center mt-2'>
          <div />
          <div className='mt-2 d-flex align-items-center justify-content-center'>
            <input
              id='playWithFriend'
              spellCheck='false'
              readOnly='readonly'
              value={'localhost:3000/Game/' + randomURL}
              style={{ position: 'absolute' }}
            />
            <button
              className={'btn btn-success ' + classes['roundedCirc']}
              onClick={() => {
                // needa get a diff userID than passing it from useLocation
                navigator.clipboard.writeText('localhost:3000/Game/' + randomURL);
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
