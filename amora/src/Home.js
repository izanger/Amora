import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Route, Switch, Redirect } from "react-router-dom";
import { Row, Grid, Col } from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
import line from "./images/Line/Line.png"
import "./Home.css"
import { isObjectEmpty } from "./apphelpers.js"

import ProjectIcon from "./ProjectSelectorComps/ProjectIcon.js"
import CreateProjectForm from './CreateProjectForm.js';
import ProjectDashboard from "./ProjectDashboardComps/ProjectDashboard.js"
import NewProjectButton from "./ProjectSelectorComps/NewProjectButton.js"
import CreateTaskForm from './CreateTaskForm.js';
import Notifications from "./Notifications.js"




class Home extends Component {
    constructor() {
        super()
        this.state = {
            displayName: ""
        }
    }

    componentWillMount() {
       this.getName();
    }

    signOut = () => {
        console.log("hi")
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
                        if (newState.project === undefined || newState.project.key !== projectKey) {
                            newState.currentProject = newState.user.projects[projectKey]
                            this.props.setAppState(newState)
                            this.props.goToUrl(`/projects/${projectKey}`)
                        }
                    }}><ProjectIcon projectPhotoURL={projectsList[projectKey].projectPhotoURL}/></div>
                })
            )
        }

        return (
            <div id="mainContainer">
                <div id="projectsSelector">
                    <div onClick={() => {
                        this.props.goToUrl("/dashboard")
                    }}><ProjectIcon projectPhotoURL={this.props.getAppState().user.photoURL}/></div>

                    <h5 id="projectProfileName">{this.state.displayName}</h5>
                    <img src={line} id="projectSeparatorLine"/>

                    {projectIcons}

                    <NewProjectButton onClick={() => {
                        this.props.goToUrl("/createproject");
                    }}/>
                    <i onClick={this.signOut} style={{position: 'fixed', bottom: '0'}} className="material-icons">&#xE31B;</i>
                    <i className="material-icons notificationButton" onClick={() => {
                        this.props.goToUrl("/notifications");
                    }}>notifications_none</i>
                </div>
                
                <Switch>
                    <Route path="/dashboard" render={() => {
                        return (
                            <div id="taskDashboard"></div>
                        )
                    }} />
                    <Route path="/projects/:id" render={(props) => <ProjectDashboard {...props} 
                    goToUrl={this.props.goToUrl} getAppState={this.props.getAppState} /> } />
                    <Route path="/createproject" render={() => {
                        return <CreateProjectForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} />
                    <Route path="/notifications" render={() => {
                        return <Notifications goToUrl={this.props.goToUrl} getAppState={this.props.getAppState} setAppState={this.setAppState}/>
                    }} />
                    <Route path="/createtask" render={() => {
                        return <CreateTaskForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} />
                    <Route render={() => <Redirect to="/dashboard" />} />
                </Switch>

                <div id="myDay">
                    This is my day, okay
                </div>
            </div>
        )
    }

}

export default Home;
