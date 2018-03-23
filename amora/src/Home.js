import React, { Component } from 'react'
import rebase, { auth } from "./rebase.js"
import { Route, Switch, Redirect } from "react-router-dom"

import line from "./images/Line/Line.png"
import "./Home.css"

import ProjectIcon from "./ProjectSelectorComps/ProjectIcon.js"
import CreateProjectForm from './CreateProjectForm.js';
import ProjectDashboard from "./ProjectDashboardComps/ProjectDashboard.js"
import NewProjectButton from "./ProjectSelectorComps/NewProjectButton.js"
import CreateTaskForm from './CreateTaskForm.js';
import Notifications from "./Notifications.js";
import MyDayTitleBar from "./MyDayComps/MyDayTitleBar.js"
import { doubleToIEEE754String } from '@firebase/database/dist/esm/src/core/util/util';

class Home extends Component {
    constructor() {
        super()
        this.state = {
            displayName: "",
            varHours:""
        }
    }

    componentWillMount() {
       this.getName();
    }

    signOut = () => {
        const newState = { ...this.props.getAppState() }
        newState.user = { }
        this.props.setAppState(newState)
        auth.signOut()
    }

    getName() {
        const id = this.props.getAppState().user.uid
        rebase.fetch(`users/${id}/displayName`, {
            context: this,
        }).then(data => {
            let newState = { ...this.state}
            newState.displayName = data
            this.setState(newState);
          })
    }

    addTaskHours = () => {
    this.state.varHours = document.getElementById("myText").value 
    document.getElementById("hours").innerHTML = this.state.varHours
   //var x = document.getElementById("myText").value
  //document.getElementById("hours").innerHTML = x  
       
    }


    render = () => {

        const projectsList = this.props.getAppState().user.projects
        let projectsKeys
        if (projectsList) {
            projectsKeys = Object.keys(projectsList)
        }
        let projectIcons
        if (projectsList) {
            projectIcons = (
                projectsKeys.map((projectKey) => {
                    return <div key={projectKey} onClick={() => {
                        const newState = { ...this.props.getAppState() }
                        //if (newState.currentProject === undefined || newState.currentProject.key !== projectKey && (newState.currentProject.isPersonalDashboardProject === "false")) {
                            newState.currentProject = newState.user.projects[projectKey]
                            this.props.setAppState(newState)
                            this.props.goToUrl(`/projects/${projectKey}`)
                        //}
                    }}><ProjectIcon projectID={projectsList[projectKey].key} personalProjectID={this.props.getAppState().user.personalProjectID} projectPhotoURL={projectsList[projectKey].projectPhotoURL}/></div>
                })
            )
        }

        let notificationText
        if (this.props.getAppState().user.notifications) {
            notificationText = "notifications_active"
        } else {
            notificationText = "notifications_none"
        }

        return (
            <div id="mainContainer">
                <div id="projectsSelector">
                    <div onClick={() => {
                        const newState = { ...this.props.getAppState() }
                        newState.currentProject = newState.user.projects[newState.user.personalProjectID]
                        this.props.setAppState(newState)
                        this.props.goToUrl(`/projects/${newState.user.personalProjectID}`)

                        //this.props.goToUrl("/dashboard")

                    }}><ProjectIcon personalIcon={true} projectPhotoURL={this.props.getAppState().user.photoURL}/></div>

                    <h5 id="projectProfileName">{this.state.displayName}</h5>
                    <img alt={"Seperator"} src={line} id="projectSeparatorLine"/>

                    {projectIcons}

                    <NewProjectButton onClick={() => {
                        this.props.goToUrl("/createproject");
                    }}/>
                    <i onClick={this.signOut} style={{position: 'fixed', bottom: '0'}} className="material-icons">&#xE31B;</i>
                    <i className="material-icons notificationButton" onClick={() => {
                        this.props.goToUrl("/notifications");
                    }}>{notificationText}</i>

                                 <textarea id="myText" rows="1" cols="3"></textarea>
                                    <button type="button" onClick={this.addTaskHours} >Submit Hours</button>
                                    <p id="remainingHours">Remaining Hours</p>
                                    <p id="hours">{this.state.varHours}</p>
        
                                                                     


                </div>
 
                <Switch>
                    <Route path="/dashboard" render={() => {
                        return (
                            <div id="taskDashboard"></div>

                        )
                    }} />
                    <Route path="/projects/:id" render={(props) => <ProjectDashboard {...props}
                        goToUrl={this.props.goToUrl} getAppState={this.props.getAppState} setAppState={this.props.setAppState} 
                        goBack={this.props.goBack}/> } />
                    <Route path="/createproject" render={() => {
                        return <CreateProjectForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} />
                    <Route path="/notifications" render={() => {
                        return <Notifications goToUrl={this.props.goToUrl} getAppState={this.props.getAppState} setAppState={this.setAppState}/>
                    }} />
                    <Route path="/createtask" render={() => {
                        return <CreateTaskForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} />
                    {/* <Route path="/deletetask" render={() => {
                        return <DeleteTaskForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} /> */}
                    <Route render={() => <Redirect to="/dashboard" />} />
                </Switch>

                <div id="myDay">
                    <MyDayTitleBar />
                </div>
            </div>
        )
    }
    

}

export default Home;
