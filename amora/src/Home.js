import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
import line from "./images/Line/Line.png"
import "./Home.css"
import ProjectIcon from "./ProjectIcon.js"
import ProjectTitleBar from "./ProjectTitleBar.js"


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

    createProject = () => {
        const project = {
            projectId: 0,
            title: "Something",
            image: "url",
            users: [ ],
            tasks: [ ]
        }
        rebase.post(`projects/${project.projectId}`, {
            data: project
        })
        console.log("got here")
    }

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
                    <button onClick={this.createProject}>Create project</button>
                </div>

                <div id="taskDashboard">
                    <ProjectTitleBar />
                </div>

                <div id="myDay">
                    This is my day, okay
                </div>
            </div>
        )
    }

}

export default Home;
