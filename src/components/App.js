import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "../components/Signup";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./homepage/Dashboard";
import Game from "./game/Game";
import Login from "../components/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/Signup" component={Signup} />
            <Route exact path="/" component={Dashboard} />
            <Route path="/Game" component={Game} />
            <Route path="/Login" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
