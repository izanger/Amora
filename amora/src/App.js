import React, { Component } from 'react';
import rebase, { auth } from "./rebase.js"
import { Route, Switch, Redirect } from "react-router-dom";
import { isObjectEmpty, buildUserFromGoogle } from "./apphelpers.js"
import { DragDropContext } from 'react-beautiful-dnd';

import Login from "./Login.js"
import Home from "./Home.js"

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: { },
      userSynced: false,
      currentProject: { },
      notified: false,
      taskCompleted: 0,
      allTimeHours: 0,
      onTimeTasks: 0,
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.user.notifications != null && nextState.user.notifications != undefined 
      && this.state.user.notifications != null && this.state.user.notifications != undefined) {
      if (Object.keys(nextState.user.notifications).length > 0) {
        this.notifyMe()
      }
    } else {
        if (this.state.notified) {
          this.setState({notified: false})
        }
    }
  }

  notifyMe = () => {
    if (!this.state.notified) {
      if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification("You have notifications!");
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            var notification = new Notification("You have notifications!");
          }
        });
      }
      this.setState({notified: true})
    }
  }
  
  checkIfUserIsInDatabase(user) {
    // let inDataBase = false
    rebase.fetch(`users/${user.uid}`, {
      context: this
    }).then((data) => {
      if (isObjectEmpty(data)) {
        this.postUser(user)
      }
    })
  }

  postUser(user) {
    var today = new Date();
    rebase.post(`users/${user.uid}`, {
      data: user
    });
    //add personal project
    rebase.push("projects", {
      data: {
          projectName: "Personal Dashboard",
          projectColor: "DeepSkyBlue",
          projectCreator: this.state.user.uid,
          projectPhotoURL: this.state.user.photoURL,
          isPersonalDashboardProject: true,
          projectDescription: `${user.displayName}'s Personal Dashboard`,
          taskCategories: {
            General: true,
          },
      }
    }).then((newLocation) => {
      rebase.post(`projects/${newLocation.key}/managerList`, { //create list of managers within project, and add the user to it
          data: {
              [this.state.user.uid]: true
          }
      })
      rebase.post(`projects/${newLocation.key}/userList`, { //create list of users on project, and add user to it
          data: {
              [this.state.user.uid]: this.state.user.photoURL
          }
      })
      rebase.post(`projects/${newLocation.key}/whenJoined`, { //create list of users on project, and add user to it
        data: {
            [this.state.user.uid]: today.getTime()
        }
    })
      rebase.update(`projects/${newLocation.key}`, {
          data: {
              key: newLocation.key
          }
      })
      rebase.update(`users/${this.state.user.uid}`, {
        data: {
          personalProjectID: newLocation.key
        }
      })
      rebase.update(`users/${this.state.user.uid}`, {
        data: {
          dateJoined: today.getTime()
        }
      })
      rebase.update(`users/${this.state.user.uid}`, {
        data: {
          taskCompleted: this.state.taskCompleted
        }
      })
      rebase.update(`users/${this.state.user.uid}`, {
        data: {
          allTimeHours: this.state.allTimeHours
        }
      })
      rebase.update(`users/${this.state.user.uid}`, {
        data: {
          onTimeTasks: this.state.onTimeTasks
        }
      })
      var now = new Date()
      rebase.post(`projects/${newLocation.key}/events/-L8mjk1OjJol4y34AIPh`, { 
          data: {
            event: " created the project",
            timestamp: now.getMonth()+1 + "/" + now.getDate() + "/" + now.getFullYear(),
            useid: this.state.user.uid
          }
      })
      rebase.fetch(`projects/${newLocation.key}`, {//get the project data we just added to ~/projects
        context: this
      }).then(projData => {
        rebase.update(`users/${this.state.user.uid}/projects/${newLocation.key}`, { //Add the project we just created to user's list of projects
          data: projData
        })
        let newState = { ...this.state }
        newState.currentProject = projData
        this.setState(newState)
        //this.props.history.push(`/projects/${newLocation.key}`)

        rebase.update(`users/${this.state.user.uid}/projects/${newLocation.key}`, { //Add the project we just created to user's list of projects
          data: {
            taskAlertTime: "None",
          }
        })
      })
    })
  }

  componentWillMount() {
    this.goToUrl("/notifications")
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        const newState = { ...this.state }
        const newUser = buildUserFromGoogle(user)
        newState.user = newUser
        this.setState(newState)
        this.checkIfUserIsInDatabase(newUser)
        //console.log(user)
        this.bindingref = rebase.syncState(`users/${this.state.user.uid}`, {
          context: this,
          state: 'user',
          then: () => {
            const newState = { ...this.state }
            newState.userSynced = true
            //newState.currentProject = this.state.user.projects[this.state.user.personalProjectID]
            //this.props.history.push(`/projects/${this.state.user.personalProjectID}`)
            //^ This was me trying to auto-route to the personal dashboard when a previous user logged in,
            //but it caused weird errors

            this.setState(newState)
          }
          
        })
      } else {
        // User is not signed in
        if (this.bindingref) {
          rebase.removeBinding(this.bindingref)
        }
        const newState = { ...this.state }
        newState.user = { }
        this.setState(newState)
        this.goToUrl("/")
      }
    })
  }

  getAppState = () => {
    return this.state;
  }

  setAppState = (newState) => {
    this.setState(newState)
  }

  goToUrl = (url) => {
    this.props.history.push(url)
  }

  goBack = () => {
    this.props.history.goBack()
  }

  render() {
    return (
      <DragDropContext>
      <div className="App">
        <Switch>
          <Route path="/" render={() => {
            if (!isObjectEmpty(this.state.user)) {
              return <Home getAppState={this.getAppState} setAppState={this.setAppState} goToUrl={this.goToUrl} goBack={this.goBack}/>
            } else {
              return <Login />
            }
          }} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
      </DragDropContext>
    );
  }
}

export default App;
