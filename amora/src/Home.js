import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Route, Switch, Redirect } from "react-router-dom";
import { Row, Grid, Col } from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
import line from "./images/Line/Line.png"
import "./Home.css"

import ProjectIcon from "./ProjectSelectorComps/ProjectIcon.js"
import ProjectTitleBar from "./ProjectDashboardComps/ProjectTitleBar.js"
import ProjectCollaboratorsBar from "./ProjectDashboardComps/ProjectCollaboratorsBar.js"
import CreateProjectForm from './CreateProjectForm.js';




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
                    <button onClick={this.signOut}>Sign out</button>
                    <button onClick={() => {
                        this.props.goToUrl("createproject");
                    }}>Create new project</button>
                </div>
                <Switch>
                    <Route path="/dashboard" render={() => {
                        return (
                            <div id="taskDashboard">
                                <ProjectTitleBar />
                                <div id="taskDashContainer">
                                </div>
                                <ProjectCollaboratorsBar />
                            </div>
                        )
                    }} />
                    <Route path="/createproject" render={() => {
                        return <CreateProjectForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
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
