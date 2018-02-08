import React, { Component } from 'react';
import rebase, { auth, google } from "./rebase.js"

import Login from "./Login.js"
import Home from "./Home.js"

import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentWillMount() {
    // Rebase fetch example:
    // * * * * * * * * * * * *
    // rebase.fetch('test', {
    //   context: this,
    //   asArray: false,
    //   then(data){
    //     console.log(data);
    //   }
    // })

    // Signing in with a popup:
    // * * * * * * * * * * * *
    // auth.signInWithPopup(google)

    // Setting up a listener for auth state change:
    // * * * * * * * * * * * *
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
      } else {
        // User is not signed in
      }
    })
  }

  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        <Login />
      </div>
    );
  }
}

export default App;
