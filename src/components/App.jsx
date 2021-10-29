import Signup from './login/Signup.jsx';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './homepage/Dashboard.jsx';
import Game from './game/Game.jsx';
import Login from './login/Login.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import ForgotPassword from './homepage/dropdown/ForgotPassword.jsx';
import UpdateProfile from './homepage/dropdown/UpdateProfile.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // /Game should be a private route as well in production
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path='/Signup' component={Signup} />
          <Route exact path='/' component={Dashboard} />
          <Route path='/Game/:randomURL' component={Game} />
          <Route exact path='/Login' component={Login} />
          <Route path='/forgot-password' component={ForgotPassword} />
          <PrivateRoute path='/update-profile' component={UpdateProfile} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
