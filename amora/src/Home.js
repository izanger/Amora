import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Route, Switch, Redirect } from "react-router-dom";
import { Row, Grid, Col } from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
import line from "./images/Line/Line.png"
import "./Home.css"

import ProjectIcon from "./ProjectSelectorComps/ProjectIcon.js"
import CreateProjectForm from './CreateProjectForm.js';
import ProjectDashboard from "./ProjectDashboardComps/ProjectDashboard.js"
import NewProjectButton from "./ProjectSelectorComps/NewProjectButton.js"
import Notifications from "./Notifications.js"




class Home extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    signOut = () => {
        const newState = { ...this.props.getAppState }
        newState.user = { }
        this.props.setAppState(newState)
        auth.signOut()
    }

    //Ian: I believe this is deprecated (see CreateProjectForm component)
    // createProject = () => {
    //     const project = {
    //         projectId: 0,
    //         title: "Something",
    //         image: "url",
    //         users: [ ],
    //         tasks: [ ]
    //     }
    //     rebase.post(`projects/${project.projectId}`, {
    //         data: project
    //     })
    //     console.log("got here")
    // }

    render = () => {
        return (
            <div id="mainContainer">
                <div id="projectsSelector">
                    <ProjectIcon />

                    <h5 id="projectProfileName">Name</h5>
                    <img src={line} id="projectSeparatorLine"/>
                    <ProjectIcon />
                    <ProjectIcon />

                    <div onClick={() => {
                        console.log("HHHHH")
                        this.props.goToUrl("createproject");
                    }}><NewProjectButton /></div>
                <button onClick={this.signOut} style={{position: 'fixed', bottom: '0'}}>Sign out</button>
                <i class="material-icons notificationButton" onClick={() => {
                    this.props.goToUrl("notifications");
                }}>notifications_none</i>
                </div>
                <Switch>
                    <Route path="/dashboard" render={() => {
                        return (
                            <ProjectDashboard />
                        )
                    }} />
                    <Route path="/createproject" render={() => {
                        return <CreateProjectForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} />
                    <Route path="/notifications" render={() => {
                        return <Notifications goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
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
