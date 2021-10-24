import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from '../components/login/Signup';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './homepage/Dashboard';
import Game from './game/Game';
import Login from '../components/login/Login';
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "../components/homepage/dropdown/ForgotPassword"
import UpdateProfile from "../components/homepage/dropdown/UpdateProfile"

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
					<Route path="/forgot-password" component={ForgotPassword} />
					<PrivateRoute path="/update-profile" component={UpdateProfile} />

				</Switch>
			</AuthProvider>
		</Router>
	);
}

export default App;
