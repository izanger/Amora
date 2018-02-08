import React, { Component } from 'react';
import rebase, { auth, google } from "./rebase.js"
import { Route, Switch, Redirect } from "react-router-dom";

import Login from "./Login.js"

import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentWillMount() {

    // https://github.com/tylermcginnis/re-base

    // Setting up a listener for auth state change: 
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        const newState = { ...this.state }
        newState.user = user
        this.setState(newState)
      } else {
        // User is not signed in
        const newState = { ...this.state }
        newState.user = { }
        this.setState(newState)
      }
    })
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => <Login />} />
            <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    );
  }
}

export default App;
