import React, { Component } from 'react';
import rebase, { auth, google } from "./rebase.js"
import { Route, Switch, Redirect } from "react-router-dom";
import { isObjectEmpty } from "./apphelpers.js"

import Login from "./Login.js"
import Home from "./Home.js"

import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: { }
    }
  }

  componentWillMount() {
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

  getAppState = () => {
    return this.state;
  }

  setAppState = (newState) => {
    this.setState(newState);
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" render={() => {
            if (!isObjectEmpty(this.state.user)) {
              return <Home getAppState={this.getAppState} setAppState={this.setAppState} />
            } else {
              return <Login />
            }
          }} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    );
  }
}

export default App;
